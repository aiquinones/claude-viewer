import { MemoryDocument, MemoryIndex } from '../model/types';
import { fileName } from './display-path';

// MEMORY.md as the body pane takes it. The index is a document like a memory is, minus everything
// that only a memory has: it carries no description of its own and makes no `[[links]]`.
export const indexDocument = (index: MemoryIndex): MemoryDocument => ({
  name: fileName(index.path),
  description: '',
  path: index.path,
  links: [],
  issues: index.issues
});
