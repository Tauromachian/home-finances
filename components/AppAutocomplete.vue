<script setup lang="ts">
type Item = {
  title: string;
  value: string;
  icon: {
    name: string;
    color: string;
  };
};

const model = defineModel({
  type: String,
  default: "",
});

defineProps({
  name: { type: String, required: true },
  label: { type: String, default: "" },
  items: { type: Array as PropType<Item[]>, default: [] },
  error: { type: String, default: "" },
});

const isVisible = ref(false);
const fadingInOut = ref(false);
const input = ref("");

function handleFocus() {
  isVisible.value = true;
  setTimeout(() => {
    fadingInOut.value = true;
  }, 10);
}

function handleBlur() {
  setTimeout(() => {
    fadingInOut.value = false;
    input.value = model.value;
    isVisible.value = false;
  }, 300);
}

const filteredItems = computed(() => {
  return categories.filter((item) => {
    return item.name.toLowerCase().includes(input.value.toLowerCase());
  });
});
</script>

<template>
  <label :for="name">{{ label }}</label>
  <div class="block mt-1 mb-5 text-gray-800 relative">
    <Field
      v-model="model"
      :name="name"
      type="text"
      v-bind="$attrs"
      class="relative text-field peer"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <ErrorText>{{ error }}</ErrorText>

    <div
      v-if="isVisible"
      class="bg-white w-full mt-1 p-2 rounded-lg border border-gray-300 absolute z-10 transition-opacity"
      :class="{
        'opacity-100': fadingInOut,
        'opacity-0': !fadingInOut,
      }"
    >
      <div v-if="!filteredItems.length" class="text-center">
        No types match your search
      </div>
      <div
        v-for="item in items"
        v-else
        :key="item.value"
        class="pl-2 flex h-7 items-center cursor-pointer hover:bg-gray-200 rounded-full transition"
        @click="model = item.value"
      >
        <Icon
          v-if="item.icon"
          :name="item.icon.name"
          class="w-5 h-5 pl-2 mr-4"
          :style="{ color: item.icon.color }"
        />
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>
