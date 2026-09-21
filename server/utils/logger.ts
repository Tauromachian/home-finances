/**
 * Minimal server logger used as `useLogger(tag)`.
 *
 * The pinned Nitro/h3 versions do not provide `useLogger` (nor does Nuxt
 * auto-import it), so this dependency-free helper fills the gap with a
 * tagged `console` wrapper. If a future upgrade provides a framework
 * `useLogger`, delete this file and use that instead.
 */
export function useLogger(tag?: string) {
  const prefix = tag ? `[${tag}]` : "[server]";

  return {
    error: (...args: unknown[]) => console.error(prefix, ...args),
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    info: (...args: unknown[]) => console.info(prefix, ...args),
    debug: (...args: unknown[]) => console.debug(prefix, ...args),
  };
}
