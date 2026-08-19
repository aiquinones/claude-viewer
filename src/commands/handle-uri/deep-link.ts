import { SKILL_SCOPES, SkillScope } from '../../model/types';

// What a vscode://canoq.claude-viewer/… link asks for. Parsing is kept separate from acting on it
// so the whole grammar reads in one screen and needs no editor host to check.
export type DeepLink =
  | { kind: 'panel' }
  | { kind: 'pick'; query?: string }
  | { kind: 'skill'; name: string; scope?: SkillScope; section?: string };

interface ParseDeepLinkArgs {
  // Already percent-decoded, the way vscode.Uri hands it over.
  path: string;
  query: string;
  // The `#…`, if it survived the OS → VS Code handoff. See `_section` for why that's an if.
  fragment?: string;
}

// /skill/<name> → that skill · /skill → the picker · anything else → the panel.
// Unknown shapes fall back to the panel rather than failing: a link that opens the wrong view is
// recoverable, one that silently does nothing is not.
export const parseDeepLink = ({ path, query, fragment }: ParseDeepLinkArgs): DeepLink => {
  const segments: string[] = path.split('/').filter((segment) => segment.length > 0);
  if (segments[0] !== 'skill') return { kind: 'panel' };

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
