<script setup lang="ts">
const model = defineModel<boolean>();

const DURATION = 150; // milliseconds
const classes = computed(() => {
  return model.value
    ? ["scale-100", "backdrop:opacity-40"]
    : ["scale-0", "backdrop:opacity-0"];
});

const dialogID = useId();
const dialogEl = useTemplateRef("dialog");

let hasJustOpened = false;

watch(model, () => {
  hasJustOpened = true;
  dialogEl.value.togglePopover();
});

function onToggle() {
  if (hasJustOpened) {
    hasJustOpened = false;
    return;
  }

  model.value = false;
}
</script>

<template>
  <Teleport to="body">
    <dialog
      :id="dialogID"
      ref="dialog"
      popover
      class="backdrop:bg-black w-sm rounded-2xl left-1/2 top-1/2 -translate-1/2 transition bg-neutral-0"
      :class="[...classes, `duration-${DURATION}`]"
      @toggle="onToggle"
    >
      <div>
        <button
          :popovertarget="dialogID"
          class="absolute z-10 top-2 cursor-pointer right-4 text-gray-600 hover:text-red-500 text-lg font-bold"
          type="button"
        >
          ✕
        </button>

        <slot></slot>
      </div>
    </dialog>
  </Teleport>
</template>
