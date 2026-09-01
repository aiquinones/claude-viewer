import { describe, expect, it } from 'vitest';
import { codexSkillsIn } from '@src/model/sessions/codex/skills';
import { parseCodexInvocations } from '@src/model/usage/codex/invocations';
import { SkillInvocation } from '@src/model/usage/types';

// Codex has no skill event: it loads a skill by reading the file, so the record under test is the
// shell command that did it. The interesting input is therefore a command *string*, and a real one
// carries the developer's own paths — so the cases here are written rather than cut from a rollout.
//
// Every shape below was measured first, over the 8 rollouts on this machine that mention a SKILL.md:
// 19 loads across 7 sessions, and four kinds of decoy. The decoys are the point of the test — a rule
// that only had to find `sed <path>/SKILL.md` would be three lines and would also count every `rg`
// the agent ran while looking for the skill in the first place.

const AT: string = '2026-08-30T03:59:36.785Z';

interface CallArgs {
  cmd: string;
  // The older payload shape puts the same string in `arguments` under `function_call`. Rollouts from
  // a few Codex releases back are still on it.
  older?: boolean;
  timestamp?: string;
}

// One tool-call line, as the rollout writes it. `input` is a JS snippet rather than a bare command —
// Codex hands the model a scripting tool and the command sits inside a call to it.
const call = ({ cmd, older = false, timestamp = AT }: CallArgs): string =>
  JSON.stringify({
    timestamp,
    ordinal: 12,
    type: 'response_item',
    payload: older
      ? { type: 'function_call', name: 'shell', arguments: cmd }
      : { type: 'custom_tool_call', name: 'exec', input: cmd }
  });

const exec = (shell: string): string =>
  call({ cmd: `const r = await tools.exec_command({cmd:${JSON.stringify(shell)}}); text(r.output);` });

const skillsOf = (lines: string[]): string[] =>
  parseCodexInvocations(lines).map((load) => load.skill);

