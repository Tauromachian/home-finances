<script setup lang="ts">
import type { Investment } from "~/types/investment";

type FormMode = "edit" | "insert";

const investments = ref<Investment[]>([]);

const isOpen = ref(false);
const isConfirmationDialogOpen = ref(false);

const appToaster = inject<Ref>("appToaster");

let selectedId: number | string = "";

let formMode: FormMode;

const portfolioValue = computed(() => {
  const total = investments.value.reduce(
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

function showMessage(message: string) {
  isOpen.value = false;

  if (!appToaster?.value) return;

  appToaster.value.openToast(message);
}

async function submitForm(form: Investment) {
  if (formMode === "insert") {
    await fetch("/api/investments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("New investment added!");
  } else {
    await fetch("/api/investments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    showMessage("Investment edited");
  }
}

function openForm(mode: FormMode, id?: string | number) {
  formMode = mode;

  if (id) selectedId = id;

  isOpen.value = true;
}

function openDeleteConfirmationDialog(id: string | number) {
  selectedId = id;
  isConfirmationDialogOpen.value = true;
}

async function deleteInvestment() {
  await fetch(`/api/investments/${selectedId}`, { method: "DELETE" });
  isConfirmationDialogOpen.value = false;
}

async function loadData() {
  const res = await fetch("/api/investments");
  const data = await res.json();
  investments.value = data.data;
}

onBeforeMount(() => loadData());
</script>

<template>
  <div>
    <BaseButton class="mb-5" @click="openForm('insert')">
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
            <p class="opacity-60">{{ investments.length }} investments.value</p>
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

          <AppCardBody v-if="investments.length">
            <InvestmentDonutChart
              :investments="investments"
            ></InvestmentDonutChart>
          </AppCardBody>

          <div
            v-else
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>

            <p>No Investments! Add one</p>
          </div>
        </AppCard>

        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Growth Overview</p>
          </AppCardBody>

          <AppCardBody v-if="investments.length">
            <InvestmentLineChart :investments></InvestmentLineChart>
          </AppCardBody>

          <div
            v-else
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>

            <p>No Investments! Add one</p>
          </div>
        </AppCard>
      </div>

      <InvestmentHoldings
        :investments
        @remove="(id) => openDeleteConfirmationDialog(id)"
      ></InvestmentHoldings>
    </div>

    <DialogConfirmDelete
      v-model="isConfirmationDialogOpen"
      @click:delete="deleteInvestment"
    ></DialogConfirmDelete>

    <AppDialog v-model="isOpen">
      <InvestmentForm @submit="submitForm"></InvestmentForm>
    </AppDialog>
  </div>
</template>
