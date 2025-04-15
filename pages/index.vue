<script setup>
import { useExpenseStore } from "../stores/expenses";

const expenseStore = useExpenseStore();

const appToaster = ref(null);
const fadingInOutArrow = ref(false);
const chartKey = ref(0);
const frequencies = ref(["All", "One time", "Monthly", "Annual"]);
const selectedExpenseType = ref("All");
const isOpen = ref(false);

function scrollToStats() {
  const component = document.getElementById("expense-stats");

  if (!component) return;

  component.scrollIntoView({ behavior: "smooth" });

  closeScrollDown();
}

function submitForm(form) {
  expenseStore.addExpense(form);

  if (!appToaster?.value) return;

  appToaster.value.openToast("New expense added!");
}

function closeScrollDown() {
  fadingInOutArrow.value = false;
}

function getCategory(category) {
  return categories[
    categories.findIndex((item) => {
      return item.name == category;
    })
  ];
}

const filteredExpenses = computed(() => {
  const allExpenses = expenseStore.expenses;

  return allExpenses.filter((expense) => {
    if (selectedExpenseType.value === "All") return true;
    return expense.types === selectedExpenseType.value;
  });
});

watch(filteredExpenses, () => chartKey.value++);

onMounted(() => {
  expenseStore.loadExpenses();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-5">Expenses Tracker</h1>

    <BaseButton @click="isOpen = true" class="mb-5">Add Expense</BaseButton>

    <div class="flex flex-col md:flex-row gap-5 md:items-start">
      <AppDialog v-model="isOpen">
        <ExpenseForm @submit="submitForm"></ExpenseForm>
      </AppDialog>

      <div id="expense-stats" class="w-full">
        <BaseButtonGroup v-model="selectedExpenseType" class="mb-4">
          <BaseButton
            v-for="(frequency, index) in frequencies"
            :key="`expense-type-${index}`"
            :value="frequency"
          >
            {{ frequency }}
          </BaseButton>
        </BaseButtonGroup>

        <div class="flex flex-wrap gap-3">
          <AppCard>
            <div
              v-if="!filteredExpenses?.length"
              class="flex justify-center mt-6"
            >
              No expenses! Add one
            </div>

            <AppCardBody>
              <ExpenseDonutChart
                v-if="filteredExpenses?.length"
                :key="chartKey"
                :expenses="filteredExpenses"
                :categories="categories"
              ></ExpenseDonutChart>
            </AppCardBody>
          </AppCard>

          <AppCard>
            <div
              v-if="!filteredExpenses?.length"
              class="flex justify-center mt-6"
            >
              No expenses! Add one
            </div>

            <AppCardBody>
              <ExpenseItem
                v-for="expense in filteredExpenses"
                :key="expense.id"
                :expense="expense"
                :category="getCategory(expense.category)"
                class="border-b last:border-0 border-gray-300"
                @remove="expenseStore.removeExpense(expense.id)"
              ></ExpenseItem>
            </AppCardBody>
          </AppCard>

          <AppCard>
            <AppCardBody>
              <ExpenseLineChart :expenses="filteredExpenses"></ExpenseLineChart>
            </AppCardBody>
          </AppCard>
        </div>
      </div>
    </div>

    <AppToaster ref="appToaster"></AppToaster>

    <ScrollDownArrow
      class="transition-opacity"
      :class="{
        'opacity-100': fadingInOutArrow,
        'opacity-0': !fadingInOutArrow,
      }"
      @scroll-to-stats="scrollToStats"
    ></ScrollDownArrow>
  </div>
</template>

<style lang="scss" scoped></style>
