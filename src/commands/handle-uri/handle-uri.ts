import * as vscode from 'vscode';
import { currentSnapshot } from '../../host/config-store';
import { openPanel } from '../../host/panel';
import { currentSessions } from '../../host/usage-history-store';
import { findSkillByName } from '../../model/shadowing';
import { ConfigSnapshot, SkillEntry } from '../../model/types';
import { SessionUsage } from '../../model/usage/types';
import { analyzeSession, openSessionAnalysis } from '../analyze-session/analyze-session';
import { findSkill } from '../find-skill/find-skill';
import { openSurface } from '../open-surface/open-surface';
import { DeepLink, parseDeepLink } from './deep-link';

interface HandleUriArgs {
  context: vscode.ExtensionContext;
  uri: vscode.Uri;
}

// vscode://canoq.claude-viewer/skill/<name>[#section], /session/<id>, or a surface by name. Every
// name is resolved against what the host itself read — a link never carries a path or a pid, so it
// can't reach anything we didn't find.
export const handleUri = async ({ context, uri }: HandleUriArgs): Promise<void> => {
  const link: DeepLink = parseDeepLink({
    path: uri.path,
    query: uri.query,
    fragment: uri.fragment
  });

  if (link.kind === 'panel') return openPanel({ context });
  if (link.kind === 'pick') return findSkill({ context, initialQuery: link.query });
  if (link.kind === 'surface') return openSurface({ context, surface: link.surface });
  if (link.kind === 'session') return _openSession({ context, sessionId: link.sessionId });

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

  // A section that matches nothing says nothing: the skill still opens, at its top. Unlike a bad
  // skill name, the ask already succeeded — this only refines where it lands.
  openPanel({
    context,
    target: { to: 'skill', path: linkedSkill.path, section: link.section }
  });
};

interface OpenSessionArgs {
  context: vscode.ExtensionContext;
  // Absent when the link was `/session` with nothing after it, which is the picker.
  sessionId?: string;
}

// A session id into the session it names. The tool is resolved here rather than asked of the link:
// both CLIs mint their own ids, and a link author has no way to know which one wrote theirs.
//
// A miss is ordinary — the history is folded out of finished turns, so a session that has just
// started isn't in it yet. Same answer as a skill that doesn't resolve: say so, and open the picker
// with the id typed in.
const _openSession = async ({ context, sessionId }: OpenSessionArgs): Promise<void> => {
  if (!sessionId) return analyzeSession({ context });

  const sessions: SessionUsage[] = await currentSessions();
  const found: SessionUsage | undefined = sessions.find(
    (session) => session.sessionId === sessionId
  );

  if (!found) {
    void vscode.window.showWarningMessage(
      `Claude Viewer: no session on record with id "${sessionId}".`
    );
    return analyzeSession({ context, initialQuery: sessionId });
  }

  openSessionAnalysis({ context, session: found });
};
