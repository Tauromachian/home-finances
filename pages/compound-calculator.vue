<script setup>
const appToaster = ref();

const compoundValue = ref(null);

function submitForm(form) {
  compoundValue.value = { ...form };

  if (!appToaster?.value) return;

  appToaster.value.openToast("New compoundValue added!");
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-5">Compound Calculator</h1>

    <div class="flex flex-col md:flex-row gap-5 md:items-start">
      <CompoundForm @submit="submitForm"></CompoundForm>

      <CompoundStatsCard :compound-value="compoundValue"> </CompoundStatsCard>
    </div>

    <AppToaster ref="appToaster"></AppToaster>
  </div>
</template>
