import { ComponentType } from 'react';
import { FileText, GitPullRequest, Link2 } from 'lucide-react';
import { DeliverableKind } from '../../model/types';
import { StorybookMark } from './StorybookMark';

interface DeliverableKindInfo {
  // What the kind is called, for the chip's `title` when the agent gave a title of its own. The
  // chip's text is the declared title, so this is the only place the kind says its own name.
  label: string;
  Icon: ComponentType<{ className?: string }>;
  // The class that colors the icon. A whole class name rather than a token to build one from —
  // Tailwind scans the source for these, and a `text-${token}` compiles to nothing.
  color: string;
}

// The table, `SURFACES`-shaped: adding a kind is an entry here plus one in `DELIVERABLE_KINDS`.
// Keyed rather than a switch — four kinds is a lookup, not a choice between two.
//
// `link` is the fallback the loader degrades an unrecognised kind to, so its icon has to read as
// "something to open" rather than as anything specific — and its color is the muted foreground for
// the same reason: a kind nobody declared shouldn't be the loudest thing on the row.
export const DELIVERABLE_KIND_INFO: Record<DeliverableKind, DeliverableKindInfo> = {
  storybook: { label: 'Storybook', Icon: StorybookMark, color: 'text-deliverable-storybook' },
  link: { label: 'Link', Icon: Link2, color: 'text-deliverable-link' },
  file: { label: 'File', Icon: FileText, color: 'text-deliverable-file' },
  pr: { label: 'Pull request', Icon: GitPullRequest, color: 'text-deliverable-pr' }
};
