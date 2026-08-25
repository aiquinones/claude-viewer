import { useState } from 'react';

// Whether the stage-naming dialog is up. A timestamp rather than a boolean, for the reason the
// estimator dialog's is: it's the mount key, so reopening it after a save reads the stored names
// back rather than showing whatever was left in the last draft.
export const useStageNamesDialog = () => {
  const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);

  return {
    stageNamesOpenedAt: openedAt,
    openStageNames: (): void => setOpenedAt(Date.now()),
    dismissStageNames: (): void => setOpenedAt(undefined)
  };
};
