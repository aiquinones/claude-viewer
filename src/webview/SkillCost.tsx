import { SkillEntry } from '../model/types';
import { formatBytes, formatTokens } from './format-size';

interface SkillCostProps {
  skill: SkillEntry;
}

// What a skill costs, which is two numbers rather than one: its name and description sit in the
// system prompt whether or not it ever runs, and the file itself is only read once Claude picks it.
// A single "size" would be answering the wrong question.
export const SkillCost = ({ skill }: SkillCostProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cost</h2>
    <dl className="flex flex-col gap-1 text-xs">
      <Line
        label="Listed"
        value={`~${formatTokens(skill.listingEstimatedTokens)} est. tokens`}
        note={
          skill.shadowedBy
            ? 'nothing — a shadowed skill is never listed'
            : 'name and description, on every request'
        }
        struck={skill.shadowedBy !== undefined}
      />
      <Line
        label="Body"
        value={`${formatBytes(skill.chars)} · ~${formatTokens(skill.estimatedTokens)} est. tokens`}
        note="the whole SKILL.md, read when the skill runs"
      />
    </dl>
  </section>
);

interface LineProps {
  label: string;
  value: string;
  note: string;
  struck?: boolean;
}

const Line = ({ label, value, note, struck }: LineProps) => (
  <div className="flex flex-wrap items-baseline gap-x-2">
    <dt className="w-12 shrink-0 text-muted-foreground">{label}</dt>
    <dd className="flex flex-wrap items-baseline gap-x-2">
      <span className={struck ? 'mono line-through opacity-60' : 'mono'}>{value}</span>
      <span className="text-muted-foreground">{note}</span>
    </dd>
  </div>
);
