<script setup lang="ts">
const props = defineProps<{
  symbol: string;
  price: number | null;
  currency: string | null;
  gain: number | null;
  returnPct: number | null;
  stale: boolean;
}>();

const gainColor = computed(() => {
  if (props.gain === null || props.gain === undefined) return "text-text-0";
  if (props.gain > 0) return "text-green-700";
  if (props.gain < 0) return "text-red-700";
  return "text-text-0";
});

function formatPrice(price: number | null, currency: string | null) {
  if (price === null || price === undefined || !Number.isFinite(price))
    return "—";
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: currency ?? "EUR",
    }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency ?? ""}`.trim();
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" data-testid="live-badge">
    <span
      class="rounded-full bg-neutral-1 px-2 py-0.5 text-xs font-bold uppercase text-text-1"
    >
      {{ symbol }}
    </span>

    <span class="font-serif text-text-1 text-lg">
      {{ formatPrice(price, currency) }}
    </span>

    <span
      v-if="gain !== null && gain !== undefined"
      :class="['text-sm font-bold', gainColor]"
    >
      {{ gain >= 0 ? "▲" : "▼" }}
      {{ formatPrice(Math.abs(gain), currency) }}
      <span v-if="returnPct !== null && returnPct !== undefined">
        ({{ returnPct >= 0 ? "+" : "" }}{{ returnPct.toFixed(2) }}%)
      </span>
    </span>

    <span v-if="stale" class="text-xs text-text-0 opacity-70">stale</span>
  </div>
</template>
