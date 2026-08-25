// What the stage-naming dialog says, and the one rule it has: turning a draft back into the map
// that gets stored. Pure, so the merge is testable and the prose isn't inside a component.

export const NAMES_TITLE: string = 'Stage names';

export const NAMES_CAVEAT: string =
  'Each stage is named for the skill that opened it. Give it your own name here — it applies wherever that skill opens a stage.';

// What an empty field says it's doing, which is nothing.
export const NAMES_PLACEHOLDER: string = "don't override";

// A session with no skill loads has nothing to rename. Reachable only from the (i), which is drawn
// beside the empty radars too.
export const NAMES_EMPTY: string = 'This session loaded no skills, so it has no stages to name.';

interface MergeStageNamesArgs {
  // The stages on screen — the only keys this draft is allowed to speak for.
  skills: string[];
  // Every override stored, this session's and everyone else's.
  current: Record<string, string>;
  draft: Record<string, string>;
}

// The draft folded back into the stored map. Overrides for skills this session never ran come
// through untouched: the dialog only listed the stages in front of you, so it can't be the thing
// that clears the rest. A field left blank drops its key rather than storing an empty name, which
// is how you go back to the skill's own name.
export const mergeStageNames = ({
  skills,
  current,
  draft
}: MergeStageNamesArgs): Record<string, string> => {
  const merged: Record<string, string> = { ...current };

  for (const skill of skills) {
    const name: string = (draft[skill] ?? '').trim();
    if (name) merged[skill] = name;
    else delete merged[skill];
  }

  return merged;
};
