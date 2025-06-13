export function cssVar(variable: string) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variable);
}
