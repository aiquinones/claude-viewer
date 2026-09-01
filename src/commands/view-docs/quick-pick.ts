import * as vscode from 'vscode';
import { ViewerDoc, docPath } from '../../host/viewer-docs';

interface DocPickItem extends vscode.QuickPickItem {
  doc: ViewerDoc;
}

// createQuickPick rather than showQuickPick, the way the other two pickers here do it — one shape
// for every list this extension puts in front of you. Resolves undefined when dismissed.
export const pickDoc = (docs: readonly ViewerDoc[]): Promise<ViewerDoc | undefined> => {
  const picker: vscode.QuickPick<DocPickItem> = vscode.window.createQuickPick<DocPickItem>();
  picker.items = docs.map(_toItem);
  picker.placeholder = 'Which doc?';
  picker.matchOnDescription = true;

  return new Promise((resolve) => {
    let chosen: ViewerDoc | undefined;
    picker.onDidAccept(() => {
      chosen = picker.selectedItems[0]?.doc;
      picker.hide();
    });
    picker.onDidHide(() => {
      picker.dispose();
      resolve(chosen);
    });
    picker.show();
  });
};

// The path is the detail rather than hidden: it's what you put in a CLAUDE.md, so the picker says
// where the doc lives before you open it.
const _toItem = (doc: ViewerDoc): DocPickItem => ({
  doc,
  label: doc.label,
  description: doc.summary,
  detail: docPath(doc)
});
