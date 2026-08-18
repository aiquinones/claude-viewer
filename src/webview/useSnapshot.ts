import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, ViewerSettings } from '../model/settings/settings';
import { AgentColor, AgentColors, AgentSession, ConfigSnapshot, Reveal } from '../model/types';
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
  const [reveal, setReveal] = useState<Reveal | undefined>(undefined);

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type === 'snapshot') setSnapshot(message.snapshot as ConfigSnapshot);
      // Its own message, and its own state: agents change on a schedule the config knows nothing
      // about, and neither read should cost the other one.
      if (message?.type === 'agents') setAgents(message.agents as AgentSession[]);
      if (message?.type === 'settings') setSettings(message.settings as ViewerSettings);
      if (message?.type === 'agentColors') setAgentColors(message.colors as AgentColors);
      // A fresh object every time, so an effect keyed on it re-runs for a repeated reveal.
      if (message?.type === 'reveal') setReveal({ path: message.path, nonce: message.nonce });
    };
    window.addEventListener('message', onMessage);
    vscode.postMessage({ type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const refresh = (): void => vscode.postMessage({ type: 'refresh' });

  const openFile = (path: string): void => vscode.postMessage({ type: 'openFile', path });

  // Says which surface is on screen. The host polls the agent transcripts faster while theirs is
  // up, and it has no other way to know — a webview reports nothing about its own navigation.
  const reportSurface = (surface: string | undefined): void =>
    vscode.postMessage({ type: 'surfaceChanged', surface });

  // Asks the host to say a surface isn't built. The host writes the sentence and shows it.
  const reportUnavailable = (title: string): void =>
    vscode.postMessage({ type: 'surfaceUnavailable', title });

  // Asks for the Settings UI. The host owns which keys it opens on.
  const openSettings = (): void => vscode.postMessage({ type: 'openSettings' });

  // One row's colour. The host stores it and posts the whole map back, so nothing here guesses at
  // what it wrote.
  const setAgentColor = (args: { sessionId: string; color?: AgentColor }): void =>
    vscode.postMessage({ type: 'setAgentColor', ...args });

  return {
    snapshot,
    agents,
    settings,
    agentColors,
    setAgentColor,
    reveal,
    refresh,
    openFile,
    reportSurface,
    reportUnavailable,
    openSettings
  };
};
