import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

// How far up to walk before giving up. A real chain is a handful of levels; the cap is here so a
// malformed table can't turn the walk into a loop.
const MAX_DEPTH: number = 32;

// pid → ppid for every process on the machine, from one `ps`. One subprocess per resolution rather
// than one per level, which is what walking with repeated `ps -p` would cost.
//
// `ps` is POSIX and absent on Windows, where this returns an empty tree — every chain is then just
// the pid itself, nothing matches, and the caller falls back. That is the behaviour Windows already
// had, so it loses nothing.
export const readProcessTree = async (): Promise<Map<number, number>> => {
  const tree: Map<number, number> = new Map();
  if (process.platform === 'win32') return tree;

  try {
    const { stdout } = await run('ps', ['-axo', 'pid=,ppid=']);
    for (const line of stdout.split('\n')) {
      const [pid, parent]: number[] = line.trim().split(/\s+/).map(Number);
      if (Number.isInteger(pid) && Number.isInteger(parent)) tree.set(pid, parent);
    }
  } catch {
    // No `ps`, or it failed. "Can't tell" is a real answer here, and it reads as an empty tree.
  }

  return tree;
};

interface ChainArgs {
  tree: Map<number, number>;
  pid: number;
}

// The pid and every process above it, nearest first. The pid itself is in it so a caller can match
// the agent's own process as readily as its parents.
export const processChain = ({ tree, pid }: ChainArgs): number[] => {
  const chain: number[] = [pid];

  let current: number = pid;
  for (let depth: number = 0; depth < MAX_DEPTH; depth += 1) {
    const parent: number | undefined = tree.get(current);
    // pid 1 is the root, and a pid that reappears is a table we don't trust.
    if (parent === undefined || parent <= 1 || chain.includes(parent)) break;
    chain.push(parent);
    current = parent;
  }

  return chain;
};
