<script lang="ts" setup>
const {
  label = "",
  stepsValues = { start: "start", middle: "middle", end: "end" },
} = defineProps<{
  label?: string;
  stepsValues?: { start: string; middle?: string; end: string };
}>();

const step = defineModel<string>();

function nextStep() {
  if (step.value === stepsValues.start) {
    step.value = stepsValues.middle;
  }

  if (step.value === stepsValues.middle) {
    step.value = stepsValues.end;
  }

  if (step.value === stepsValues.end) {
    step.value = stepsValues.start;
  }
}

const classes = computed<string[]>(() => {
  const finalClasses = ["bg-text-0"];

  const classesByStep = {
    [stepsValues.start]: [],
    [stepsValues.middle]: ["translate-x-3"],
    [stepsValues.end]: ["translate-x-6"],
  };

  finalClasses.push(...classesByStep[step.value]);

  return finalClasses;
});
</script>

<template>
  <div class="flex items-center">
    <button
      type="button"
      class="rounded-full bg-neutral-1 w-12 h-6 cursor-pointer"
      @click="nextStep"
    >
      <div
        class="rounded-full h-4 w-4 transition duration-200 ease-in-out cursor-pointer ml-1"
        :class="classes"
      >
        <input v-model="step" type="checkbox" class="opacity-0" />
      </div>
    </button>
    <label v-if="label" for="" class="cursor-pointer pl-1" @click="nextStep">
      {{ label }}
    </label>
  </div>
</template>
