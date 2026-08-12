import * as vscode from 'vscode';
import { currentSnapshot } from '../../host/config-store';
import { openPanel } from '../../host/panel';
import { findSkillByName } from '../../model/shadowing';
import { ConfigSnapshot, SkillEntry } from '../../model/types';
import { findSkill } from '../find-skill/find-skill';
import { DeepLink, parseDeepLink } from './deep-link';

interface HandleUriArgs {
  context: vscode.ExtensionContext;
  uri: vscode.Uri;
}

// vscode://canoq.claude-viewer/skill/<name>. The name is resolved against the snapshot and the
// host's own path is used — a link never carries a path, so it can't reach a file we didn't find.
export const handleUri = async ({ context, uri }: HandleUriArgs): Promise<void> => {
  const link: DeepLink = parseDeepLink({ path: uri.path, query: uri.query });

  if (link.kind === 'panel') return openPanel({ context });
  if (link.kind === 'pick') return findSkill({ context, initialQuery: link.query });

  const snapshot: ConfigSnapshot = await currentSnapshot();
  const linkedSkill: SkillEntry | undefined = findSkillByName({
    skills: snapshot.skills,
    name: link.name,
    scope: link.scope
  });

  // A link arrives from somewhere the reader can't see, so a miss says so and drops them into the
  // picker with the name typed in rather than doing nothing.
  if (!linkedSkill) {
    const scopeNote: string = link.scope ? ` at ${link.scope} scope` : '';
    void vscode.window.showWarningMessage(
      `Claude Viewer: no skill named "${link.name}"${scopeNote}.`
    );
    return findSkill({ context, initialQuery: link.name });
  }

  openPanel({ context, revealPath: linkedSkill.path });
};
