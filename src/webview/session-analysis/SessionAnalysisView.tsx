import { useMemo, useState } from 'react';
import { TokenEstimator } from '../../model/estimate-tokens';
import { AgentSession, AgentTool, SkillEntry } from '../../model/types';
import { summarizeTurns } from '../../model/usage/aggregate';
import {
  SessionDetail,
  SessionRef,
  SessionUsage,
  UsageMetric,
  UsageSummaryData
} from '../../model/usage/types';
import { Loading } from '../loading/Loading';
import { useSettings } from '../settings/SettingsContext';
import { METRIC_LABEL } from '../usage-format';
import { UsageCostNote } from '../UsageCostNote';
import { UsageMenu, UsageMenuSection } from '../usage-menu/UsageMenu';
import { plural } from '../format-size';
import { ContextSection } from './ContextSection';
import { MetricSection } from './MetricSection';
import { SessionBreadcrumb } from './SessionBreadcrumb';
import { SessionOrigin } from './session-target';
import { estimatorReason, sessionEstimator } from './session-estimator';
import { formatValue } from './session-format';
import { SkillLoadList } from './SkillLoadList';
import { toSkillLoads, SkillLoad } from './skill-loads';
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
  // Names the session the page is on, and clears it on the way out. The host reads it once and then
  // keeps re-reading while a live agent is writing to it, so this is what turns that off.
  onWatch: (session?: SessionRef) => void;
  // The live agent behind this session, if there is one. Absent on a session that's over.
  agent?: AgentSession;
  skills: SkillEntry[];
  onOpenSkill: (path: string) => void;
  onCopyId: (sessionId: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
  // Where the page was opened from, when that isn't the tabs above it. Only the breadcrumb reads it.
  origin?: SessionOrigin;
}

// One session, taken apart: what each request cost, how full the context got, and which skills it
// kept loading. A page inside the usage surface rather than a surface of its own — which is what the
// breadcrumb says, and it's why the Sessions tab still has its filter text when you go back.
export const SessionAnalysisView = ({
  session,
  detail,
  onWatch,
  agent,
  skills,
  onOpenSkill,
  onCopyId,
  onSearch,
  onRefresh,
  onBack,
  origin
}: SessionAnalysisViewProps) => {
  const mine: SessionDetail | undefined = useSessionDetail({ session, detail, onWatch });

  return (
    <div className="flex h-full flex-col">
      <SessionBreadcrumb
        session={session}
        agent={agent}
        onBack={onBack}
        origin={origin}
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

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
      <div className="flex flex-col gap-5 px-4 py-4">
        <Headline detail={detail} summary={summary} metric={metric.value} />

        {metric.value === 'cost' && detail.tool === 'claude' && <UsageCostNote summary={summary} />}

        <MetricSection detail={detail} metric={metric.value} costBasis={costBasis.value} />

        <ContextSection detail={detail} />

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
