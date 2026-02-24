export const useInvestmentStore = defineStore("investments", () => {
  // state
  let investments = ref([]);

  // actions
  function addInvestment(investment) {
    investments.value.push(investment);
    saveInvestments();
    loadInvestments();
  }

  function removeInvestment(id) {
    investments.value = investments.value.filter(
      (investment) => investment.id != id,
    );
    saveInvestments();
  }

  function clearInvestments() {
    investments.value = [];
    saveInvestments();
  }

  // private functions for pinia persistency
  function saveInvestments() {
    if (!localStorage) return;

    localStorage.setItem("investments", JSON.stringify(investments.value));
  }

  function loadInvestments() {
    if (!window) return;

    const savedInvestments = localStorage.getItem("investments");
    investments.value = savedInvestments ? JSON.parse(savedInvestments) : [];
  }

  return {
    investments,
    addInvestment,
    removeInvestment,
    clearInvestments,
    loadInvestments,
  };
});
