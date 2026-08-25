import { AgentTool } from '../../model/types';

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
}
