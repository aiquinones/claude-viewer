// What a skill is called when it opens a stage, and which stage a session is in. The map is the
// reader's own — `claudeViewer.stages.names`, keyed by the skill that opened it, because that's what
// the log records and what a reader would recognise.
//
// Two callers: the session page's radars split a finished session by these, and an agent row says
// which one is running. One home, so a row and the radar behind it can't disagree about what counts
// as a stage.

interface StageLabelArgs {
  skill: string;
  names: Record<string, string>;
}

// The stage this skill opens, or nothing. A blank name is how the naming dialog says "not a stage",
// so it reads as absent rather than as a stage with no label.
export const stageLabel = ({ skill, names }: StageLabelArgs): string | undefined => {
  const label: string = (names[skill] ?? '').trim();
  return label.length > 0 ? label : undefined;
};

// A stage and the skill that opened it. The label is what the row prints; the skill is the fact
// behind it, which is what the tooltip says.
export interface CurrentStage {
  skill: string;
  label: string;
}

interface CurrentStageArgs {
  // The skills the session has loaded, oldest first.
  trail: readonly string[];
  names: Record<string, string>;
}

// The stage a session is in: the most recent skill it loaded that the reader has named. Unnamed
// skills are stepped over rather than treated as an ending — run a named skill and then an unnamed
// one and you are still in the named one's stage. That's the rule `toStages` boundaries follow, and
// it's why the host sends the whole trail rather than the latest skill.
export const currentStage = ({ trail, names }: CurrentStageArgs): CurrentStage | undefined => {
  for (let index = trail.length - 1; index >= 0; index -= 1) {
    const skill: string = trail[index];
    const label: string | undefined = stageLabel({ skill, names });
    if (label) return { skill, label };
  }

  return undefined;
};
