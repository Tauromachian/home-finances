<script setup lang="ts">
import {
  createInvestment,
  deleteInvestment as deleteInvestmentRecord,
  getInvestments,
  updateInvestment,
} from "~/services/investments";
import { gainVsCost, resolveCurrentValue } from "~/utils/market";
import type { Investment } from "~/types/investment";
import type { Item } from "~/types/item";

type FormMode = "edit" | "insert";

const investments = ref<Investment[]>([]);
const isLoading = ref(true);

const isOpen = ref(false);
const isConfirmationDialogOpen = ref(false);
const isLinkDialogOpen = ref(false);
const linkTarget = ref<Investment | null>(null);

const appToaster = inject<Ref>("appToaster");

let selectedId: number | string = "";

const formMode = ref<FormMode>("insert");

const market = useMarketSnapshot();

/** First paint: loader while investments or the market snapshot load. */
const isPageLoading = computed(
  () =>
    isLoading.value ||
    market.status.value === "idle" ||
    market.status.value === "loading",
);

const linkedSymbols = computed(() =>
  investments.value
    .map((investment) => investment.marketSymbol)
    .filter((symbol): symbol is string => !!symbol),
);

/** All downloaded entries as picker options — filtered locally, no network. */
const marketItems = computed<Item[]>(() =>
  Object.values(market.snapshot.value)
    .map((entry) => ({
      title: entry.name ? `${entry.symbol} — ${entry.name}` : entry.symbol,
      value: entry.symbol,
    }))
    .sort((a, b) => a.value.localeCompare(b.value)),
);

/** Live prices keyed by symbol for the investment form. */
const marketPrices = computed<
  Record<string, { price: number | null; currency: string | null }>
>(() => {
  const map: Record<string, { price: number | null; currency: string | null }> =
    {};
  for (const entry of Object.values(market.snapshot.value)) {
    map[entry.symbol] = { price: entry.price, currency: entry.currency };
  }
  return map;
});

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

const livePortfolioValue = computed(() => {
  const total = investments.value.reduce(
    (acc: number, investment: Investment) => {
      const entry = investment.marketSymbol
        ? market.entry(investment.marketSymbol)
        : null;
      return acc + (entry?.price ?? Number(investment.currentValue));
    },
    0,
  );

  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(total);
});

function liveInfo(investment: Investment) {
  const entry = investment.marketSymbol
    ? market.entry(investment.marketSymbol)
    : null;
  const { gain, returnPct } = gainVsCost(
    entry?.price ?? null,
    Number(investment.amount),
  );

  return {
    price: entry?.price ?? null,
    currency: entry?.currency ?? null,
    gain,
    returnPct,
    stale:
      market.status.value === "stale" ||
      (!!investment.marketSymbol &&
        market.missing.value.includes(investment.marketSymbol)),
  };
}

const liveById = computed(() => {
  const map = new Map<
    string,
    {
      price: number | null;
      currency: string | null;
      gain: number | null;
      returnPct: number | null;
      stale: boolean;
    }
  >();
  for (const investment of investments.value) {
    map.set(String(investment.id), liveInfo(investment));
  }
  return map;
});

function liveFor(investment: Investment) {
  return (
    liveById.value.get(String(investment.id)) ?? {
      price: null,
      currency: null,
      gain: null,
      returnPct: null,
      stale: false,
    }
  );
}
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
  // Tracked stocks take their current value from the live quote; manual
  // holdings use the entered value. Abort when neither is available.
  const currentValue = resolveCurrentValue(
    form.marketSymbol,
    form.currentValue,
    (symbol) => market.entry(symbol)?.price ?? null,
  );

  if (currentValue === null) {
    if (appToaster?.value) {
      appToaster.value.openToast(
        "Live price unavailable — enter the value manually.",
      );
    }
    return;
  }

  const payload = { ...form, currentValue };

  if (formMode.value === "insert") {
    await createInvestment(payload);

    showMessage("New investment added!");
  } else {
    await updateInvestment(selectedId, payload);

    showMessage("Investment edited");
  }

  loadData();
}

function openForm(mode: FormMode, id?: string | number) {
  formMode.value = mode;

  if (id) selectedId = id;

  isOpen.value = true;
}

function openDeleteConfirmationDialog(id: string | number) {
  selectedId = id;
  isConfirmationDialogOpen.value = true;
}

async function deleteInvestment() {
  await deleteInvestmentRecord(selectedId);
  isConfirmationDialogOpen.value = false;
  loadData();
}

function openLinkDialog(investment: Investment) {
  linkTarget.value = investment;
  isLinkDialogOpen.value = true;
}

async function linkStock(item: Item) {
  if (linkTarget.value?.id === undefined || linkTarget.value?.id === "") return;

  await updateInvestment(linkTarget.value.id, {
    ...linkTarget.value,
    marketSymbol: item.value,
  });

  isLinkDialogOpen.value = false;
  linkTarget.value = null;

  await loadData();
  market.refresh(linkedSymbols.value);

  if (appToaster?.value) appToaster.value.openToast("Stock linked!");
}

