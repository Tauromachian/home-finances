const TWO_SECONDS = 2000;

export function makeDebounce(): (cb: () => void, delay?: number) => void {
  let timeout: ReturnType<typeof setTimeout> | null | undefined;

  return function debounce(cb: () => void, delay: number = TWO_SECONDS): void {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      cb();
      timeout = null;
    }, delay);
  };
}
