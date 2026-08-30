import { TokenEstimator } from '../../model/estimate-tokens';
import { AgentTool } from '../../model/types';
import { formatTokens, plural } from '../format-size';
import { EstimatorNote } from './EstimatorNote';
import { SkillLoad, unsizedCount, weightedTotal } from './skill-loads';
import { SkillLoadRow } from './SkillLoadRow';

interface SkillLoadListProps {
  loads: SkillLoad[];
  // Which CLI wrote the session. Only for the empty case: two of the three record a skill load and
  // one records nothing, so an empty list means different things and can't say one sentence.
  tool: AgentTool;
  // What the sizes are measured with, what the session would have measured them with, and why. The
  // three travel together because the card that explains one needs all of them.
  estimator: TokenEstimator;
  sessionEstimator: TokenEstimator;
  reason: string;
  onUseSessionEstimator: () => void;
  onOpenSkill: (path: string) => void;
}

// Which skills ran, how often their bodies were loaded, and what that cost. The heading carries the
// weighted sum — size × loads — because that is the number the section exists for: three loads of an
// 1,800-token skill is 5,400 tokens spent on one file.
export const SkillLoadList = ({
  loads,
  tool,
  estimator,
  sessionEstimator,
  reason,
  onUseSessionEstimator,
  onOpenSkill
}: SkillLoadListProps) => {
  if (loads.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-sm text-muted-foreground">{emptyLine(tool)}</p>
    );
  }

  const scale: number = Math.max(...loads.map((load) => load.size ?? 0));
  const unsized: number = unsizedCount(loads);
  // The setting and the session disagree, so every size on the page is worth explaining. When they
  // agree there's nothing to say and no card opens.
  const overridden: boolean = estimator !== sessionEstimator;

  const explain = (size: number | undefined, from: SkillLoad['sizeFrom']) => {
    const text: string = size === undefined ? '—' : `${formatTokens(size)} est.`;
    const label = (
      <span className={size === undefined ? 'text-muted-foreground' : ''} title={sizeTitle(from)}>
        {text}
      </span>
    );

    if (!overridden || size === undefined) return label;

    return (
      <EstimatorNote
        session={sessionEstimator}
        reason={reason}
        setting={estimator}
        overridden
        onUseSession={onUseSessionEstimator}
      >
        <span className="underline decoration-dotted underline-offset-2">{label}</span>
      </EstimatorNote>
    );
  };

  return (
    <section className="flex flex-col rounded-lg border border-border">
      <div className="flex flex-wrap items-baseline gap-x-2 border-b border-border px-4 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Skills used
        </h2>
        <span className="ml-auto text-sm tabular-nums">
          {formatTokens(weightedTotal(loads))} est.
        </span>
        <span className="w-full text-[11px] text-muted-foreground">
          {plural(loads.length, 'skill')} · every load added up
          {unsized > 0 && ` · ${unsized} with no size on record, not counted`}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {loads.map((load) => (
          <SkillLoadRow
            key={load.name}
            load={load}
            scale={scale}
            size={explain(load.size, load.sizeFrom)}
            onOpenSkill={onOpenSkill}
          />
        ))}
      </div>
    </section>
  );
};

// Where a row's size came from. Only the unusual answers say anything — the installed file is the
// rule, and a tooltip repeating the rule on every row is noise.
const sizeTitle = (from: SkillLoad['sizeFrom']): string | undefined => {
  if (from === 'read') return 'Measured from the SKILL.md the session read';
  if (from === 'recorded') return 'Measured from what the session log recorded loading';
  if (from === 'unknown') return 'Not installed here, and the log did not record its size';
  return undefined;
};

// All three CLIs leave a record of a load, so an empty list is a session that loaded nothing. Codex
// still gets its own sentence: its record is the command that read the file rather than an event,
// so a skill it followed without opening the file is one this list can't see.
const emptyLine = (tool: AgentTool): string =>
  tool === 'codex'
    ? 'No SKILL.md was read in this session. Codex records a skill load only as the command that opened it.'
    : 'No skills were loaded in this session.';
