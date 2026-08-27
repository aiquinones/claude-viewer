// Turns a real `~/.codex/sessions/<y>/<m>/<d>/rollout-*.jsonl` into the fixture the usage scan test
// reads.
//
//   node tests/fixtures/clean-codex-usage.mjs <rollout.jsonl> > tests/fixtures/codex-usage-session.json
//
// A peer of `clean-codex-rollout.mjs`, not a replacement: that one keeps the line skeleton the
// *status* rule matches on and drops every number, and this one keeps the numbers. Two tests reading
// two rules off one file would have to agree about what to strip, and they don't.
//
// What survives is the counter block on each `token_count`, the `model` off each `turn_context`, the
// `ordinal`, and the timestamps. Prompts, reasoning, tool output and the system prompt are dropped
// whole — a rollout runs to a megabyte and almost all of it is the agent's own work on the
// developer's own files. Token counts are not sensitive; paths and prose are, and none reach here.
//
// Unlike the status fixture there is no `expected` to derive: what a turn cost is stated on the line
// rather than judged. The test asserts the conversion into the disjoint counters, which is the part
// with an opinion in it.
import { readFileSync } from 'node:fs';

// The counters, verbatim. Codex's convention is Copilot's — `input_tokens` is the whole prompt and
// `cached_input_tokens` is a breakdown of it — and the test exists to pin that down, so these are
// the one thing copied unchanged.
const KEPT_USAGE = [
  'input_tokens',
  'cached_input_tokens',
  'cache_write_input_tokens',
  'output_tokens',
  'reasoning_output_tokens',
  'total_tokens'
];

const path = process.argv[2];
if (!path) {
  console.error('usage: node clean-codex-usage.mjs <rollout.jsonl>');
  process.exit(1);
}

const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean);

const pick = (source, keys) => {
  if (!source || typeof source !== 'object') return undefined;
  const out = {};
  for (const key of keys) {
    if (typeof source[key] === 'number') out[key] = source[key];
  }
  return out;
};

// Only the three line kinds the usage scan reads. Everything else is dropped rather than skeletonised
// — the scan ignores it, so carrying it would only be a bigger file to review.
const clean = (raw) => {
  let line;
  try {
    line = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const payload = line.payload ?? {};
  const base = { type: line.type, timestamp: line.timestamp };
  if (typeof line.ordinal === 'number') base.ordinal = line.ordinal;

  if (line.type === 'turn_context') {
    return { ...base, payload: { model: payload.model } };
  }

  if (line.type === 'session_meta') {
    // Kept as a marker only: the scan reads the thread's own row for cwd and branch, and this line's
    // `session_id` is the field a sub-agent gets wrong. Its value is dropped so nothing is tempted
    // to read it back.
    return { ...base, payload: {} };
  }

  if (payload.type !== 'token_count') return undefined;

  const info = payload.info;
  return {
    ...base,
    payload: {
      type: 'token_count',
      info: info
        ? {
            last_token_usage: pick(info.last_token_usage, KEPT_USAGE),
            total_token_usage: pick(info.total_token_usage, KEPT_USAGE),
            model_context_window: info.model_context_window
          }
        : null
    }
  };
};

const kept = lines.map(clean).filter(Boolean);

process.stdout.write(`${JSON.stringify(kept, undefined, 2)}\n`);
