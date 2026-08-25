import { SKILL_SCOPES, SkillScope } from '../../model/types';
import { linkedSurface } from './linked-surfaces';

// What a vscode://canoq.claude-viewer/… link asks for. Parsing is kept separate from acting on it
// so the whole grammar reads in one screen and needs no editor host to check.
export type DeepLink =
  | { kind: 'panel' }
  | { kind: 'pick'; query?: string }
  | { kind: 'skill'; name: string; scope?: SkillScope; section?: string }
  | { kind: 'surface'; surface: string }
  // The id alone. Which CLI minted it is the host's to resolve, so a link author never has to know
  // — and `/session` with no id is the picker, the way `/skill` is.
  | { kind: 'session'; sessionId?: string };

interface ParseDeepLinkArgs {
  // Already percent-decoded, the way vscode.Uri hands it over.
  path: string;
  query: string;
  // The `#…`, if it survived the OS → VS Code handoff. See `_section` for why that's an if.
  fragment?: string;
}

// /skill/<name> → that skill · /skill → the picker · /session/<id> → that session's page ·
// /usage, /agents and the other surface names → that surface · anything else → the panel.
// Unknown shapes fall back to the panel rather than failing: a link that opens the wrong view is
// recoverable, one that silently does nothing is not.
export const parseDeepLink = ({ path, query, fragment }: ParseDeepLinkArgs): DeepLink => {
  const segments: string[] = path.split('/').filter((segment) => segment.length > 0);
  const head: string | undefined = segments[0];
  if (!head) return { kind: 'panel' };

  const surface: string | undefined = linkedSurface(head);
  if (surface) return { kind: 'surface', surface };

  if (head === 'session') return { kind: 'session', sessionId: segments[1] };
  if (head !== 'skill') return { kind: 'panel' };

  const params: URLSearchParams = new URLSearchParams(query);
  const name: string | undefined = segments[1];
  if (!name) return { kind: 'pick', query: params.get('q') ?? undefined };

  const scope: string | null = params.get('scope');
  return {
    kind: 'skill',
    name,
    scope: _asScope(scope),
    section: _section({ fragment, params })
  };
};

// A section can arrive either way, and both are read. `#heading` is the form worth writing, but
// whether a fragment survives `open 'vscode://…#x'` → the OS → the URI handler isn't something
// this can check — so `?section=` is the form that always works, and reading both means the
// question never has to be answered.
const _section = (args: { fragment?: string; params: URLSearchParams }): string | undefined => {
  const named: string | undefined = args.fragment?.trim() || args.params.get('section')?.trim();
  return named || undefined;
};

// A `?scope=` the user typed, so it's a string until proven otherwise.
const _asScope = (value: string | null): SkillScope | undefined =>
  SKILL_SCOPES.find((scope) => scope === value);
