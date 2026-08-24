// One option in a control that picks between readings of the same thing — a menu row or a tile in a
// segmented control. The shape lives here rather than with either drawer, since both draw it.

export interface ChoiceOption<Id extends string> {
  id: Id;
  label: string;
  // What the option means — on hover in a segmented control, under the label in the menu. A
  // `backticked` run in it is set in mono either way.
  //
  // Optional, because a label that already says it doesn't want a sentence repeating it. Left out,
  // a menu row is its label alone and a segmented tile has no hover card at all.
  hint?: string;
  // An option that exists but doesn't work yet. `MenuChoice` dims it and still calls `onChoose`, so
  // the parent can say it's coming — the same answer a `soon` surface card gives. A segmented
  // control ignores this: a dimmed row is how you learn a mode exists, while a dimmed tile is just
  // a control with a dead third of it.
  soon?: boolean;
}
