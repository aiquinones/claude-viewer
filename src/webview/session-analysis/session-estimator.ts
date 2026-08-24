// Which approximation a session's skill sizes are read under. Derived from the session rather than
// taken from the setting: this page is about what one session spent, and a session ran on one
// tokenizer whatever the panel's default says.
//
// The setting still wins where the two disagree — it is the setting — but the view says so, which is
// what makes the number arguable rather than mysterious.

import { TokenEstimator } from '../../model/estimate-tokens';
import { AgentTool } from '../../model/types';
import { UsageModelUse } from '../../model/usage/types';

// What a Claude model id starts with, under either CLI's spelling. Both write the alias rather than
// a dated snapshot — `claude-opus-5`, `claude-haiku-4.5` — so the prefix is the whole test.
const CLAUDE_MODEL_PREFIX: string = 'claude-';

interface SessionEstimatorArgs {
  tool: AgentTool;
  // Sorted by output tokens, largest first — so the first is the model that did the work rather than
  // the one that happened to answer first.
  models: UsageModelUse[];
}

// Claude Code always ran a Claude model. Copilot runs both, so the leading model decides: a Copilot
// session on Claude is measured the same way a Claude session is, and one on GPT falls back to the
// published rule of thumb.
export const sessionEstimator = ({ tool, models }: SessionEstimatorArgs): TokenEstimator => {
  if (tool === 'claude') return 'anthropic';

  const leader: string = models[0]?.model ?? '';
  return leader.startsWith(CLAUDE_MODEL_PREFIX) ? 'anthropic' : 'standard';
};

// Why the session would be read that way, for the card that explains the override. One sentence per
// case, because each one is a different reason for the same answer.
export const estimatorReason = ({ tool, models }: SessionEstimatorArgs): string => {
  if (tool === 'claude') return 'This is a Claude Code session, so it ran Claude’s tokenizer.';

  const leader: string = models[0]?.model ?? '';
  if (leader.startsWith(CLAUDE_MODEL_PREFIX)) {
    return `This Copilot session mostly ran ${leader}, which is a Claude model.`;
  }

  return leader
    ? `This Copilot session mostly ran ${leader}, which is not a Claude model.`
    : 'Nothing in this session says which model ran.';
};
