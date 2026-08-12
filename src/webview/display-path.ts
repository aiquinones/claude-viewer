// How a file path prints in the panel. Display only — every caller keeps the absolute path on a
// `title` attribute, so nothing here has to round-trip.

export const fileName = (path: string): string => path.split(/[/\\]/).pop() ?? path;

interface DisplayDirectoryArgs {
  path: string;
  workspaceRoot: string | undefined;
}

// A directory that *is* the path, rather than a file's parent — an agent's working directory. The
// workspace root prints as its own folder name instead of an empty string, and a worktree under it
// prints as the part that says which one.
export const displayFolder = ({ path, workspaceRoot }: DisplayDirectoryArgs): string => {
  if (!workspaceRoot || !path.startsWith(workspaceRoot)) {
    return path.replace(/^\/(Users|home)\/[^/]+/, '~');
  }

  return path === workspaceRoot ? fileName(path) : path.slice(workspaceRoot.length + 1);
};

// Inside the workspace it's the relative directory, outside it the absolute one with a home prefix
// folded to `~`. A file sitting at the workspace root has no directory left, so it reads `.`.
export const displayDirectory = ({ path, workspaceRoot }: DisplayDirectoryArgs): string => {
  const dir: string = path.split(/[/\\]/).slice(0, -1).join('/');

  if (workspaceRoot && dir.startsWith(workspaceRoot)) {
    return dir.slice(workspaceRoot.length).replace(/^\//, '') || '.';
  }

  return dir.replace(/^\/(Users|home)\/[^/]+/, '~');
};
