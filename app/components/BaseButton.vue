<script setup lang="ts">
const _variants = ["", "regular", "text", "outlined"] as const;

type Variant = (typeof _variants)[number];

const props = defineProps({
  variant: {
    type: String as PropType<Variant>,
    default: "regular",
    validator(value: string | undefined) {
      return ["", "regular", "text", "outlined"].includes(value);
    },
  },
  value: {
    type: [String, Number],
    default: "",
  },
  icon: { type: Boolean, default: false },
  colors: {
    type: Object as PropType<{ color: string; hover: string }>,
    default: () => ({ color: "accent-0", hover: "accent-1" }),
  },
});

const classes = computed(() => {
  const calculatedClasses: Record<Variant, string[]> = {
    "": [],
    text: ["bg-transparent"],
    outlined: ["border", "bg-transparent", "border-neutral-1", "text-text-1"],
    regular: ["text-white", "focus:text-white"],
  };

  const { color, hover } = props.colors;
  calculatedClasses.regular.push(...[`bg-${color}`, `hover:bg-${hover}`]);

  if (props.icon) {
    calculatedClasses[props.variant].push("px-2", "py-2", "rounded-full");
  } else {
    calculatedClasses[props.variant].push("px-3", "py-2", "rounded-xl");
  }

  if (props.variant) return calculatedClasses[props.variant];
  return calculatedClasses.regular;
});
</script>

<template>
  <button class="transition cursor-pointer" :class="classes" :value="value">
    <slot></slot>
  </button>
</template>
