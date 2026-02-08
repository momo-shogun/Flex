/** Last generated export files (set by export_website_code tool, used by Export button). */
let lastExportFiles: Map<string, string> | null = null;

export function setLastExport(files: Map<string, string>): void {
  lastExportFiles = files;
}

export function getLastExport(): Map<string, string> | null {
  return lastExportFiles;
}
