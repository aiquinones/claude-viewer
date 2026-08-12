import { useEffect, useState } from 'react';
import { SkillGraph } from '../../model/types';
import { vscode } from '../vscodeApi';

export interface SkillGraphState {
  graph: SkillGraph | undefined;
  loading: boolean;
}

// Asks the host who mentions whom and holds the answer. Requested when the skills view mounts
// rather than when the graph opens, because the toggle has to know whether the selected skill is
// in the graph before you can click it.
//
// `loadedAt` is the whole cache story on both sides: the host answers a matching stamp from memory,
// and a reply for an older one is dropped here.
export const useSkillGraph = (loadedAt: number): SkillGraphState => {
  const [graph, setGraph] = useState<SkillGraph | undefined>(undefined);

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const message = event.data;
      if (message?.type !== 'skillGraph' || message.graph?.loadedAt !== loadedAt) return;
      setGraph(message.graph);
    };

    window.addEventListener('message', onMessage);
    vscode.postMessage({ type: 'requestGraph' });
    return () => window.removeEventListener('message', onMessage);
  }, [loadedAt]);

  const current: SkillGraph | undefined = graph?.loadedAt === loadedAt ? graph : undefined;

  return { graph: current, loading: !current };
};
