<script setup lang="ts">
const props = defineProps({
  compoundValue: { type: Number, default: 1 },
});
</script>

<template>
  <div id="expense-stats" class="w-full max-w-md flex mobile:items-center">
    <AppCard>
      <AppCardBody>
        <div class="max-h-screen overflow-scroll relative">
          <div v-if="compoundValue">
            <p class="text-xl">Total</p>
            <p>{{ compoundValue }}</p>
          </div>

          <div v-else class="text-center my-20">
            Nothing to compound! Add one
          </div>
        </div>
      </AppCardBody>
    </AppCard>
  </div>
</template>
