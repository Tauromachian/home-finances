<script setup>
const props = defineProps({
  label: { type: String, default: "" },
  error: { type: String, default: "" },
  inputClass: { type: String, default: "" },
});
</script>

<template>
  <div>
    <label :for="$attrs.name">{{ label }}</label>
    <div class="mt-1 mb-5 text-gray-800 relative">
      <slot name="prepend"></slot>
      <Field v-bind="$attrs" class="text-field" :class="inputClass" />
      <ErrorText> {{ error }}</ErrorText>
    </div>
  </div>
</template>
