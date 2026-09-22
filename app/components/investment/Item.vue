<script setup lang="ts">
import type { Category } from "~/types/category";
import type { Investment } from "~/types/investment";

const FALLBACK_CATEGORY: Category = {
  name: "Others",
  icon: "material-symbols-light:view-quilt",
  color: "#64748b",
};

const props = defineProps<{
  investment: Investment;
  category?: Category;
  livePrice?: number | null;
  liveCurrency?: string | null;
  gain?: number | null;
  returnPct?: number | null;
  priceStale?: boolean;
}>();

defineEmits<{
  "click:delete": [id: number | string];
  "click:link": [investment: Investment];
  "click:unlink": [investment: Investment];
}>();

const safeCategory = computed(() => props.category ?? FALLBACK_CATEGORY);
</script>

<template>
  <AppCard class="rounded-xl" variant="outlined">
    <AppCardBody class="flex items-center py-2">
      <div
        class="min-w-12 w-12 h-12 mr-3 flex justify-center items-center rounded-md"
        :style="{ background: safeCategory.color + '12' }"
      >
        <Icon
          :size="22"
          :name="safeCategory.icon"
          :style="{ color: safeCategory.color }"
        />
      </div>

      <div class="w-full flex items-center">
        <div class="flex flex-col text-text-1 justify-center">
          <span class="font-bold">{{ investment.name }}</span>
          <p
            v-if="investment.description && investment.description !== ''"
            class="text-sm mt-2"
          >
            {{ investment.description }}
          </p>
          <InvestmentLiveBadge
            v-if="investment.marketSymbol"
            class="mt-2"
            :symbol="investment.marketSymbol"
            :price="livePrice ?? null"
            :currency="liveCurrency ?? null"
            :gain="gain ?? null"
            :return-pct="returnPct ?? null"
            :stale="priceStale ?? false"
          />
        </div>

        <p
          class="ml-auto rounded-full text-white px-2 text-sm uppercase mr-3"
          :style="{ 'background-color': safeCategory.color }"
        >
          {{ investment.category }}
        </p>

        <p class="font-serif text-text-1 mr-2 text-lg">
          €{{ investment.currentValue }}
        </p>

        <BaseButton
          v-if="investment.marketSymbol"
          variant="text"
          class="flex items-center"
          title="Unlink stock"
          @click="$emit('click:unlink', investment)"
        >
          <Icon
            name="material-symbols-light:link-off"
            class="w-5 h-5 text-text-0 hover:text-text-1 transition-all duration-100 ease-in-out"
          />
        </BaseButton>
        <BaseButton
          v-else
          variant="text"
          class="flex items-center"
          title="Link stock"
          @click="$emit('click:link', investment)"
        >
          <Icon
            name="material-symbols-light:add-link"
            class="w-5 h-5 text-text-0 hover:text-text-1 transition-all duration-100 ease-in-out"
          />
        </BaseButton>

        <BaseButton
          variant="text"
          class="flex items-center"
          @click="$emit('click:delete', investment.id)"
        >
          <Icon
            name="material-symbols-light:delete-outline"
            class="w-5 h-5 text-red-700 hover:text-red-800 transition-all duration-100 ease-in-out"
          />
        </BaseButton>
      </div>
    </AppCardBody>
  </AppCard>
</template>
