<script setup lang="ts">
const props = defineProps({
  label: { type: String, default: "" },
  error: { type: String, default: "" },
  inputClass: { type: String, default: "" },
  noError: { type: Boolean, default: false },
  "onClick:prepend": { type: Function, default: undefined },
  "onClick:append": { type: Function, default: undefined },
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

const emit = defineEmits<{
  "click:prepend": [];
  "click:append": [];
}>();

const name = computed<string>(() => {
  return String(attrs?.name ?? "");
});
</script>

<template>
  <div>
    <label v-if="label" :for="name" class="text-text-0">{{ label }}</label>
    <div class="mt-1 relative" :class="{ 'mb-5': !noError, 'mb-1': noError }">
      <div
        v-if="$slots.prepend"
        data-testid="prepend-icon-el"
        class="bg-neutral-1 text-text-1 absolute inset-y-0 left-0 px-2 flex items-center rounded-l-xl border border-neutral-1"
        :class="{
          'pointer-events-none': !props['onClick:prepend'],
          'cursor-pointer': props['onClick:prepend'],
        }"
        @click="emit('click:prepend')"
      >
        <slot name="prepend"></slot>
      </div>
      <div
        v-if="$slots.append"
        data-testid="append-icon-el"
        class="bg-neutral-1 text-text-1 absolute inset-y-0 right-0 px-2 flex items-center rounded-r-xl border border-neutral-1"
        :class="{
          'pointer-events-none': !props['onClick:append'],
          'cursor-pointer': props['onClick:append'],
        }"
        @click="emit('click:append')"
      >
        <slot name="append"></slot>
      </div>
      <Field
        v-bind="$attrs"
        v-model="model"
        class="text-field"
        :name="name"
        :class="inputClass"
      />
      <ErrorText v-if="!noError" class="absolute"> {{ error }}</ErrorText>
    </div>
  </div>
</template>
