import { Fragment } from 'react';
import { AgentTool } from '../../model/types';
import { AgentToolIcon } from '../agent-icon/AgentToolIcon';
import { plural } from '../format-size';
import { GridDay } from './grid';
import { gridDayLabel, gridDayTools, gridDayValue } from './grid-labels';

// What one square says, as rows rather than as a sentence. A merged grid has three things to say —
// which day, how many sessions, and which CLIs — and one line naming all three runs wider than the
// panel before it reaches the second tool.
//
// Every line is the bubble's own 11px. The date leads and is muted, the total under it is the
// foreground one: the date says which square you're on, the number is what you came for.
//
// The CLIs are `AgentToolIcon`, the same component the session list under the grid uses, at its
// smallest size — a tool is drawn and coloured one way on this surface. This is the one place the
// mark is the *only* thing naming the tool, since a bubble can't carry a `title`. Two marks that
// look nothing like each other is what makes that hold.
export const GridDaySummary = ({ day }: { day: GridDay }) => {
  const tools: AgentTool[] = gridDayTools(day);

  // One tool means the total and its row are the same number twice. The row wins — it says which.
  const total: string | undefined = tools.length === 1 ? undefined : gridDayValue(day);

  return (
    <span className="flex flex-col gap-1">
      <span className="text-muted-foreground">{gridDayLabel(day)}</span>
      {total && <span className="text-popover-foreground">{total}</span>}
      <ToolRows day={day} tools={tools} />
    </span>
  );
};

interface ToolRowsProps {
  day: GridDay;
  tools: AgentTool[];
}

// One row per CLI that was there, in two columns so the counts line up under each other. The gap is
// narrower than it was for the text tag — an icon is one square, so a wide one leaves it floating
// away from the number it belongs to. Nothing at all on a day nothing ran — the total already said
// "No sessions".
const ToolRows = ({ day, tools }: ToolRowsProps) => {
  if (tools.length === 0) return null;

  return (
    <span className="grid grid-cols-[auto_auto] items-center gap-x-1.5 gap-y-0.5">
      {tools.map((tool: AgentTool) => (
        <Fragment key={tool}>
          <AgentToolIcon tool={tool} size="xs" />
          <span className="text-muted-foreground">{plural(day.byTool[tool], 'session')}</span>
        </Fragment>
      ))}
    </span>
  );
};
