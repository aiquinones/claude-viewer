import { useMemo, useState } from 'react';
import { TokenEstimator } from '../../model/estimate-tokens';
import { AgentTool, SkillEntry } from '../../model/types';
import { summarizeTurns } from '../../model/usage/aggregate';
import {
  SessionDetail,
  SessionUsage,
  UsageMetric,
  UsageSummaryData
} from '../../model/usage/types';
import { Loading } from '../loading/Loading';
import { useSettings } from '../settings/SettingsContext';
import { formatAiu, formatUsageTokens, formatUsd, METRIC_LABEL } from '../usage-format';
import { UsageCostNote } from '../UsageCostNote';
import { UsageMenu, UsageMenuSection } from '../usage-menu/UsageMenu';
import { UsageSlices } from '../UsageSlices';
import { plural } from '../format-size';
import { SessionBreadcrumb } from './SessionBreadcrumb';
import { estimatorReason, sessionEstimator } from './session-estimator';
import { SkillLoadList } from './SkillLoadList';
import { toSkillLoads, SkillLoad } from './skill-loads';
import { toLoadMarks, toTurnBars, LoadMark, TurnBar } from './turn-bars';
import { TurnsChart } from './TurnsChart';
import { useSessionDetail } from './useSessionDetail';

// What reading one session costs. A single transcript rather than every one on the machine — 76MB
// across 87 files measured at 226ms, so one of them is a few milliseconds and this bar is mostly
// there so the pane isn't blank on a cold disk.
const DETAIL_EXPECTED_MS: number = 250;

interface SessionAnalysisViewProps {
  session: SessionUsage;
  // The last reply from the host, whichever session it was about. The hook drops one that isn't
  // this session's.
  detail: SessionDetail | undefined;
  onRequestDetail: (args: { sessionId: string; tool: AgentTool }) => void;
  skills: SkillEntry[];
  onOpenSkill: (path: string) => void;
  onCopyId: (sessionId: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// One session, taken apart: what it cost split by skill, every request it made, and which skills it
// kept loading. A page inside the usage surface rather than a surface of its own — which is what the
// breadcrumb says, and it's why the Sessions tab still has its filter text when you go back.
export const SessionAnalysisView = ({
  session,
  detail,
  onRequestDetail,
  skills,
  onOpenSkill,
  onCopyId,
  onSearch,
  onRefresh,
  onBack
}: SessionAnalysisViewProps) => {
  const mine: SessionDetail | undefined = useSessionDetail({
    session,
    detail,
    onRequest: onRequestDetail
  });

  return (
    <div className="flex h-full flex-col">
      <SessionBreadcrumb
        session={session}
        onBack={onBack}
        onCopyId={onCopyId}
        onSearch={onSearch}
        onRefresh={onRefresh}
      />

      {!mine ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading label="Reading this session…" expectedMs={DETAIL_EXPECTED_MS} />
        </div>
      ) : mine.error ? (
        <p className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
          {mine.error}
        </p>
      ) : (
        <Body detail={mine} session={session} skills={skills} onOpenSkill={onOpenSkill} />
      )}
    </div>
  );
};

interface BodyProps {
  detail: SessionDetail;
  session: SessionUsage;
  skills: SkillEntry[];
  onOpenSkill: (path: string) => void;
}

const Body = ({ detail, session, skills, onOpenSkill }: BodyProps) => {
  const { metric, costBasis } = useSettings().usage;
  const setting: TokenEstimator = useSettings().tokens.estimator.value;
  // Component state, and it writes nothing. The estimator is a preference about every number in the
  // panel; turning it off here is a question about this page, and leaving puts it back.
  const [useSession, setUseSession] = useState<boolean>(false);

  const summary: UsageSummaryData = useMemo(
    () => summarizeTurns({ turns: detail.turns, costBasis: costBasis.value }),
    [detail, costBasis.value]
  );

  const derived: TokenEstimator = sessionEstimator({ tool: detail.tool, models: summary.models });
  const estimator: TokenEstimator = useSession ? derived : setting;

  const loads: SkillLoad[] = useMemo(
    () => toSkillLoads({ invocations: detail.invocations, skills, estimator }),
    [detail, skills, estimator]
  );

  const bars: TurnBar[] = useMemo(
    () => toTurnBars({ turns: detail.turns, metric: metric.value, costBasis: costBasis.value }),
    [detail, metric.value, costBasis.value]
  );

  const marks: LoadMark[] = useMemo(
    () => toLoadMarks({ bars, invocations: detail.invocations }),
    [bars, detail]
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
      <div className="flex flex-col gap-5 px-4 py-4">
        <Headline detail={detail} summary={summary} metric={metric.value} />

        <UsageSlices
          summary={summary}
          metric={metric.value}
          empty="This session ran no requests under a skill."
          skills={skills}
          onOpenSkill={onOpenSkill}
        />

        {metric.value === 'cost' && detail.tool === 'claude' && <UsageCostNote summary={summary} />}

        <section className="flex flex-col gap-2">
          <h2 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Turns
            <span className="font-normal normal-case tracking-normal">
              {plural(bars.length, 'request')}
              {marks.length > 0 && ` · ticks are skill loads`}
            </span>
          </h2>
          <TurnsChart
            bars={bars}
            marks={marks}
            metric={metric.value}
            format={(value) => formatValue({ value, metric: metric.value, tool: detail.tool })}
          />
        </section>

        <SkillLoadList
          loads={loads}
          estimator={estimator}
          sessionEstimator={derived}
          reason={estimatorReason({ tool: detail.tool, models: summary.models })}
          onUseSessionEstimator={() => setUseSession(true)}
          onOpenSkill={onOpenSkill}
        />
      </div>
    </div>
  );
};

interface HeadlineProps {
  detail: SessionDetail;
  summary: UsageSummaryData;
  metric: UsageMetric;
}

// The session's own total, and the `...` beside it. Two settings rather than three: the scope is
// meaningless for one session, and the Claude cost basis only means something on a Claude one.
const Headline = ({ detail, summary, metric }: HeadlineProps) => (
  <section className="flex items-start gap-3">
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-2xl font-semibold tabular-nums">
        {formatValue({
          value: metric === 'output-tokens' ? summary.total.outputTokens : costOf(summary, detail),
          metric,
          tool: detail.tool
        })}
      </span>
      <span className="text-xs text-muted-foreground">
        {METRIC_LABEL[metric].toLowerCase()} · {plural(summary.total.turns, 'request')}
      </span>
    </div>
    <UsageMenu className="ml-auto mt-1 shrink-0" sections={MENU_SECTIONS[detail.tool]} />
  </section>
);

// Which settings the `...` offers, per CLI. The scope is gone from both — you are looking at one
// session, and it is in whatever folder it is in.
const MENU_SECTIONS: Record<AgentTool, readonly UsageMenuSection[]> = {
  claude: ['metric', 'costBasis'],
  copilot: ['metric']
};

const costOf = (summary: UsageSummaryData, detail: SessionDetail): number =>
  detail.tool === 'claude' ? summary.total.usd : summary.total.nanoAiu;

interface FormatValueArgs {
  value: number;
  metric: UsageMetric;
  tool: AgentTool;
}

// One session ran under one CLI, so cost is one unit here rather than the two the usage surface has
// to print side by side. Which one is the CLI's, not the reader's.
const formatValue = ({ value, metric, tool }: FormatValueArgs): string => {
  if (metric === 'output-tokens') return formatUsageTokens(value);
  return tool === 'claude' ? formatUsd(value) : formatAiu(value);
};
