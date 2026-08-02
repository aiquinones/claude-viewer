import { useEffect, useState } from 'react';
import { ConfigSnapshot, Reveal } from '../model/types';
import { vscode } from './vscodeApi';

// The single bridge to the extension host. The host owns the filesystem and pushes a whole
// snapshot; this hook holds the latest one and sends intents back.
export const useSnapshot = () => {
  const [snapshot, setSnapshot] = useState<ConfigSnapshot | undefined>(undefined);
  const [reveal, setReveal] = useState<Reveal | undefined>(undefined);

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type === 'snapshot') setSnapshot(message.snapshot as ConfigSnapshot);
      // A fresh object every time, so an effect keyed on it re-runs for a repeated reveal.
      if (message?.type === 'reveal') setReveal({ path: message.path, nonce: message.nonce });
    };
    window.addEventListener('message', onMessage);
    vscode.postMessage({ type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const refresh = (): void => vscode.postMessage({ type: 'refresh' });

  const openFile = (path: string): void => vscode.postMessage({ type: 'openFile', path });

  return { snapshot, reveal, refresh, openFile };
};
