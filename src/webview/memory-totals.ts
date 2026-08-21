import { MemoryEntry, MEMORY_TYPES, MemoryType } from '../model/types';

export interface MemoryTotals {
  memories: number;
  chars: number;
  estimatedTokens: number;
}

// What a set of memories costs if every one of them is recalled. The other number this surface
// shows — the index — is paid every session and lives on `MemoryIndex` rather than here.
export const memoryTotals = (memories: MemoryEntry[]): MemoryTotals =>
  memories.reduce(
    (running: MemoryTotals, memory) => ({
      memories: running.memories + 1,
      chars: running.chars + memory.chars,
      estimatedTokens: running.estimatedTokens + memory.estimatedTokens
    }),
    { memories: 0, chars: 0, estimatedTokens: 0 }
  );

// A group is one type, or the untyped remainder. `undefined` is a real group here, not a missing
// one: a file whose type nothing recognises still has to land somewhere.
export interface MemoryGroup {
  type: MemoryType | undefined;
  memories: MemoryEntry[];
}

// The memories grouped by type, in MEMORY_TYPES order with the untyped ones last. Empty groups are
// dropped — a heading for a type nobody has written is noise.
export const memoryGroups = (memories: MemoryEntry[]): MemoryGroup[] => {
  const groups: MemoryGroup[] = MEMORY_TYPES.map((type) => ({
    type,
    memories: memories.filter((memory) => memory.type === type)
  }));

  groups.push({ type: undefined, memories: memories.filter((memory) => !memory.type) });

  return groups.filter((group) => group.memories.length > 0);
};

// Memories on disk that no line in MEMORY.md points at — written, and never recalled.
export const unindexed = (memories: MemoryEntry[]): MemoryEntry[] =>
  memories.filter((memory) => !memory.indexed);
