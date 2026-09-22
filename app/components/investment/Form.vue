<script setup lang="ts">
import { Form } from "vee-validate";

import { required, positiveNumber } from "@/utils/rules";
import { assetsCategories } from "@/utils/categories";
import type { Investment } from "~/types/investment";
import type { Item } from "@/types/item";

type FormMode = "edit" | "insert";

export type MarketPrice = {
  price: number | null;
  currency: string | null;
};

const props = defineProps<{
  formMode: FormMode;
  marketItems?: readonly Item[];
  marketPrices?: Record<string, MarketPrice>;
}>();

const emit = defineEmits<{ submit: [investment: Investment] }>();
const formattedCategories = assetsCategories.map((item) => ({
  title: item.name,
  value: item.name,
  icon: {
    name: item.icon,
    color: item.color,
  },
}));

const formRef = useTemplateRef<typeof Form>("formRef");

function selectedLivePrice(marketSymbol: unknown): MarketPrice | null {
  if (typeof marketSymbol !== "string") return null;

  const key = marketSymbol.trim().toUpperCase().replace(/\s+/g, "");
  if (!key) return null;

  const found = props.marketPrices?.[key];
  return found && found.price !== null ? found : null;
}

function formatLivePrice(marketSymbol: unknown): string {
  const live = selectedLivePrice(marketSymbol);
  if (!live || live.price === null) return "—";

  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: live.currency ?? "EUR",
    }).format(live.price);
  } catch {
    return `${live.price.toFixed(2)} ${live.currency ?? ""}`.trim();
  }
}

function onSubmit(investment: Investment) {
  emit("submit", investment);
  formRef.value.resetForm();
}
</script>

<template>
  <AppCard>
    <AppCardBody>
      <p class="font-serif text-2xl font-bold text-text-1">
        {{ formMode === "insert" ? "New Investment" : "Edit Investment" }}
      </p>
    </AppCardBody>
    <Form
      v-slot="{ errors, values }"
      ref="formRef"
      class="px-7 pb-4"
      @submit="onSubmit"
    >
      <AppInput
        label="Name"
        name="name"
        :error="errors.name"
        :rules="required"
        type="text"
      ></AppInput>

      <AppInput
        label="Amount"
        type="number"
        name="amount"
        input-class="pl-12"
        :rules="positiveNumber"
        :error="errors.amountInvested"
      >
        <template #prepend>
          <Icon name="material-symbols-light:euro" class="text-xl"></Icon>
        </template>
      </AppInput>

      <AppAutocomplete
        :error="errors.categories"
        :items="formattedCategories"
        :rules="required"
        label="Category"
        name="category"
      ></AppAutocomplete>

      <AppAutocomplete
        :error="errors.marketSymbol"
        :items="marketItems ?? []"
        label="Track stock (optional)"
        name="marketSymbol"
        show-title
      ></AppAutocomplete>

      <p
        v-if="selectedLivePrice(values.marketSymbol)"
        class="text-sm text-text-0 -mt-3 mb-5"
      >
        Live price {{ formatLivePrice(values.marketSymbol) }} — used as current
        value.
      </p>
      <p v-else-if="values.marketSymbol" class="text-sm text-text-0 -mt-3 mb-5">
        Live price unavailable — enter the value manually.
      </p>

      <AppInput
        v-if="!selectedLivePrice(values.marketSymbol)"
        label="Current Value"
        type="number"
        name="currentValue"
        input-class="pl-12"
        :rules="positiveNumber"
        :error="errors.currentValue"
      >
        <template #prepend>
          <Icon name="material-symbols-light:euro" class="text-xl"></Icon>
        </template>
      </AppInput>

      <AppInput
        label="Description (optional)"
        as="textarea"
        type="text"
        name="description"
        :error="errors.description"
      ></AppInput>

      <div class="flex justify-end pt-2 pb-2">
        <BaseButton> Add Investment </BaseButton>
      </div>
    </Form>
  </AppCard>
</template>
