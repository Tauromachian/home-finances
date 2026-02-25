<script setup lang="ts">
import type { Investment } from "~/types/investment";

const investmentsStore = useInvestmentStore();
const isOpen = ref(false);

const appToaster = inject<Ref>("appToaster");

const portfolioValue = computed(() => {
  const total = investmentsStore.investments.reduce(
    (acum: number, nextValue: Investment) => {
      acum += nextValue.currentValue;
      return acum;
    },
    0,
  );

  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(total);
});

const resume = reactive({
  gainLossBalance: 1280,
  investmentReturn: 14,
});

const formattedResume = computed(() => {
  return {
    gainLossBalance: new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(resume.gainLossBalance),
    investmentReturn: `${resume.investmentReturn.toFixed(2)}%`,
  };
});

function submitForm(form: Investment) {
  investmentsStore.addInvestment(form);
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast("New investment added!");
}

onMounted(() => investmentsStore.loadInvestments());
</script>

<template>
  <div>
    <BaseButton class="mb-5" @click="isOpen = true">
      <span class="text-xl">+</span> Add Investment
    </BaseButton>

    <div class="grid gap-5">
      <AppCard color="accent-3" class="text-text-inverse">
        <AppCardBody class="flex gap-2">
          <div class="flex flex-col gap-3">
            <p class="opacity-60">Total Portfolio Value</p>
            <p class="text-5xl font-serif text-accent-4">
              {{ portfolioValue }}
            </p>
            <p class="opacity-60">
              {{ investmentsStore.investments.length }} investments
            </p>
          </div>
          <div class="ml-auto flex align-middle items-center gap-8">
            <div>
              <p class="opacity-60">Total Gain / Loss</p>
              <p class="font-bold">{{ formattedResume.gainLossBalance }}</p>
            </div>
            <div>
              <p class="opacity-60">Return</p>
              <p class="font-bold">{{ formattedResume.investmentReturn }}</p>
            </div>
          </div>
        </AppCardBody>
      </AppCard>

      <div class="grid grid-cols-2 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Allocation</p>
          </AppCardBody>

          <AppCardBody v-if="investmentsStore.investments.length">
            <InvestmentDonutChart
              :investments="investmentsStore.investments"
            ></InvestmentDonutChart>
          </AppCardBody>

          <div
            v-else
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols:note-outline"></Icon>

            <p>No Investments! Add one</p>
          </div>
        </AppCard>

        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Growth Overview</p>
          </AppCardBody>

          <AppCardBody v-if="investmentsStore.investments.length">
            <InvestmentLineChart
              :investments="investmentsStore.investments"
            ></InvestmentLineChart>
          </AppCardBody>

          <div
            v-else
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols:note-outline"></Icon>

            <p>No Investments! Add one</p>
          </div>
        </AppCard>
      </div>

      <InvestmentHoldings
        :investments="investmentsStore.investments"
        @remove="(id) => investmentsStore.removeInvestment(id)"
      ></InvestmentHoldings>
    </div>

    <AppDialog v-model="isOpen">
      <InvestmentForm @submit="submitForm"></InvestmentForm>
    </AppDialog>
  </div>
</template>
