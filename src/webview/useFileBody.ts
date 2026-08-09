import { useEffect, useState } from 'react';
import { FileBody } from '../model/types';
import { vscode } from './vscodeApi';

interface UseFileBodyArgs {
  // The selected file, or undefined when nothing is selected.
  path: string | undefined;
  // The snapshot's build time. A rebuild means the file may have changed, so the body is re-read.
  loadedAt: number;
}

// Asks the host for one file's text and holds the answer. Deliberately not cached: a local file
// read costs nothing next to getting invalidation wrong and rendering a file that no longer says
// what it says on disk.
export const useFileBody = ({ path, loadedAt }: UseFileBodyArgs) => {
  const [result, setResult] = useState<FileBody | undefined>(undefined);

  useEffect(() => {
    if (!path) return;

    // A reply for a file that is no longer selected is dropped rather than rendered.
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type !== 'fileBody' || message.path !== path) return;
      setResult({ path: message.path, body: message.body, error: message.error });
    };

    window.addEventListener('message', onMessage);
    vscode.postMessage({ type: 'requestBody', path });
    return () => window.removeEventListener('message', onMessage);
  }, [path, loadedAt]);

  const current: FileBody | undefined = result?.path === path ? result : undefined;

  return {
    body: current?.body,
    error: current?.error,
    loading: Boolean(path) && !current
  };
};