describe('parseCodexInvocations', () => {
  it('reads a skill out of the command that opened it', () => {
    const found: SkillInvocation[] = parseCodexInvocations([
      exec("sed -n '1,200p' /home/dev/.codex/skills/tiny-mock/SKILL.md")
    ]);

    expect(found).toEqual([
      {
        skill: 'tiny-mock',
        at: Date.parse(AT),
        via: 'read',
        path: '/home/dev/.codex/skills/tiny-mock/SKILL.md'
      }
    ]);
  });

  it('reads the older function_call shape', () => {
    const line: string = call({
      cmd: JSON.stringify({ cmd: 'cat /home/dev/.codex/skills/tiny-mock/SKILL.md' }),
      older: true
    });

    expect(skillsOf([line])).toEqual(['tiny-mock']);
  });

  it('takes a path relative to the working directory', () => {
    const found: SkillInvocation[] = parseCodexInvocations([
      exec("sed -n '1,220p' .claude/skills/publish/SKILL.md")
    ]);

    expect(found[0].skill).toBe('publish');
    // Left as written. Resolving it needs the thread's cwd, which the parser deliberately isn't handed.
    expect(found[0].path).toBe('.claude/skills/publish/SKILL.md');
  });

  it('finds every skill a single command read', () => {
    const line: string = exec(
      "sed -n '1,260p' .claude/skills/style-plan/SKILL.md; sed -n '1,520p' .claude/skills/read-project-structure/SKILL.md"
    );

    expect(skillsOf([line])).toEqual(['style-plan', 'read-project-structure']);
  });

  it('counts one guarded read once, however many paths name it', () => {
    // `if [ -f A ]; then sed A; elif [ -f B ]; then sed B; fi` — two paths, one skill, and at most
    // one of them was ever opened.
    const line: string = exec(
      'if [ -f .claude/skills/read-best-practices/SKILL.md ]; then ' +
        "sed -n '1,260p' .claude/skills/read-best-practices/SKILL.md; " +
        "else sed -n '1,260p' /home/dev/.claude/skills/read-best-practices/SKILL.md; fi"
    );

    expect(skillsOf([line])).toEqual(['read-best-practices']);
  });

  it('counts a skill once per command, not once per session', () => {
    const lines: string[] = [
      exec("sed -n '1,200p' /home/dev/.codex/skills/tiny-mock/SKILL.md"),
      exec("sed -n '1,200p' /home/dev/.codex/skills/tiny-mock/SKILL.md")
    ];

    // Two commands really are two bodies in the context, the same call Copilot's double-fire makes.
    expect(skillsOf(lines)).toEqual(['tiny-mock', 'tiny-mock']);
  });

  describe('the decoys', () => {
    it('ignores a glob that has no directory in front of it', () => {
      const line: string = exec("rg --files -g 'SKILL.md' -g '*publish*' . .agents .codex");

      expect(skillsOf([line])).toEqual([]);
    });

    it('ignores a glob that looks like a path', () => {
      // The one that motivates capturing `*` rather than skipping it: stop the match at the slash
      // and `*/dev-feature/SKILL.md` yields a clean-looking `/dev-feature/SKILL.md`.
      const line: string = exec("find /home/dev -iname '*dev-feature*' -o -path '*/dev-feature/SKILL.md'");

      expect(skillsOf([line])).toEqual([]);
    });

    it('ignores a SKILL.md being written rather than read', () => {
      const line: string = call({
        cmd:
          'const patch = "*** Begin Patch\\n*** Update File: /home/dev/.codex/skills/tiny-mock/SKILL.md\\n";\n' +
          'text(await tools.apply_patch(patch));'
      });

      expect(skillsOf([line])).toEqual([]);
    });

    it('ignores a path built from a shell variable', () => {
      // The known miss: this really did load four skills. The name is not in the text, and expanding
      // a shell loop to find it is far more machinery than the count is worth.
      const line: string = exec(
        'for skill in read-project-structure style-plan; do ' +
          'sed -n \'1,260p\' ".claude/skills/$skill/SKILL.md"; done'
      );

      expect(skillsOf([line])).toEqual([]);
    });

    it('ignores a SKILL.md named anywhere but a tool call', () => {
      const line: string = JSON.stringify({
        timestamp: AT,
        type: 'response_item',
        payload: { type: 'message', content: [{ text: 'I will read SKILL.md files next.' }] }
      });

      expect(skillsOf([line])).toEqual([]);
    });

    it('ignores a relative file with no skill directory to name', () => {
      expect(skillsOf([exec("sed -n '1,200p' ./SKILL.md")])).toEqual([]);
    });
  });

  it('skips a line it cannot read, and one with no clock', () => {
    const torn: string = exec('cat /home/dev/.codex/skills/tiny-mock/SKILL.md').slice(0, 60);
    const undated: string = call({
      cmd: 'const r = await tools.exec_command({cmd:"cat /home/dev/.codex/skills/tiny-mock/SKILL.md"});',
      timestamp: ''
    });

    expect(parseCodexInvocations([torn, undated, ''])).toEqual([]);
  });
});

// The live-session reader over the same rule. What it adds is only the mapping to names — the trail
// cache above it does the collapsing and the cap.
describe('codexSkillsIn', () => {
  it('names the skills in the order they were read', () => {
    const lines: string[] = [
      exec("sed -n '1,240p' /home/dev/.codex/skills/.system/skill-creator/SKILL.md"),
      exec("rg --files -g 'SKILL.md' ."),
      exec("sed -n '1,200p' /home/dev/.codex/skills/tiny-mock/SKILL.md")
    ];

    expect(codexSkillsIn(lines)).toEqual(['skill-creator', 'tiny-mock']);
  });

  it('is a function of the lines it is handed alone', () => {
    // The trail cache only ever passes the bytes appended since the last pass, so a reader that
    // needed the head of the file would go blind one poll in.
    expect(codexSkillsIn([exec("cat /home/dev/.codex/skills/tiny-mock/SKILL.md")])).toEqual([
      'tiny-mock'
    ]);
  });
});
