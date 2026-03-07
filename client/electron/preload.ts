import { ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
declare global {
  interface Window {
    ipcRenderer: typeof ipcRenderer;
  }
}

window.ipcRenderer = ipcRenderer;
