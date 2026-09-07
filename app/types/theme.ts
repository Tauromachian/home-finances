export const themes = ["light", "system", "dark"] as const;

export type ThemeName = (typeof themes)[number];

export function isTheme(possibleTheme: string): possibleTheme is ThemeName {
  return (themes as readonly string[]).includes(possibleTheme);
}

export function ensureTheme(possibleTheme: string): ThemeName {
  if (!isTheme(possibleTheme)) return "system";

  return possibleTheme;
}
