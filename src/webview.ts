import * as vscode from 'vscode';

interface WebviewHtmlArgs {
  webview: vscode.Webview;
  extensionUri: vscode.Uri;
}

// Builds the panel HTML with a strict CSP, mounting the React bundle from /dist into #root.
export const getWebviewHtml = ({ webview, extensionUri }: WebviewHtmlArgs): string => {
  const script: vscode.Uri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js')
  );
  const style: vscode.Uri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'main.css')
  );
  const nonce: string = _nonce();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
  <link href="${style}" rel="stylesheet" />
  <title>Claude Viewer</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${script}"></script>
</body>
</html>`;
};

const _nonce = (): string => {
  const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out: string = '';
  for (let index: number = 0; index < 32; index++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
};
