// Turns a real `~/.codex/sessions/<y>/<m>/<d>/rollout-*.jsonl` into the fixture the status test
// reads.
//
//   node tests/fixtures/clean-codex-rollout.mjs <rollout.jsonl> > tests/fixtures/codex-session.json
//
// A real rollout is over a megabyte: the opening `session_meta` line alone carries an 18KB system
// prompt, and a single tool output ran 30KB. None of that reaches the status rule, and this repo is
// public — so the script keeps only the fields the rule matches on and drops every body.
//
// What survives is the line skeleton: the two-level `type` / `payload.type` pair the tail rule reads,
// the `call_id` that pairs a tool call with its output, the tool's `name`, and the two token figures.
// Prompts and model prose are replaced with a paraphrase or a marker naming what was dropped.
//
// `expected` is filled in by a *forward* pass over the same lines: a turn is open from
// `task_started` until `task_complete` or `turn_aborted`, and a session with an open turn is
// running. That is deliberately a different algorithm from the backward walk under test, so the
// fixture is an independent oracle rather than a recording of what the code already does — which is
// the only way this kind of test can fail.
//
// The values are `AgentActivity` — what the badge says — rather than the tail the rule returns, so
// the annotation reads as the row a person would see.
//
// It is still a judgement and still wants reviewing: nothing in a log states a status. Regenerating
// re-derives it, so read the diff rather than trusting it.
import { readFileSync } from 'node:fs';

// The only payload fields the tail rule and `readRollout` look at. Everything else is dropped —
// `input` and `output` especially, which carry the agent's own work and the repo's own files.
const KEPT_FIELDS = ['name', 'call_id', 'model_context_window'];

// Prompt bodies, by line index, paraphrased. The real ones are the developer's own prompts about
// this repo — benign, but real session text, and the house rule is that fixtures are synthetic.
const PARAPHRASE = {
  9: 'the scope pill in the row is really ugly, come up with another option',
  60: 'go ahead',
  162: 'now open the PR'
};

const path = process.argv[2];
if (!path) {
  console.error('usage: node clean-codex-rollout.mjs <rollout.jsonl>');
  process.exit(1);
}

const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean);

// A paraphrase where one is written, else a marker that says what was dropped without quoting it.
const itemText = (raw, index) => {
  const written = PARAPHRASE[index];
  if (written !== undefined) return written;

  const length = (raw.payload?.item?.content ?? [])
    .map((part) => (part.text ?? '').length)
    .reduce((running, count) => running + count, 0);
  return `[${raw.payload?.item?.type ?? 'item'} content redacted, ${length} chars]`;
};

// Forward simulation — see the header. `turnDepth` rather than a boolean: a rollout opens one turn
// at a time in everything measured here, but a count degrades correctly if that ever stops being
// true.
let turnDepth = 0;

const expectedAt = (raw) => {
  const kind = `${raw.type}/${raw.payload?.type ?? ''}`;
  if (kind === 'event_msg/task_started') turnDepth += 1;
  if (kind === 'event_msg/task_complete' || kind === 'event_msg/turn_aborted') {
    turnDepth = Math.max(0, turnDepth - 1);
  }
  return turnDepth > 0 ? 'running' : 'idle';
};

const rows = lines.map((line, index) => {
  const raw = JSON.parse(line);
  const expected = expectedAt(raw);
  const payload = { type: raw.payload?.type };

  for (const field of KEPT_FIELDS) {
    if (raw.payload?.[field] === undefined) continue;
    payload[field] = raw.payload[field];
  }

  // The two numbers a context bar is built from. `total_token_usage` accumulates over the session
  // and nothing reads it, so only the last request's figure is kept.
  const info = raw.payload?.info;
  if (info) {
    payload.info = {
      last_token_usage: { input_tokens: info.last_token_usage?.input_tokens },
      model_context_window: info.model_context_window
    };
  }

  // `item.type` is what says a completed item was the user's prompt. The body goes through the
  // paraphrase above.
  const item = raw.payload?.item;
  if (item) {
    payload.item = { type: item.type };
    if (item.content) payload.item.content = [{ type: 'text', text: itemText(raw, index) }];
  }

  return { expected, line: { type: raw.type, timestamp: raw.timestamp, payload } };
});

console.log(JSON.stringify(rows, null, 2));
