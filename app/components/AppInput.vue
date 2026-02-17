<script setup>
defineProps({
  label: { type: String, default: "" },
  error: { type: String, default: "" },
  inputClass: { type: String, default: "" },
});
</script>

<template>
  <div>
    <label :for="$attrs.name">{{ label }}</label>
    <div class="mt-1 mb-5 text-gray-800 relative">
      <div
        v-if="$slots.prepend"
        class="bg-teal-50 text-teal-700 absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none rounded-sm border peer-focus:border-teal-800"
      >
        <slot name="prepend"></slot>
      </div>
      <Field v-bind="$attrs" class="text-field" :class="inputClass" />
      <ErrorText> {{ error }}</ErrorText>
    </div>
  </div>
</template>
