import { SurfaceAdapter, SurfaceArgs, TreeNode } from '../types';
import { skillsNode } from './skills-adapter';

// Every surface, in display order. A new one is an adapter plus a line here.
const ADAPTERS: SurfaceAdapter[] = [skillsNode];

export const buildTree = (args: SurfaceArgs): TreeNode[] =>
  ADAPTERS.map((adapter) => adapter(args)).filter((node): node is TreeNode => node !== undefined);
