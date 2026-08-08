import { useEffect, useState } from 'react';
import { SkillBody } from '../model/types';
import { vscode } from './vscodeApi';

interface UseSkillBodyArgs {
  // The selected skill's SKILL.md, or undefined when nothing is selected.
  path: string | undefined;
  // The snapshot's build time. A rebuild means the file may have changed, so the body is re-read.
  loadedAt: number;
}

// Asks the host for one skill's body and holds the answer. Deliberately not cached: a local file
// read costs nothing next to getting invalidation wrong and rendering a skill that no longer says
// what it says on disk.
export const useSkillBody = ({ path, loadedAt }: UseSkillBodyArgs) => {
  const [result, setResult] = useState<SkillBody | undefined>(undefined);

  useEffect(() => {
    if (!path) return;

    // A reply for a skill that is no longer selected is dropped rather than rendered.
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type !== 'skillBody' || message.path !== path) return;
      setResult({ path: message.path, body: message.body, error: message.error });
    };

    window.addEventListener('message', onMessage);
    vscode.postMessage({ type: 'requestBody', path });
    return () => window.removeEventListener('message', onMessage);
  }, [path, loadedAt]);

  const current: SkillBody | undefined = result?.path === path ? result : undefined;

  return {
    body: current?.body,
    error: current?.error,
    loading: Boolean(path) && !current
  };
};
