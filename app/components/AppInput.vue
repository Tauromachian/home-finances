<script setup lang="ts">
defineProps({
  label: { type: String, default: "" },
  error: { type: String, default: "" },
  inputClass: { type: String, default: "" },
});

const attrs = useAttrs();

const [model, modifiers] = defineModel<number | string>({
  set(v) {
    if (modifiers.number) {
      return Number(v);
    }

    return v;
  },
});

const name = computed<string>(() => {
  return String(attrs?.name ?? "");
});
</script>

<template>
  <div>
    <label :for="name" class="text-text-0">{{ label }}</label>
    <div class="mt-1 mb-5 relative">
      <div
        v-if="$slots.prepend"
        class="bg-teal-50 absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none rounded-sm border peer-focus:border-teal-800"
      >
        <slot name="prepend"></slot>
      </div>
      <Field
        v-bind="$attrs"
        v-model="model"
        class="text-field"
        :name="name"
        :class="inputClass"
      />
      <ErrorText> {{ error }}</ErrorText>
    </div>
  </div>
</template>
