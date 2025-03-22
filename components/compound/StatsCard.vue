<script setup>
import { calculateCompoundInterest } from "@/utils/compound";

const props = defineProps({
  compoundValue: { type: [Object, null], default: () => {} },
});

const finalAmount = ref(0);
const interestEarned = ref(0);

watchEffect(() => {
  if (!props.compoundValue) return;

  const calculatedCompound = calculateCompoundInterest(
    props.compoundValue.amount,
    props.compoundValue.percent,
  );

  finalAmount.value = calculatedCompound.finalAmount;
  interestEarned.value = calculatedCompound.interestEarned;
});
</script>

<template>
  <div id="expense-stats" class="w-full max-w-md flex mobile:items-center">
    <AppCard>
      <AppCardBody>
        <div class="max-h-screen overflow-scroll relative">
          <div v-if="finalAmount && interestEarned">
            <p>{{ finalAmount }}</p>
            <p>{{ interestEarned }}</p>
          </div>

          <div v-else class="text-center my-20">
            Nothing to compound! Add one
          </div>
        </div>
      </AppCardBody>
    </AppCard>
  </div>
</template>
