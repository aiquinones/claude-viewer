import { useState } from 'react';

// Whether the estimator dialog is up. A timestamp rather than a boolean, for the reason the
// spotlight's is: it's the mount key, so opening it again after applying gives a fresh draft back
// rather than whatever was left in the last one.
export const useEstimatorDialog = () => {
  const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);

  return {
    estimatorOpenedAt: openedAt,
    openEstimator: (): void => setOpenedAt(Date.now()),
    dismissEstimator: (): void => setOpenedAt(undefined)
  };
};
