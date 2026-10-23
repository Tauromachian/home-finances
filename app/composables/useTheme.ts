export const themes = ["light", "system", "dark"] as const;

export type ThemeName = (typeof themes)[number];

/** The concrete theme a preference resolves to ("system" → OS scheme). */
export type ResolvedTheme = Exclude<ThemeName, "system">;

export function isTheme(possibleTheme: string): possibleTheme is ThemeName {
  return (themes as readonly string[]).includes(possibleTheme);
}

export function ensureTheme(possibleTheme: string): ThemeName {
  if (!isTheme(possibleTheme)) return "system";

  return possibleTheme;
}

const STORAGE_KEY = "theme";
const TEXT_COLOR_VAR = "--color-text-1";

// The client wiring (watch, OS-scheme listener, stored-preference
// hydration) is registered once, no matter how many components call
// useTheme(). app.vue is the root, so it is always the first caller and
// the watcher never binds to a scope that can unmount.
let isWired = false;

export function useTheme() {
  /**
   * The user's preference: "light", "system" or "dark". Shared app-wide
   * through useState, so every caller binds to the same ref — this
   * replaced the manual provide/inject wiring it used to hang off
   * app/app.vue.
   */
  const theme = useState<ThemeName>("theme", () => "system");

  /**
   * Text color of the applied theme, re-read from the live CSS variables
   * whenever the theme changes. Chart.js 2D canvases can't resolve CSS
   * colors, which is why the donut charts take this value instead.
   */
  const textColor = useState<string | undefined>(
    "theme-text-color",
    () => undefined,
  );

  /** Preference with a capitalized first letter, for the UI label. */
  const themeName = computed(
    () => theme.value[0].toUpperCase() + theme.value.slice(1),
  );

  /** Writes the applied theme onto <html> and re-reads the CSS readings. */
  function applyTheme(preferred: ThemeName) {
    const resolved: ResolvedTheme =
      preferred === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : preferred;

    const html = document.querySelector("html");
    html?.setAttribute("data-theme", resolved);

    textColor.value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(TEXT_COLOR_VAR);
  }

  if (import.meta.client && !isWired) {
    isWired = true;

    // Preference changes apply and persist immediately.
    watch(theme, (preferred) => {
      applyTheme(preferred);
      localStorage.setItem(STORAGE_KEY, preferred);
    });

    // Follow OS scheme flips while on "system". Compared against the live
    // preference, not the one captured at mount as the old inline
    // app.vue code did.
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (theme.value !== "system") return;

        applyTheme("system");
      });

    // After hydration, restore the stored preference. Applied explicitly
    // too: the watch does not fire when the stored value equals the SSR
    // default ("system").
    onMounted(() => {
      theme.value = ensureTheme(localStorage.getItem(STORAGE_KEY));
      applyTheme(theme.value);
    });
  }

  return { theme, themeName, textColor };
}
