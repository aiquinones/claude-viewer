import { SystemPromptFile } from '../model/types';

export interface PromptTotals {
  files: number;
  chars: number;
}

// Files with no `conditionalOn` load on every request — that split is the whole reason the
// headline number can be trusted, so both the card and the view read it from here.
export const alwaysLoads = (files: SystemPromptFile[]): SystemPromptFile[] =>
  files.filter((file) => !file.conditionalOn);

export const conditional = (files: SystemPromptFile[]): SystemPromptFile[] =>
  files.filter((file) => file.conditionalOn);

export const totals = (files: SystemPromptFile[]): PromptTotals =>
  files.reduce(
    (running: PromptTotals, file) => ({
      files: running.files + 1,
      chars: running.chars + file.chars
    }),
    { files: 0, chars: 0 }
  );
