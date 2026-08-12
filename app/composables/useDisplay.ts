export const useDisplay = () => {
  const isLGAndUp = ref(false);

  onMounted(() => {
    if (!window) return;
    const lg = window.matchMedia("(width >= 64rem)");

    lg.addEventListener("change", (event) => {
      isLGAndUp.value = event.matches;
    });
  });

  return {
    isLGAndUp,
  };
};
