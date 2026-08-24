// How full the context was at each request of a session, read off the turns already parsed.
//
// Claude's three input counters are disjoint slices of one prompt — `input_tokens` is only the part
// that was neither read from cache nor written to it — so the prompt is all three added up. The same
// sum `sessions/claude/transcript.ts` does for the agent row's bar, once per turn instead of once at
// the end of the file.

import { ContextPoint, UsageTurn } from '../types';

// A turn whose counters are all zero measured nothing, and a point at zero would be a claim that the
// context was empty. That is every Copilot turn: its event log records output tokens and nothing
// else, which is why that side reads its series out of the usage database instead.
export const contextPointsFromTurns = (turns: UsageTurn[]): ContextPoint[] =>
  turns
    .map((turn) => ({ at: turn.at, model: turn.model, tokens: promptSize(turn) }))
    .filter((point) => point.tokens > 0)
    .sort((left, right) => left.at - right.at);

// What the request carried. Output isn't in it — what the model wrote this turn is counted in the
// next request's input.
const promptSize = (turn: UsageTurn): number =>
  turn.tokens.input + turn.tokens.cacheRead + turn.tokens.cacheWrite5m + turn.tokens.cacheWrite1h;
