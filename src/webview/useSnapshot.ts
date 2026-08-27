import { useEffect, useRef, useState } from 'react';
import { TokenEstimator } from '../model/estimate-tokens';
import { PerfReport } from '../model/perf/types';
import { DEFAULT_SETTINGS, SettingsSection, ViewerSettings } from '../model/settings/settings';
import { ThemeMode } from '../model/settings/theme';
import {
  AgentColor,
  AgentColors,
  AgentSession,
  ConfigSnapshot,
  PanelNavigation
} from '../model/types';
import {
  SessionDetail,
  SessionRef,
  UsageHistory,
  UsageReport,
  UsageScope
} from '../model/usage/types';
import { vscode } from './vscodeApi';

// The single bridge to the extension host. The host owns the filesystem and pushes a whole
// snapshot; this hook holds the latest one and sends intents back.
export const useSnapshot = () => {
  const [snapshot, setSnapshot] = useState<ConfigSnapshot | undefined>(undefined);
  // Empty until the host says otherwise — and empty is also a real answer, so nothing waits on it
  // the way the panel waits on the snapshot.
  const [agents, setAgents] = useState<AgentSession[]>([]);
  // The defaults until the host says otherwise, which is one message and arrives before the
  // snapshot — so nothing renders a budget from them in practice.
  const [settings, setSettings] = useState<ViewerSettings>(DEFAULT_SETTINGS);
  // Rows nobody has coloured, until the host says which ones have been.
  const [agentColors, setAgentColors] = useState<AgentColors>({});
  // Where something outside the webview last pointed the panel — the palette, the tree, a link.
  const [navigation, setNavigation] = useState<PanelNavigation | undefined>(undefined);
  // Undefined until the first scan lands, which is later than everything else here — it reads every
  // session log on the machine, so the host starts it in the background and posts it when it's done.
  const [usage, setUsage] = useState<UsageReport | undefined>(undefined);
  // Later still: nothing outside the Sessions tab shows this, so the host doesn't start the pass
  // behind it until that surface is open.
  const [usageHistory, setUsageHistory] = useState<UsageHistory | undefined>(undefined);
  // One session read whole, answering the last `watchSession`. Undefined until one is asked for —
  // nothing shows this until a session row is clicked.
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | undefined>(undefined);
  // What the launch cost. Posted twice — once when the page can be drawn, once when the usage scan
  // behind it lands.
  const [perf, setPerf] = useState<PerfReport | undefined>(undefined);
  // When this webview told the host it was listening, which is the end of its own boot. Nothing
  // renders it, so it's a ref: re-rendering on a number that never changes again would be noise.
  const readyAt = useRef<number>(Date.now());

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type === 'snapshot') setSnapshot(message.snapshot as ConfigSnapshot);
      // Its own message, and its own state: agents change on a schedule the config knows nothing
      // about, and neither read should cost the other one.
      if (message?.type === 'agents') setAgents(message.agents as AgentSession[]);
      if (message?.type === 'settings') setSettings(message.settings as ViewerSettings);
      if (message?.type === 'agentColors') setAgentColors(message.colors as AgentColors);
      if (message?.type === 'usage') setUsage(message.report as UsageReport);
      if (message?.type === 'usageHistory') setUsageHistory(message.history as UsageHistory);
      if (message?.type === 'sessionDetail') setSessionDetail(message.detail as SessionDetail);
      if (message?.type === 'perf') setPerf(message.report as PerfReport);
      // A fresh object every time, so an effect keyed on it re-runs when the same thing is named
      // twice — which is what the nonce riding along is for.
      if (message?.type === 'navigate') {
        setNavigation({ target: message.target, nonce: message.nonce });
      }
    };
    window.addEventListener('message', onMessage);
    readyAt.current = Date.now();
    vscode.postMessage({ type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const refresh = (): void => vscode.postMessage({ type: 'refresh' });

  const openFile = (path: string): void => vscode.postMessage({ type: 'openFile', path });

  // Go to the agent rather than to a file about it. Which of the two the host can do is a question
  // only the host can answer, so the row sends a session id and hears nothing back.
  const openAgent = (sessionId: string): void => vscode.postMessage({ type: 'openAgent', sessionId });

  // The two commands on an agent row that aren't a file. Both name a session and hear nothing back:
  // the host holds the clipboard and the pid, and neither answer is something the panel draws.
  const copySessionId = (sessionId: string): void =>
    vscode.postMessage({ type: 'copySessionId', sessionId });

  const killAgent = (sessionId: string): void => vscode.postMessage({ type: 'killAgent', sessionId });

  // Which session the analysis page is on, or none once it closes. The host answers immediately and
  // then keeps answering while a live agent is writing to it, so this both asks and says how long to
  // go on asking. The reply carries the session id back, so the view drops one that arrives after
  // the selection moved on — the same rule `useFileBody` follows.
  const watchSession = (session?: SessionRef): void =>
    vscode.postMessage({ type: 'watchSession', session });

  // Says which surface is on screen. The host polls the agent transcripts faster while theirs is
  // up, and it has no other way to know — a webview reports nothing about its own navigation.
  const reportSurface = (surface: string | undefined): void =>
    vscode.postMessage({ type: 'surfaceChanged', surface });

  // Asks the host to say something isn't built yet — a surface with no view, a theme with no
  // palette. The host writes the sentence and shows it.
  const reportNotBuilt = (title: string): void => vscode.postMessage({ type: 'notBuilt', title });

  // Asks for the Settings UI, filtered to the section the caller came from. The host turns the
  // section into the query.
  const openSettings = (section: SettingsSection): void =>
    vscode.postMessage({ type: 'openSettings', section });

  // The usage surface's scope toggle. The host writes the setting and posts the whole settings
  // object back, so nothing here guesses at what it wrote.
  const changeUsage = (change: { scope: UsageScope }): void =>
    vscode.postMessage({ type: 'setUsage', ...change });

  // The estimator dialog's Apply. Same deal as the usage toggles: the host writes it and posts the
  // whole settings object back, so every number in the panel re-derives from one message.
  const changeEstimator = (estimator: TokenEstimator): void =>
    vscode.postMessage({ type: 'setEstimator', estimator });

  // The theme menu's pick. Only ever a mode with a palette behind it — the rest go through
  // `reportNotBuilt` and write nothing.
  const changeTheme = (mode: ThemeMode): void => vscode.postMessage({ type: 'setTheme', mode });

  // The stage-naming dialog's Save. The whole map, the way the dialog held it — the host writes it
  // and posts the settings back, so nothing here guesses at what landed.
  const changeStageNames = (names: Record<string, string>): void =>
    vscode.postMessage({ type: 'setStageNames', names });

  // One row's colour. The host stores it and posts the whole map back, so nothing here guesses at
  // what it wrote.
  const setAgentColor = (args: { sessionId: string; color?: AgentColor }): void =>
    vscode.postMessage({ type: 'setAgentColor', ...args });

  return {
    snapshot,
    agents,
    perf,
    readyAt: readyAt.current,
    usage,
    usageHistory,
    sessionDetail,
    watchSession,
    changeUsage,
    changeEstimator,
    changeTheme,
    changeStageNames,
    settings,
    agentColors,
    setAgentColor,
    navigation,
    refresh,
    openFile,
    openAgent,
    copySessionId,
    killAgent,
    reportSurface,
    reportNotBuilt,
    openSettings
  };
};
