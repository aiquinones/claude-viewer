import { AgentTool } from '../../model/types';
import { SurfaceId } from '../surfaces';

// Which session the analysis page should open on, asked for from somewhere that isn't the usage
// surface. An agent row's menu is the only asker today.
//
// The tool rides along with the id because that's what the page is resolved by: both CLIs mint
// their own session ids and nothing says the two namespaces can't collide.
export interface SessionTarget {
  sessionId: string;
  tool: AgentTool;
}

// The same target, plus what makes asking for it twice a second event. Without the nonce, opening a
// session, going back, and right-clicking the same row again sets state that hasn't changed — so
// nothing happens. Same shape and same reason as `Reveal`.
export interface SessionRequest extends SessionTarget {
  nonce: number;
  // Which surface asked. The page's back arrow returns there instead of to the usage tabs — a
  // journey that can't be reversed is one the reader has to navigate again from the landing page.
  // Absent when the ask came from outside the panel: a link has no surface behind it, so the
  // breadcrumb up to Usage is the whole answer.
  from?: SurfaceId;
}

// Where a session page was opened from, when that isn't the tabs it lives above. The back arrow
// goes here and says so; the breadcrumb still points at Usage, which is where the page actually is.
// Two controls, two destinations, both labelled — the arrow is "where I came from" and the crumb is
// "up one level", which is what those two have always meant.
export interface SessionOrigin {
  label: string;
  onReturn: () => void;
}
