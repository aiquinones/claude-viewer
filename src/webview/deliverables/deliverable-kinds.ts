import { ComponentType } from 'react';
import { FileText, GitPullRequest, Link2 } from 'lucide-react';
import { DeliverableKind } from '../../model/types';
import { StorybookMark } from './StorybookMark';

interface DeliverableKindInfo {
  // What the kind is called, for the chip's `title` when the agent gave a title of its own. The
  // chip's text is the declared title, so this is the only place the kind says its own name.
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

// The table, `SURFACES`-shaped: adding a kind is an entry here plus one in `DELIVERABLE_KINDS`.
// Keyed rather than a switch — four kinds is a lookup, not a choice between two.
//
// `link` is the fallback the loader degrades an unrecognised kind to, so its icon has to read as
// "something to open" rather than as anything specific.
export const DELIVERABLE_KIND_INFO: Record<DeliverableKind, DeliverableKindInfo> = {
  storybook: { label: 'Storybook', Icon: StorybookMark },
  link: { label: 'Link', Icon: Link2 },
  file: { label: 'File', Icon: FileText },
  pr: { label: 'Pull request', Icon: GitPullRequest }
};
