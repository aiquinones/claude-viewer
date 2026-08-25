// What the stage-naming dialog says, and the one rule it has: turning a draft back into the map
// that gets stored. Pure, so the merge is testable and the prose isn't inside a component.
//
// The map is the whole feature. A skill in it is a stage named whatever it says; a skill out of it
// is a skill the split ignores. There is no second setting saying which skills to skip — a blank
// field is that answer.

export const NAMES_TITLE: string = 'Stage names';

export const NAMES_CAVEAT: string =
  'Every skill this session loaded. Name one to make its loads open a stage — leave it blank and the split ignores it. A name applies wherever that skill runs, not only here.';

// What an empty field says it's doing, which is being skipped.
export const NAMES_PLACEHOLDER: string = 'not a stage';

// The row button, which is one control in two states: it fills a blank field with the skill's own
// name, and clears one that has a name. Filling is the common case and typing the skill's name back
// out is the annoying one, so it's the same button rather than a second.
export const USE_SKILL_NAME: string = "Use the skill's own name";
export const NOT_A_STAGE: string = 'Not a stage';

// A session with no skill loads has nothing to name. Reachable only from the (i), which is drawn
// beside that state's message too.
export const NAMES_EMPTY: string = 'This session loaded no skills, so it has no stages to name.';

interface MergeStageNamesArgs {
  // The skills on screen — the only keys this draft is allowed to speak for.
  skills: string[];
  // Every override stored, this session's and everyone else's.
  current: Record<string, string>;
  draft: Record<string, string>;
}

// The draft folded back into the stored map. Names for skills this session never ran come through
// untouched: the dialog only listed the skills in front of you, so it can't be the thing that
// clears the rest. A field left blank drops its key rather than storing an empty name, which is how
// a skill stops being a stage.
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
