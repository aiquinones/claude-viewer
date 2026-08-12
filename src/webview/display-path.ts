// How a file path prints in the panel. Display only — every caller keeps the absolute path on a
// `title` attribute, so nothing here has to round-trip.

export const fileName = (path: string): string => path.split(/[/\\]/).pop() ?? path;

interface DisplayDirectoryArgs {
  path: string;
  workspaceRoot: string | undefined;
}

// Inside the workspace it's the relative directory, outside it the absolute one with a home prefix
// folded to `~`. A file sitting at the workspace root has no directory left, so it reads `.`.
export const displayDirectory = ({ path, workspaceRoot }: DisplayDirectoryArgs): string => {
  const dir: string = path.split(/[/\\]/).slice(0, -1).join('/');

  if (workspaceRoot && dir.startsWith(workspaceRoot)) {
    return dir.slice(workspaceRoot.length).replace(/^\//, '') || '.';
  }

  return dir.replace(/^\/(Users|home)\/[^/]+/, '~');
};
