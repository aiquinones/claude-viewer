import { SystemPromptFile } from '../model/types';

export interface PromptTotals {
  files: number;
  chars: number;
  estimatedTokens: number;
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
      chars: running.chars + file.chars,
      estimatedTokens: running.estimatedTokens + file.estimatedTokens
    }),
    { files: 0, chars: 0, estimatedTokens: 0 }
  );

// 1.2k rather than 1234. The number is a rough estimate to begin with, so the digits it drops
// weren't saying anything.
export const formatTokens = (tokens: number): string =>
  tokens < 1000 ? `${tokens}` : `${(tokens / 1000).toFixed(1)}k`;

export const formatBytes = (chars: number): string =>
  chars < 1024 ? `${chars} B` : `${(chars / 1024).toFixed(1)} KB`;

export const plural = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;
