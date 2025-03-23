/*global defineStore, ref*/

export const useExpenseStore = defineStore("expenses", () => {
  // state
  let expenses = ref([]);

  // actions
  function addExpense(expense) {
    expense.id = calcMEX();
    expenses.value.push(expense);
    saveExpenses();
    loadExpenses();
  }

  function removeExpense(id) {
    expenses.value = expenses.value.filter((expense) => expense.id != id);
    saveExpenses();
  }

  function clearExpenses() {
    expenses.value = [];
    saveExpenses();
  }

  // private functions for pinia persistency
  function saveExpenses() {
    if (!localStorage) return;

    localStorage.setItem("expenses", JSON.stringify(expenses.value));
  }

  function loadExpenses() {
    if (!window) return;

    const savedExpenses = localStorage.getItem("expenses");
    expenses.value = savedExpenses ? JSON.parse(savedExpenses) : [];
  }

  // helper function
  function calcMEX() {
    let mex = 1;
    const idSet = new Set();
    expenses.value.forEach((expense) => {
      idSet.add(expense.id);
      while (idSet.has(mex)) mex++;
    });

    return mex;
  }

  return {
    expenses,
    addExpense,
    removeExpense,
    clearExpenses,
    loadExpenses,
  };
});
