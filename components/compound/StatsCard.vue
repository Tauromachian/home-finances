<script setup>
import { calculateCompoundInterest } from "@/utils/compound";

const props = defineProps({
  compoundValue: { type: [Object, null], default: () => {} },
});

const total = ref(0);

watchEffect(() => {
  if (!props.compoundValue) return;

  total.value = calculateCompoundInterest(
    props.compoundValue.amount,
    props.compoundValue.percent,
  );
});
</script>

<template>
  <div id="expense-stats" class="w-full max-w-md flex mobile:items-center">
    <AppCard>
      <AppCardBody>
        <div class="max-h-screen overflow-scroll relative">
          <div v-if="total">
            <p class="text-xl">Total</p>
            <p>{{ total }}</p>
          </div>

          <div v-else class="text-center my-20">
            Nothing to compound! Add one
          </div>
        </div>
      </AppCardBody>
    </AppCard>
  </div>
</template>
