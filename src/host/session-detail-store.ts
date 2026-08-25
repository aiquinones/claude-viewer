import * as vscode from 'vscode';
import { findAgent } from '../model/sessions/find-agent';
import { SessionDetail, SessionRef } from '../model/usage/types';
import { AGENT_POLL_MS, cachedAgents } from './agents-store';
import { requestSessionDetail } from './session-detail';

// The session analysis page reads one session because a row was clicked — and then keeps reading it
// for as long as a live agent is still appending to it. Without this the page is a photograph: the
// turn chart, the context curve and the skill loads are whatever the file held when you opened it,
// and the agent behind them goes on working.
//
// The poll is here rather than on an interval in the webview because a hidden panel still holds its
// webview — `retainContextWhenHidden` — so a timer in there would go on reading transcripts for a
// tab nobody is looking at. That costs more than one file's worth: a Copilot session's detail is
// read by a scan over every Copilot session directory, not just the open one.

// How often the open session is re-read. The agents rate itself rather than a copy of the number:
// this page is showing the same agent an Active Agents row would, so "as fresh as that row" is one
// constant with one home.
//
// Deliberately not annotated — a type here would widen the keys SessionDetailPollMode derives from.
export const SESSION_DETAIL_POLL_MS = {
  // The session page is open, on a panel that's on screen.
  live: AGENT_POLL_MS.live,
  // Anything else. Not a rate: the entry exists so `off` is a mode like any other.
  off: 0
} as const;

export type SessionDetailPollMode = keyof typeof SESSION_DETAIL_POLL_MS;

// Which session the page is on, or none. Set by the webview: going back to the Sessions tab doesn't
// change the surface, so nothing else can tell the host that the page closed.
let watched: SessionRef | undefined;
let published: string | undefined;
let pollMode: SessionDetailPollMode = 'off';
let pollTimer: NodeJS.Timeout | undefined;

const changeEmitter: vscode.EventEmitter<SessionDetail> = new vscode.EventEmitter();

export const onDidChangeSessionDetail: vscode.Event<SessionDetail> = changeEmitter.event;

// The page opening on a session, or leaving one. The read is immediate — you clicked a row — and
// the poll takes over from there.
export const watchSession = (session: SessionRef | undefined): void => {
  watched = session;
  published = undefined;
  clearTimer();

  if (session) void read();
};

// The refresh button means everything on screen, so it means this too while a session is open.
export const refreshSessionDetail = async (): Promise<void> => {
  if (watched) await read();
};

// What the panel is showing. Same arrangement as the other three stores — the store owns the timer,
// the panel owns the question of whether anyone is looking.
//
// Entering a polling mode reads now: a panel coming back into view is exactly the case where what's
// on screen has been stale for as long as it was hidden.
export const setSessionDetailPollMode = (mode: SessionDetailPollMode): void => {
  if (mode === pollMode) return;
  pollMode = mode;
  clearTimer();

  if (SESSION_DETAIL_POLL_MS[mode] !== 0 && watched) void read();
};

const read = async (): Promise<void> => {
  const session: SessionRef | undefined = watched;
  if (!session) return;

  const detail: SessionDetail = await requestSessionDetail(session);

  // The page may have moved on while the file was being read, and a reply about a session nobody is
  // looking at would replace the one they are. The webview drops these too — this is the half that
  // keeps a stale read from re-arming the timer below.
  if (watched?.sessionId !== session.sessionId || watched.tool !== session.tool) return;

  publish(detail);
  schedulePoll();
};

// Most passes over a session nobody is prompting find exactly what the last one did, and firing
// anyway would redraw both charts every two seconds for nothing. The whole detail rather than the
// fields that happen to render today, the same rule the agents store follows — a new field would
// otherwise quietly stop reaching the view.
const publish = (detail: SessionDetail): void => {
  const signature: string = JSON.stringify(detail);
  if (signature === published) return;

  published = signature;
  changeEmitter.fire(detail);
};

// Chained off the end of each pass rather than an interval, so a slow disk can't stack passes up
// behind each other.
const schedulePoll = (): void => {
  clearTimer();

  const interval: number = SESSION_DETAIL_POLL_MS[pollMode];
  if (interval === 0 || !watched) return;

  pollTimer = setTimeout(() => void poll(), interval);
};

// The timer stays armed while the page is open and the read is what's conditional. A session with no
// agent on it has nothing to re-read — and one that was already over when you opened it can be
// resumed in a terminal a minute later, which is the case a timer torn down on liveness would miss.
const poll = async (): Promise<void> => {
  if (isLive()) return void read();
  schedulePoll();
};

const isLive = (): boolean =>
  watched !== undefined &&
  findAgent({ agents: cachedAgents(), sessionId: watched.sessionId, tool: watched.tool }) !==
    undefined;

const clearTimer = (): void => {
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = undefined;
};

export const stopWatchingSessionDetail = (): void => {
  setSessionDetailPollMode('off');
  watchSession(undefined);
};
