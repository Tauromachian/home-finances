<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

const _yCoordinate = ["top", "bottom"] as const;
const _xCoordinate = ["start", "end", "left", "right"] as const;

type YCoordinate = (typeof _yCoordinate)[number];
type XCoordinate = (typeof _xCoordinate)[number];

type Anchor = `${YCoordinate} ${XCoordinate}`;

const isOpen = defineModel<boolean>();

const dialogRef = useTemplateRef("dialogRef");

const { location = "", target = undefined } = defineProps<{
  location?: Anchor;
  target?: HTMLElement | ComponentPublicInstance;
}>();

function positionDialog() {
  if (!target) return;

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

onMounted(() => positionDialog());
</script>

<template>
  <dialog ref="dialogRef" :open="isOpen" class="z-50 rounded-2xl shadow-lg">
    <slot></slot>
  </dialog>
</template>
