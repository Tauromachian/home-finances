export function makeDebounce(): (cb: () => void, delay: number) => void {
  let timeout: ReturnType<typeof setTimeout> | null | undefined;

  return function debounce(cb: () => void, delay: number = 1000) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      cb();
      timeout = null;
    }, delay);
  };
}
