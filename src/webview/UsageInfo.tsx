import { Info } from 'lucide-react';
import {
  CACHE_MULTIPLIERS,
  ModelRates,
  PRICED_AT,
  ratesFor,
  sumUsdParts,
  USD_PART_KEYS,
  UsdPart
} from '../model/usage/pricing';
import { UsageModelUse, UsageSummaryData } from '../model/usage/types';
import {
  formatShare,
  formatRate,
  formatUsageTokens,
  formatUsd,
  USD_PART_LABEL
} from './usage-format';
import { Z } from './z-layers';

interface UsageInfoProps {
  breakdown: UsageSummaryData;
}

// The (i) beside the cost note. Same card shape as BudgetInfo, for the same reason: a number you
// can't take apart is a number you either trust blindly or dismiss.
//
// This one exists because the total invites a check that fails. A week producing 1.4M output tokens
// priced at $249 reads as a bug — until the card shows that $148 of it is cache reads, because every
// turn re-reads the context it's working in, and those tokens appear in no figure on the surface.
export const UsageInfo = ({ breakdown }: UsageInfoProps) => {
  // A window with nothing in it has nothing to explain, and an (i) that opens an empty box is worse
  // than no (i) at all.
  if (breakdown.models.length === 0) return null;

  // `align-middle` centres an inline box on the *x-height*, which leaves a 14px icon about a pixel
  // below where the eye reads the line's centre. Its bottom sits 0.23em under the baseline instead,
  // putting a 1.17em-tall icon on the cap-height centre — a length, so it holds if the text resizes.
  return (
    <span className="group relative inline-flex align-[-0.23em]">
      {/* Not a button — nothing happens on click. Tabbing here opens it via
          group-has-focus-visible; a mouse click on it doesn't, which is the point. */}
      <span
        tabIndex={0}
        aria-describedby={CARD_ID}
        className="inline-flex cursor-default rounded-sm text-muted-foreground group-hover:text-foreground group-has-focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Info className="size-3.5" />
        <span className="sr-only">how this figure is priced</span>
      </span>

      {/* `pb-1.5` rather than a margin: the gap stays inside the group, so the card survives the
        mouse crossing it. It opens upward — this sits at the bottom of the surface. */}
      <div
        id={CARD_ID}
        style={{ zIndex: Z.card }}
        className="invisible absolute bottom-full left-0 pb-1.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-has-focus-visible:visible group-has-focus-visible:opacity-100"
      >
        <div className="flex w-max max-w-[min(28rem,calc(100vw-3rem))] flex-col gap-3 rounded-md border border-border bg-popover p-3 text-xs shadow-lg">
          <CostParts breakdown={breakdown} />
          <Models models={breakdown.models} />
          <Rates models={breakdown.models} />
        </div>
      </div>
    </span>
  );
};

const CARD_ID: string = 'usage-info-card';

// How many models the card names before it stops. Beyond a handful the tail is rounding, and the
// card is a hover card.
const MODEL_LIMIT: number = 4;

interface CostPartsProps {
  breakdown: UsageSummaryData;
}

// Largest first rather than in the declared order: which piece dominates is the whole point, and it
// isn't the one anybody expects.
//
// Every part is listed whatever the basis counts, with the uncounted ones struck through and totalled
// at the bottom. That's the only way the two settings are comparable — a card that showed just the
// counted parts would make `output` look like the whole story.
const CostParts = ({ breakdown }: CostPartsProps) => {
  const parts: UsdPart[] = [...USD_PART_KEYS]
    .filter((part) => breakdown.costParts[part] > 0)
    .sort((left, right) => breakdown.costParts[right] - breakdown.costParts[left]);

  if (parts.length === 0) return null;

  const outputOnly: boolean = breakdown.costBasis === 'output';
  const uncounted: number = outputOnly
    ? sumUsdParts(breakdown.costParts) - breakdown.costParts.output
    : 0;

  return (
    <section className="flex flex-col gap-1">
      <h3 className="font-semibold text-foreground">
        What the {formatUsd(breakdown.total.usd)} is
      </h3>
      <dl className="grid grid-cols-[auto_auto] gap-x-6">
        {parts.map((part) => (
          <Line
            key={part}
            label={USD_PART_LABEL[part]}
            value={formatUsd(breakdown.costParts[part])}
            counted={!outputOnly || part === 'output'}
          />
        ))}
      </dl>
      {outputOnly ? (
        <p className="text-muted-foreground">
          Counting output only, which is how <span className="mono">/usage</span> seems to weight a
          skill. The rest comes to {formatUsd(uncounted)} at list prices.
        </p>
      ) : (
        parts[0] === 'cacheRead' && (
          <p className="text-muted-foreground">
            Cache reads lead. During every extra step, the whole conversation needs to be read.
            Caching makes this cheaper, but the conversation-to-be-read grows step by step.
          </p>
        )
      )}
    </section>
  );
};

interface ModelsProps {
  models: UsageModelUse[];
}

const Models = ({ models }: ModelsProps) => {
  if (models.length === 0) return null;

  return (
    <section className="flex flex-col gap-1 border-t border-border pt-2">
      <h3 className="font-semibold text-foreground">Models</h3>
      <dl className="grid grid-cols-[auto_auto] gap-x-6">
        {models.slice(0, MODEL_LIMIT).map((model) => (
          <Line
            key={model.model}
            label={model.model}
            value={`${formatShare(model.fraction)} · ${formatUsageTokens(model.outputTokens)} out${
              model.unpriced ? ' · not priced' : ''
            }`}
          />
        ))}
      </dl>
    </section>
  );
};

interface RatesProps {
  models: UsageModelUse[];
}

// The rate card for whichever model actually produced the window, rather than a table of every
// model — the one you're paying for is the one worth checking.
const Rates = ({ models }: RatesProps) => {
  const leader: UsageModelUse | undefined = models.find((model) => ratesFor(model.model));
  const rates: ModelRates | undefined = leader && ratesFor(leader.model);
  if (!leader || !rates) return null;

  return (
    <section className="flex flex-col gap-1 border-t border-border pt-2 text-muted-foreground">
      <h3 className="font-semibold text-foreground">
        <span className="mono">{leader.model}</span> per million tokens
      </h3>
      <dl className="grid grid-cols-[auto_auto] gap-x-6">
        <Line label="Input" value={formatRate(rates.inputPerMTok)} />
        <Line label="Output" value={formatRate(rates.outputPerMTok)} />
        <Line
          label="Cache"
          value={`reads ${CACHE_MULTIPLIERS.read}× input · writes ${CACHE_MULTIPLIERS.write5m}× (5m) and ${CACHE_MULTIPLIERS.write1h}× (1h)`}
        />
      </dl>
      <p>
        Last checked on {PRICED_AT}. Note: Subscription plans don't pay these. This is API cost.
      </p>
    </section>
  );
};

interface LineProps {
  label: string;
  value: string;
  // A figure the active basis leaves out. Struck through rather than hidden — what it costs to not
  // count it is the thing worth seeing.
  counted?: boolean;
}

// A fragment, not a wrapper: dt and dd have to be direct children of the grid or the columns stop
// lining up.
const Line = ({ label, value, counted = true }: LineProps) => (
  <>
    <dt className={counted ? 'text-muted-foreground' : 'text-muted-foreground/60'}>{label}</dt>
    <dd className={`tabular-nums ${counted ? '' : 'text-muted-foreground/60 line-through'}`}>
      {value}
    </dd>
  </>
);