async function unlinkStock(investment: Investment) {
  if (investment.id === undefined || investment.id === "") return;

  await updateInvestment(investment.id, {
    ...investment,
    marketSymbol: null,
  });

  await loadData();

  if (appToaster?.value) appToaster.value.openToast("Stock unlinked");
}

async function loadData() {
  isLoading.value = true;
  try {
    investments.value = await getInvestments();
  } finally {
    isLoading.value = false;
  }

  market.startAutoRefresh(() => linkedSymbols.value);
}

onMounted(() => loadData());
</script>

<template>
  <div>
    <BaseButton class="mb-5" @click="openForm('insert')">
      <span class="text-xl">+</span> Add Investment
    </BaseButton>

    <div class="flex flex-col gap-5">
      <AppCard color="accent-3" class="text-text-inverse">
        <AppCardBody class="flex gap-2">
          <div class="flex flex-col gap-3">
            <p class="opacity-60">Total Portfolio Value</p>
            <p class="text-5xl font-serif text-accent-4">
              {{ portfolioValue }}
            </p>
            <p
              v-if="
                market.status.value === 'live' ||
                market.status.value === 'stale'
              "
              class="text-sm"
            >
              <span class="opacity-60">Live: </span>
              <span class="font-bold">{{ livePortfolioValue }}</span>
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Allocation</p>
          </AppCardBody>

          <AppLoader v-if="isPageLoading" size="70" class="my-10"></AppLoader>
          <div
            v-else-if="!investments.length"
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>

            <p>No Investments! Add one</p>
          </div>

          <AppCardBody>
            <ClientOnly>
              <InvestmentDonutChart
                v-if="investments.length"
                :investments="investments"
              ></InvestmentDonutChart>
              <template #fallback>
                <AppLoader size="80" class="my-40"></AppLoader>
              </template>
            </ClientOnly>
          </AppCardBody>
        </AppCard>

        <AppCard>
          <AppCardBody>
            <p class="text-md font-bold">Growth Overview</p>
          </AppCardBody>

          <AppLoader v-if="isPageLoading" size="70" class="my-10"></AppLoader>
          <div
            v-else-if="!investments.length"
            class="flex flex-col items-center gap-5 justify-center my-6"
          >
            <Icon size="48" name="material-symbols-light:note-outline"></Icon>

            <p>No Investments! Add one</p>
          </div>

          <AppCardBody>
            <ClientOnly>
              <InvestmentLineChart
                v-if="investments.length"
                :investments
              ></InvestmentLineChart>
              <template #fallback>
                <AppLoader size="80" class="my-40"></AppLoader>
              </template>
            </ClientOnly>
          </AppCardBody>
        </AppCard>
      </div>

      <AppCard>
        <AppCardBody>
          <p class="text-md font-bold mb-4">Holdings</p>
          <AppLoader v-if="isPageLoading" size="70" class="my-10"></AppLoader>
          <div v-else-if="investments.length" class="flex flex-col gap-2">
            <InvestmentItem
              v-for="investment in investments"
              :key="`investment-${investment.id}`"
              :investment
              :category="
                getCategoryByName(investment.category, assetsCategories)
              "
              :live-price="liveFor(investment).price"
              :live-currency="liveFor(investment).currency"
              :gain="liveFor(investment).gain"
              :return-pct="liveFor(investment).returnPct"
              :price-stale="liveFor(investment).stale"
              @click:delete="openDeleteConfirmationDialog(investment.id)"
              @click:link="openLinkDialog"
              @click:unlink="unlinkStock"
            ></InvestmentItem>
          </div>
          <EmptyState v-else></EmptyState>
        </AppCardBody>
      </AppCard>
    </div>

    <DialogConfirmDelete
      v-model="isConfirmationDialogOpen"
      @click:delete="deleteInvestment"
    ></DialogConfirmDelete>

    <AppDialog v-model="isOpen">
      <InvestmentForm
        :form-mode="formMode"
        :market-items="marketItems"
        :market-prices="marketPrices"
        @submit="submitForm"
      ></InvestmentForm>
    </AppDialog>

    <AppDialog v-model="isLinkDialogOpen">
      <AppCard>
        <AppCardBody>
          <p class="font-serif text-2xl font-bold text-text-1 mb-1">
            Link stock
          </p>
          <p class="text-sm text-text-0 mb-4">
            Search the downloaded snapshot — no network while typing.
          </p>
          <AppAutocomplete
            :items="marketItems"
            label="Stock"
            name="stock"
            show-title
            @selected="linkStock"
          ></AppAutocomplete>
        </AppCardBody>
      </AppCard>
    </AppDialog>
  </div>
</template>
