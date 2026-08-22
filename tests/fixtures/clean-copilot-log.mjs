// Turns a real `~/.copilot/session-state/<id>/events.jsonl` into the fixture the status test reads.
//
//   node tests/fixtures/clean-copilot-log.mjs <session-dir> > tests/fixtures/copilot-session.json
//
// A real log is 840KB of system prompts, encrypted reasoning blobs, tool arguments and tool
// results. None of that reaches the status rule, and this repo is public — so the script keeps the
// handful of `data` fields the rule reads, drops everything else, and swaps every message body for
// a synthetic stand-in. What survives is the event skeleton: the shape a session actually has.
//
// `expected` comes out empty. It's the annotation the test asserts against, and it's a judgement
// about what a row should say rather than anything the log states — so it's filled in by hand.
// Regenerating wipes it; run the test afterwards and its diff names every row and its state.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The only `data` fields the tail rule and `readEvents` look at, plus `content` for the last
// prompt. Everything not listed is dropped — `arguments` and `result` especially, which carry the
// agent's own work.
const KEPT_FIELDS = ['toolName', 'toolCallId', 'mcpServerName', 'content', 'copilotVersion'];

// `requestId` is what pairs a permission prompt with its answer. It rides `assistant.message` too,
// where nothing reads it — so it's kept only on the two events whose ids the rule matches.
const REQUEST_ID_EVENTS = ['permission.requested', 'permission.completed'];

// Message bodies, by event index, paraphrased. The real ones are the developer's own prompts and
// the model's prose about this repo — benign, but real session text, and the house rule is that
// fixtures are synthetic. Shapes are preserved where they matter; anything unmapped falls back to
// a marker naming the event and how many characters were dropped.
const PARAPHRASE = {
  4: 'hey do you have a context file about the repo?',
  6: 'Yes — the repo has a root context file describing the layout and the conventions.',
  12: 'cool,\n\n/dev-feature rename the section headings on the settings screen',
  18: '<skill-context name="dev-feature">[skill body redacted]</skill-context>',
  21: 'I will trace the section labels and read the components that render them.',
  43: 'Plan:\n- rename the headings\n- update the two stories that assert on them',
  47: 'lgtm',
  49: 'I will make the approved copy-only edits on a branch.',
  98: 'The copy changes are in place; I am correcting a validation error.',
  113: 'Implemented on the branch:\n\n- renamed the headings\n- updated the stories',
  117: 'pr pls',
  119: 'I will commit the focused copy changes and open the PR.',
  129: 'PR opened: https://example.invalid/pull/1'
};

const sessionDir = process.argv[2];
if (!sessionDir) {
  console.error('usage: node clean-copilot-log.mjs <session-dir>');
  process.exit(1);
}

const lines = readFileSync(join(sessionDir, 'events.jsonl'), 'utf8').split('\n').filter(Boolean);

// A paraphrase where one is written, else a marker that says what was dropped without quoting it.
// An empty body stays empty: a tool-only turn writes an `assistant.message` with no text, and a
// marker there would invent content the session never had.
const content = (raw, index) => {
  if (raw.data.content === '') return '';
  const written = PARAPHRASE[index];
  if (written !== undefined) return written;
  return `[${raw.type} content redacted, ${raw.data.content.length} chars]`;
};

const rows = lines.map((line, index) => {
  const raw = JSON.parse(line);
  const data = {};

  for (const field of KEPT_FIELDS) {
    if (raw.data?.[field] === undefined) continue;
    data[field] = field === 'content' ? content(raw, index) : raw.data[field];
  }
  if (REQUEST_ID_EVENTS.includes(raw.type) && raw.data?.requestId) {
    data.requestId = raw.data.requestId;
  }
  // Not matched by the rule, but it's the whole reason an aborted turn has no `turn_end`.
  if (raw.type === 'abort' && raw.data?.reason) data.reason = raw.data.reason;

  const event = { type: raw.type, timestamp: raw.timestamp };
  if (Object.keys(data).length > 0) event.data = data;

  return { expected: '', event };
});

console.log(JSON.stringify(rows, null, 2));
