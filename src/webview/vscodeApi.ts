import { WebviewMessage } from '../model/types';

interface VsCodeApi {
  postMessage: (message: WebviewMessage) => void;
}

declare function acquireVsCodeApi(): VsCodeApi;

// Only valid to call once per webview, so it lives at module scope and is shared by all hooks.
export const vscode: VsCodeApi = acquireVsCodeApi();
