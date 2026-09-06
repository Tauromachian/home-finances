export const themes = ["light", "system", "dark"] as const;

export function ensureTheme(possibleTheme: string): ThemeName {
  if ((themes as readonly string[]).includes(possibleTheme)) {
    return possibleTheme as ThemeName;
  }

  return "system";
}

export type ThemeName = (typeof themes)[number];
