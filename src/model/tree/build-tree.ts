import { SurfaceAdapter, SurfaceArgs, TreeNode } from '../types';
import { skillsNode } from './skills-adapter';

// Every surface the tree knows about, in display order. Adding CLAUDE.md is adding an adapter and
// one line here — the provider never learns what a skill is.
const ADAPTERS: SurfaceAdapter[] = [skillsNode];

export const buildTree = (args: SurfaceArgs): TreeNode[] =>
  ADAPTERS.map((adapter) => adapter(args)).filter((node): node is TreeNode => node !== undefined);
