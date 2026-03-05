<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

const _yCoordinate = ["top", "bottom"] as const;
const _xCoordinate = ["start", "end", "left", "right"] as const;

type YCoordinate = (typeof _yCoordinate)[number];
type XCoordinate = (typeof _xCoordinate)[number];

type Anchor = `${YCoordinate} ${XCoordinate}`;

const { location = "", target = undefined } = defineProps<{
  location?: Anchor;
  target?: HTMLElement | Ref<ComponentPublicInstance> | ComponentPublicInstance;
}>();

const isOpen = defineModel<boolean>();
const dialogRef = useTemplateRef("dialogRef");

let isOpening = true;
let resizeObserver: ResizeObserver;

function positionDialog() {
  if (!target) return;

  if (!dialogRef.value) return;

  let clientRect = null;

  if (target instanceof HTMLElement) {
    clientRect = target.getBoundingClientRect();
  } else if ("$el" in target && target.$el instanceof HTMLElement) {
    clientRect = target.$el.getBoundingClientRect();
  } else {
    console.warn(
      "AppMenu won't work unless the element passed in target prop is instance of HTMLElement or a component with an HTMLElement",
    );
  }

  const [firstCoordinate, secondCoordinate] = location.split(" ");

  if (firstCoordinate === "bottom") {
    dialogRef.value.style.top = `${clientRect[firstCoordinate]}px`;
  }

  if (secondCoordinate === "left") {
    dialogRef.value.style.left = `${clientRect[secondCoordinate]}px`;
  }

  const dialogWidth = dialogRef.value.clientWidth;
  if (secondCoordinate === "right") {
    dialogRef.value.style.left = `${clientRect[secondCoordinate] - dialogWidth}px`;
  }
}

function clickOutside() {
  if (isOpening) {
    isOpening = false;
    return;
  }

  isOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  clickOutside();
}

watch(isOpen, async (newVal, oldVal) => {
  if (!oldVal && newVal) isOpening = true;

  if (!newVal) return;

  await nextTick();
  positionDialog();

  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(positionDialog);
    resizeObserver.observe(document.body);
  }
});

onMounted(() => {
  document.body.addEventListener("click", clickOutside);
  document.body.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.body.removeEventListener("click", clickOutside);
  document.body.removeEventListener("keydown", onKeydown);

  if (!resizeObserver?.disconnect) return;

  resizeObserver.disconnect();
});
</script>

<template>
  <dialog
    ref="dialogRef"
    :open="isOpen"
    class="z-50 rounded-2xl shadow-lg bg-neutral-2"
    @click.stop
  >
    <slot></slot>
  </dialog>
</template>
