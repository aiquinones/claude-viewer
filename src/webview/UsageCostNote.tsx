import { PRICED_AT } from '../model/usage/pricing';
import { UsageSummaryData } from '../model/usage/types';
import { UsageInfo } from './UsageInfo';

interface UsageCostNoteProps {
  summary: UsageSummaryData;
}

// Where the dollars came from, and where they didn't. Rates move on Anthropic's release schedule
// rather than this extension's, so the date they were read is printed instead of the figure being
// presented as current — and a model with no rates contributes its tokens and no dollars rather
// than being quietly priced at zero.
//
// The (i) sits *in* the sentence rather than in a flex row beside it. As a flex item it was laid out
// against the whole paragraph, so a panel too narrow for the text on one line pushed it onto a line
// of its own — an icon alone above a wall of grey.
export const UsageCostNote = ({ summary }: UsageCostNoteProps) => (
  <p className="px-1 text-xs leading-relaxed text-muted-foreground">
    <UsageInfo breakdown={summary} />
    <span className="ml-1.5">
      Claude Code reports tokens usage only, so USD is estimated from the pricing table (last
      checked: {PRICED_AT}). Copilot CLI reports AIU directly.
      {summary.unpricedModels.length > 0 && (
        <>
          {' '}
          No rates for {summary.unpricedModels.join(', ')} — those turns are in the token totals and
          not in the dollar one.
        </>
      )}
    </span>
  </p>
);
