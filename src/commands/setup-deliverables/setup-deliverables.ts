import * as vscode from 'vscode';
import {
  DELIVERABLE_DOC_PATH,
  DELIVERABLE_IMPORT_LINE,
  writeDeliverableDoc
} from '../../host/deliverable-doc';

export const SETUP_DELIVERABLES_COMMAND: string = 'claudeViewer.setupDeliverables';

interface SetupDeliverablesArgs {
  context: vscode.ExtensionContext;
}

// Writes the instructions file and puts the import line on the clipboard. Running it activates the
// extension, so it can't fail the way it exists to fix — the gap being a fresh install where the
// panel has never once been opened, which is the only state in which the file doesn't exist.
//
// It's also the honest answer to discovery: nothing in the panel currently says the feature is
// there. See `tracking/ideas/power-user-section.md`.
export const setupDeliverables = async ({ context }: SetupDeliverablesArgs): Promise<void> => {
  await writeDeliverableDoc(context.extensionUri);

  const written: boolean = await _exists(DELIVERABLE_DOC_PATH);
  if (!written) {
    await vscode.window.showErrorMessage(`Couldn't write ${DELIVERABLE_DOC_PATH}.`);
    return;
  }

  await vscode.env.clipboard.writeText(DELIVERABLE_IMPORT_LINE);

  const open: string = 'Open the file';
  const chosen: string | undefined = await vscode.window.showInformationMessage(
    `Deliverables are set up. Paste ${DELIVERABLE_IMPORT_LINE} into a CLAUDE.md — it's on your clipboard.`,
    open
  );

  if (chosen !== open) return;

  const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(
    vscode.Uri.file(DELIVERABLE_DOC_PATH)
  );
  await vscode.window.showTextDocument(doc, { preview: true });
};

const _exists = async (path: string): Promise<boolean> => {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(path));
    return true;
  } catch {
    return false;
  }
};
