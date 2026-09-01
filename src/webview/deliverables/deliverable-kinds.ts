import { ComponentType } from 'react';
import { FileText, GitPullRequest, Link2 } from 'lucide-react';
import { DeliverableKind } from '../../model/types';
import { StorybookMark } from './StorybookMark';

// The four class names a kind's color is used through. Written out rather than built from a token
// name, because Tailwind scans the source for whole class names — a `text-${token}` compiles to
// nothing. `tint` is a chip's ground and `tintHover` the same ground under the pointer.
export interface DeliverableKindColor {
  text: string;
  fill: string;
  tint: string;
  tintHover: string;
}

interface DeliverableKindInfo {
  // What the kind is called, for the chip's `title` when the agent gave a title of its own. The
  // chip's text is the declared title, so this is the only place the kind says its own name.
  label: string;
  Icon: ComponentType<{ className?: string }>;
  color: DeliverableKindColor;
}

// The table, `SURFACES`-shaped: adding a kind is an entry here plus one in `DELIVERABLE_KINDS`.
// Keyed rather than a switch — four kinds is a lookup, not a choice between two.
//
// `link` is the fallback the loader degrades an unrecognised kind to, so its icon has to read as
// "something to open" rather than as anything specific — and its color is the muted foreground for
// the same reason: a kind nobody declared shouldn't be the loudest thing on the row.
export const DELIVERABLE_KIND_INFO: Record<DeliverableKind, DeliverableKindInfo> = {
  storybook: {
    label: 'Storybook',
    Icon: StorybookMark,
    color: {
      text: 'text-deliverable-storybook',
      fill: 'bg-deliverable-storybook',
      tint: 'bg-deliverable-storybook/15',
      tintHover: 'hover:bg-deliverable-storybook/25'
    }
  },
  link: {
    label: 'Link',
    Icon: Link2,
    color: {
      text: 'text-deliverable-link',
      fill: 'bg-deliverable-link',
      tint: 'bg-deliverable-link/15',
      tintHover: 'hover:bg-deliverable-link/25'
    }
  },
  file: {
    label: 'File',
    Icon: FileText,
    color: {
      text: 'text-deliverable-file',
      fill: 'bg-deliverable-file',
      tint: 'bg-deliverable-file/15',
      tintHover: 'hover:bg-deliverable-file/25'
    }
  },
  pr: {
    label: 'Pull request',
    Icon: GitPullRequest,
    color: {
      text: 'text-deliverable-pr',
      fill: 'bg-deliverable-pr',
      tint: 'bg-deliverable-pr/15',
      tintHover: 'hover:bg-deliverable-pr/25'
    }
  }
};
