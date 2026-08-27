// Turns a real `~/.claude/projects/<encoded>/<id>.jsonl` into the fixture the turn-rule test reads.
//
//   node tests/fixtures/clean-claude-transcript.mjs <transcript> <firstLine> <lastLine> \
//     > tests/fixtures/claude-transcript.json
//
// A real transcript is megabytes of prompts, model prose, tool arguments and tool results. None of
// it reaches the turn rule, and this repo is public — so the script keeps the handful of fields the
// rule reads, drops the rest, and swaps every message body for a synthetic stand-in.
//
// Sizes are the exception, and they're the whole point of this fixture. Two of the lines in the cut
// are `Read` results of half a megabyte each, which is what pushes the window past anything it can
// parse. Carrying the real bytes would mean checking a megabyte of the developer's own files into
// the repo, so the row records `padTo` instead and the test inflates the line to that size with
// filler. What survives is the shape a session has on disk: the line types, their order, and how
// big each one is.
//
// `expected` comes out empty. It's the annotation the test asserts against — a judgement about what
// a row should say, rather than anything the transcript states — so it's filled in by hand.
// Regenerating wipes it; run the test afterwards and its diff names every row and its state.
import { readFileSync } from 'node:fs';

// Anything bigger than this is recorded as a size rather than as content. Well under the smallest
// tail window, so a padded line is unmistakably the case being tested.
const PAD_THRESHOLD = 16 * 1024;

// The line-level fields the summary reads. `type` and `timestamp` ride every row separately.
const KEPT = ['isMeta', 'isApiErrorMessage', 'aiTitle', 'lastPrompt', 'prNumber', 'prUrl'];

// Three of those carry text rather than shape, and the summary reads all three — so they're
// rewritten rather than dropped. `lastPrompt` is the developer's own prompt, `aiTitle` is generated
// from it, and `prUrl` names a real repository. The *presence* of each is what the test asserts on;
// what any of them says is not.
const REDACT = {
  lastPrompt: () => 'flip the colors on the moving band',
  aiTitle: () => 'Waiting states and band styling',
  prUrl: (value) => `https://example.invalid/pull/${value.split('/').pop()}`
};

// Message bodies, by transcript line number, paraphrased. The real ones are the developer's own
// prompts and the model's prose about this repo — benign, but real session text, and the house rule
// is that fixtures are synthetic. Anything unmapped becomes a marker naming what was dropped.
const PARAPHRASE = {
  692: 'Pushed to the same branch — the PR has it.',
  695: 'flip the colors on the moving band',
  706: 'Flipping it — bright label, dim band passing through.',
  721: 'A is right — the label stays readable and a shade of the same hue reads as one control.',
  739: 'Works in both palettes. One inconsistency the flip introduces, fixing it now.',
  750: 'Flipped and pushed. The label rests at full strength and the band carries the tint.'
};

const [, , path, from, to] = process.argv;
if (!path || !from || !to) {
  console.error('usage: node clean-claude-transcript.mjs <transcript> <firstLine> <lastLine>');
  process.exit(1);
}

const all = readFileSync(path, 'utf8').split('\n').filter(Boolean);
const cut = all.slice(Number(from) - 1, Number(to));

// A block keeps its type, and a tool call its name. Text is paraphrased where a line is mapped and
// dropped to a marker where it isn't; thinking is dropped outright, since nothing reads it and it
// is the most sensitive text in the file.
const block = (raw, index) => {
  if (raw.type === 'tool_use') return { type: 'tool_use', name: raw.name };
  if (raw.type === 'thinking') return { type: 'thinking' };
  if (raw.type !== 'text') return { type: raw.type };
  const written = PARAPHRASE[index];
  return { type: 'text', text: written ?? `[text redacted, ${(raw.text ?? '').length} chars]` };
};

const rows = cut.map((line, offset) => {
  const index = Number(from) + offset;
  const raw = JSON.parse(line);
  const out = { type: raw.type };
  if (raw.timestamp) out.timestamp = raw.timestamp;
  for (const field of KEPT) {
    if (raw[field] === undefined) continue;
    out[field] = REDACT[field] ? REDACT[field](raw[field]) : raw[field];
  }

  const message = raw.message;
  if (message) {
    const content = message.content;
    out.message = {};
    if (message.model) out.message.model = message.model;
    // Every line of one response carries it, and it is the field the turn rule turns on.
    if (message.stop_reason !== undefined) out.message.stop_reason = message.stop_reason;
    if (message.usage) {
      const { input_tokens, cache_read_input_tokens, cache_creation_input_tokens } = message.usage;
      out.message.usage = { input_tokens, cache_read_input_tokens, cache_creation_input_tokens };
    }
    if (typeof content === 'string') {
      out.message.content = PARAPHRASE[index] ?? `[content redacted, ${content.length} chars]`;
    } else if (Array.isArray(content)) {
      out.message.content = content.map((entry) => block(entry, index));
    }
  }

  const row = { expected: '', line: out };
  // The two `Read` results this fixture exists for. The size is the fact being kept; the bytes are
  // half a megabyte of the developer's own source and are not.
  if (line.length > PAD_THRESHOLD) row.padTo = line.length;
  return row;
});

console.log(JSON.stringify(rows, null, 2));
