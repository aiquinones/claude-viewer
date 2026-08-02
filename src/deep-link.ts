import { Scope } from './model/types';

// What a vscode://canoq.claude-viewer/… link asks for. Parsing is kept separate from acting on it
// so the whole grammar reads in one screen and needs no editor host to check.
export type DeepLink =
  | { kind: 'panel' }
  | { kind: 'pick'; query?: string }
  | { kind: 'skill'; name: string; scope?: Scope };

interface ParseDeepLinkArgs {
  // Already percent-decoded, the way vscode.Uri hands it over.
  path: string;
  query: string;
}

const SCOPES: string[] = ['project', 'user', 'plugin'];

// /skill/<name> → that skill · /skill → the picker · anything else → the panel.
// Unknown shapes fall back to the panel rather than failing: a link that opens the wrong view is
// recoverable, one that silently does nothing is not.
export const parseDeepLink = ({ path, query }: ParseDeepLinkArgs): DeepLink => {
  const segments: string[] = path.split('/').filter((segment) => segment.length > 0);
  if (segments[0] !== 'skill') return { kind: 'panel' };

  const params: URLSearchParams = new URLSearchParams(query);
  const name: string | undefined = segments[1];
  if (!name) return { kind: 'pick', query: params.get('q') ?? undefined };

  const scope: string | null = params.get('scope');
  return { kind: 'skill', name, scope: _asScope(scope) };
};

const _asScope = (value: string | null): Scope | undefined =>
  value !== null && SCOPES.includes(value) ? (value as Scope) : undefined;
