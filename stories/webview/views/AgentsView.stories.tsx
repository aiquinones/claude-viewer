import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  allAgents,
  copilotAgents,
  everyMoodAgents,
  idleAgent,
  noTranscriptAgent,
  remoteAgents,
  workingAgent
} from '../../agent-fixtures';
import { allSkills, snapshot } from '../../fixtures';
import { AgentsView } from '@src/webview/views/AgentsView';

// The whole surface. Ages are relative to when the story loads, so the badges here move on their
// own — a working agent crosses to waiting after a minute of not being touched, which is exactly
// what the real surface does.
const meta: Meta<typeof AgentsView> = {
  title: 'Agents/AgentsView',
  component: AgentsView,
  args: {
    onOpenAgent: () => undefined,
    onOpenFile: () => undefined,
    onSearch: () => undefined,
    onRefresh: () => undefined,
    onBack: () => undefined
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentsView>;

// Both CLIs in one list, sorted by when each last wrote rather than by which tool it is. This is
// the story to read for whether the tag does its job: the rows have to stay scannable when they
// don't all come from the same place.
export const Default: Story = {
  args: { agents: allAgents, snapshot: snapshot({ skills: allSkills }) }
};

// Copilot only, which is what the surface looks like for someone who doesn't run Claude Code — and
// the check that the tag doesn't only work by contrast with the rows next to it.
export const CopilotOnly: Story = {
  args: { agents: copilotAgents, snapshot: snapshot({ skills: allSkills }) }
};

// Nothing running is an answer, not a failure — and the only state that has no rows to show.
export const NoSessions: Story = {
  args: { agents: [], snapshot: snapshot({ skills: allSkills }) }
};

// One group folded. The count stays in the heading, so a folded group still says how many agents
// it's hiding — which is the state to check when the elsewhere list is the long one.
export const Collapsed: Story = {
  args: {
    agents: allAgents,
    snapshot: snapshot({ skills: allSkills }),
    initialCollapsed: ['elsewhere']
  }
};

// Both folded: the surface reduces to its two headings, and the header's own count is the only
// thing still saying what's running.
export const AllCollapsed: Story = {
  args: {
    agents: allAgents,
    snapshot: snapshot({ skills: allSkills }),
    initialCollapsed: ['here', 'elsewhere']
  }
};

// One agent, in this folder, mid-turn. The dot is the only thing on the surface that moves.
export const OneWorking: Story = {
  args: { agents: [workingAgent], snapshot: snapshot({ skills: allSkills }) }
};

// No folder open: nothing can be "this workspace", so the grouping heading goes away rather than
// leaving every row under "Elsewhere".
export const NoWorkspace: Story = {
  args: {
    agents: remoteAgents,
    snapshot: { ...snapshot({ skills: allSkills }), workspaceRoot: undefined }
  }
};

// No folder open, with that group marked collapsed anyway. It has no heading, so there's no
// control to fold it with and the rows stay — the flag is ignored rather than hiding everything.
export const NoWorkspaceCollapsed: Story = {
  args: {
    agents: remoteAgents,
    snapshot: { ...snapshot({ skills: allSkills }), workspaceRoot: undefined },
    initialCollapsed: ['elsewhere']
  }
};

// A live process whose transcript isn't on disk yet. The row still renders, carrying the reason —
// and with no title to show, it falls back to the folder it's working in.
export const NoTranscript: Story = {
  args: { agents: [noTranscriptAgent, idleAgent], snapshot: snapshot({ skills: allSkills }) }
};

// The other list. Same sessions, same groups, same order — the robot carries the state, so the
// badge and the tool tag come off the row.
export const Robots: Story = {
  args: {
    agents: allAgents,
    snapshot: snapshot({ skills: allSkills }),
    initialMode: 'robots'
  }
};

// Four rows, one per pose, which is the arrangement that shows whether they read against each
// other rather than one at a time. The colour picker works here — hover a row and pick one.
export const RobotsEveryMood: Story = {
  args: {
    agents: everyMoodAgents,
    snapshot: snapshot({ skills: allSkills }),
    initialMode: 'robots'
  }
};

// Copilot only, in Robots mode: its blocked state is read off the disk rather than inferred, and it
// still draws the waiting robot — a permission prompt on `bash` is waiting on a machine.
export const RobotsCopilotOnly: Story = {
  args: {
    agents: copilotAgents,
    snapshot: snapshot({ skills: allSkills }),
    initialMode: 'robots'
  }
};
