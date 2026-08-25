// Everything the row menu says, in one place — the kill command names itself twice, once as an item
// and once as the question it opens, and the two have to agree about what pressing it does.
//
// One line each. A menu item that explains itself underneath reads as a settings page: four of
// these fit on a row you opened on purpose, and the value each acts on sits beside it anyway.

export const MENU_ITEMS = {
  analyze: { label: 'Analyze session' },
  log: { label: 'Open the session log' },
  copy: { label: 'Copy session id' },
  kill: { label: 'Kill the process' }
} as const;

export const KILL_CONFIRM_TITLE: string = 'Kill this agent?';

export const KILL_LABEL: string = 'Kill';
export const CANCEL_LABEL: string = 'Cancel';

// What you lose and what you don't — the two things worth knowing before pressing it. Neither the
// pid nor the CLI is repeated here: the item you pressed named both, and the row is still behind it.
export const KILL_WARNING: string =
  'Whatever it was part-way through is lost. Written transcript stays on disk.';
