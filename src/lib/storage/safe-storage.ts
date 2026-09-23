/** True when running in a browser with localStorage available. */
export function isBrowserTarget(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
