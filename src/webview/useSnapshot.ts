import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, ViewerSettings } from '../model/settings/settings';
import { ConfigSnapshot, Reveal } from '../model/types';
import { vscode } from './vscodeApi';

// The single bridge to the extension host. The host owns the filesystem and pushes a whole
// snapshot; this hook holds the latest one and sends intents back.
export const useSnapshot = () => {
  const [snapshot, setSnapshot] = useState<ConfigSnapshot | undefined>(undefined);
  // The defaults until the host says otherwise, which is one message and arrives before the
  // snapshot — so nothing renders a budget from them in practice.
  const [settings, setSettings] = useState<ViewerSettings>(DEFAULT_SETTINGS);
  const [reveal, setReveal] = useState<Reveal | undefined>(undefined);

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type === 'snapshot') setSnapshot(message.snapshot as ConfigSnapshot);
      if (message?.type === 'settings') setSettings(message.settings as ViewerSettings);
      // A fresh object every time, so an effect keyed on it re-runs for a repeated reveal.
      if (message?.type === 'reveal') setReveal({ path: message.path, nonce: message.nonce });
    };
    window.addEventListener('message', onMessage);
    vscode.postMessage({ type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const refresh = (): void => vscode.postMessage({ type: 'refresh' });

  const openFile = (path: string): void => vscode.postMessage({ type: 'openFile', path });

  // Asks the host to say a surface isn't built. The host writes the sentence and shows it.
  const reportUnavailable = (title: string): void =>
    vscode.postMessage({ type: 'surfaceUnavailable', title });

  // Asks for the Settings UI. The host owns which keys it opens on.
  const openSettings = (): void => vscode.postMessage({ type: 'openSettings' });

  return { snapshot, settings, reveal, refresh, openFile, reportUnavailable, openSettings };
};
