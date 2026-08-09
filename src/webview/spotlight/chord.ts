// The keys that open the spotlight, and the label for them. One file, so the listener and the
// button's tooltip can't drift apart.

// Cmd+F is the find key everywhere; Cmd+K is the one web apps use for exactly this box. Both,
// because a webview only gets the keys the workbench didn't claim first.
export const isOpenChord = (event: KeyboardEvent): boolean =>
  (event.metaKey || event.ctrlKey) && !event.altKey && (event.key === 'f' || event.key === 'k');

const IS_MAC: boolean = /mac/i.test(navigator.userAgent);

// Only `F` is advertised. Cmd+K is the hedge for the day the workbench claims F, not a second
// thing to learn.
export const CHORD_HINT: string = IS_MAC ? '⌘F' : 'Ctrl+F';
