import { describe, expect, it } from 'vitest';
import { claudeSkillsIn } from '@src/model/sessions/claude/skills';
import { copilotSkillsIn } from '@src/model/sessions/copilot/skills';

// Both readers are handed the lines appended since the last pass, so each has to be a function of
// its own lines alone — a rule that needed a line from an earlier chunk would drop a live load.
// Synthetic lines shaped like the real ones, the way every fixture here is.

const claudeLine = (line: Record<string, unknown>): string => JSON.stringify(line);

const skillToolUse = (skill: string): string =>
  claudeLine({
    type: 'assistant',
    timestamp: '2026-08-26T10:00:00.000Z',
    message: {
      content: [{ type: 'tool_use', name: 'Skill', input: { skill } }]
    }
  });

const slashCommand = (name: string): string =>
  claudeLine({
    type: 'user',
    timestamp: '2026-08-26T10:00:00.000Z',
    message: { content: `<command-name>/${name}</command-name><command-args></command-args>` }
  });

describe('claudeSkillsIn', () => {
  it('reads the skill the model asked for', () => {
    expect(claudeSkillsIn([skillToolUse('dev-feature')])).toEqual(['dev-feature']);
  });

  it('reads the skill you typed', () => {
    expect(claudeSkillsIn([slashCommand('create-pr')])).toEqual(['create-pr']);
  });

  it('keeps the loads in the order the log wrote them', () => {
    const lines: string[] = [
      slashCommand('dev-feature'),
      claudeLine({ type: 'assistant', message: { content: [{ type: 'text' }] } }),
      skillToolUse('read-project-structure')
    ];
    expect(claudeSkillsIn(lines)).toEqual(['dev-feature', 'read-project-structure']);
  });

  // The gate `usage/claude/invocations.ts` applies — a command counts only once its name has also
  // been stamped as an `attributionSkill` — is deliberately not here: the stamp arrives on the next
  // turn, and a poll landing between the two would drop the command for good. The cost is that a
  // built-in reads as a load, which opens no stage because nobody names one.
  it('counts a built-in command, having no way to tell it from a skill', () => {
    expect(claudeSkillsIn([slashCommand('clear')])).toEqual(['clear']);
  });

  // A tool result's content is an array of blocks rather than a string, which is the shape the
  // command rule must not read — and a torn line is routine at both ends of a chunk.
  it('skips lines that name no skill, and lines that do not parse', () => {
    const lines: string[] = [
      '{"type":"assistant","message":{"content":[{"ty',
      claudeLine({ type: 'user', message: { content: [{ type: 'tool_result' }] } }),
      claudeLine({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Bash' }] } })
    ];
    expect(claudeSkillsIn(lines)).toEqual([]);
  });
});

const skillEvent = (name: string): string =>
  JSON.stringify({
    type: 'skill.invoked',
    timestamp: '2026-08-26T10:00:00.000Z',
    data: { name, path: '/skills/x/SKILL.md', content: 'the whole body', source: 'project' }
  });

describe('copilotSkillsIn', () => {
  it('reads the name off a skill.invoked', () => {
    expect(copilotSkillsIn([skillEvent('dev-feature')])).toEqual(['dev-feature']);
  });

  // One `/skill` writes two of these — the CLI injects the body because you typed the name, and the
  // model then calls the tool to fetch what it already has. Both are real loads; collapsing the run
  // into one stage is `readSessionScan`'s job, not this one's.
  it('reports the double load rather than collapsing it', () => {
    expect(copilotSkillsIn([skillEvent('dev-feature'), skillEvent('dev-feature')])).toEqual([
      'dev-feature',
      'dev-feature'
    ]);
  });

  // The system prompt lists the event vocabulary, so a line mentioning `skill.invoked` isn't
  // necessarily one — the prefilter is a prefilter and the type is what decides.
  it('ignores an event that only mentions the type', () => {
    const mention: string = JSON.stringify({
      type: 'system.message',
      data: { content: 'events include "skill.invoked" and "assistant.turn_end"' }
    });
    expect(copilotSkillsIn([mention])).toEqual([]);
  });

  it('skips an event with no name on it', () => {
    expect(copilotSkillsIn([JSON.stringify({ type: 'skill.invoked', data: {} })])).toEqual([]);
  });
});
