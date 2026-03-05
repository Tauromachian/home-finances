<script setup lang="ts">
import type { Item } from "@/types/item";

defineModel({
  type: String,
  default: "",
});

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: "" },
  error: { type: String, default: "" },
  items: {
    type: Array as PropType<Item[]>,
    default: () => [],
  },
});

const emit = defineEmits(["selected"]);

const searchQuery = ref("");
const isOpen = ref(false);
const selectedIndex = ref(-1);

const inputRef = useTemplateRef("inputRef");
const listRef = useTemplateRef("listRef");

const filteredItems = computed(() => {
  return searchQuery.value
    ? props.items.filter((item) =>
        item.value.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    : props.items;
});

const onInput = () => {
  isOpen.value = true;
  selectedIndex.value = -1;
};

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowUp":
      event.preventDefault();
      moveSelection(-1);
      break;
    case "ArrowDown":
      event.preventDefault();
      moveSelection(1);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectItem(filteredItems.value[selectedIndex.value]);
      }
      break;
    case "Escape":
      isOpen.value = false;
      inputRef.value.$el.blur();
      break;
  }
};

const moveSelection = (direction: number) => {
  const itemsCount = filteredItems.value.length;
  if (!itemsCount) return;

  selectedIndex.value = Math.max(
    -1,
    Math.min(itemsCount - 1, selectedIndex.value + direction),
  );
};

const selectItem = (item: Item) => {
  searchQuery.value = item.value;
  isOpen.value = false;
  selectedIndex.value = -1;
  emit("selected", item);
};

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return;

  if (
    inputRef.value.$el.contains(event.target) ||
    listRef.value.contains(event.target as Node)
  ) {
    return;
  }

  isOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative mt-1 mb-5">
    <label :for="name" class="text-text-0">{{ label }}</label>

    <Field
      ref="inputRef"
      v-model="searchQuery"
      v-bind="$attrs"
      class="text-field peer"
      :name="name"
      @input="onInput"
      @keydown="onKeyDown"
      @focus="isOpen = true"
    />
    <Transition name="fade">
      <ul
        v-if="isOpen && filteredItems.length"
        ref="listRef"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
      >
        <li
          v-for="(item, index) in filteredItems"
          :key="item.value"
          :class="[
            'pl-2 flex h-7 items-center cursor-pointer hover:bg-gray-200 rounded-full transition',
            { 'bg-gray-100': index === selectedIndex },
          ]"
          @click="selectItem(item)"
        >
          <Icon
            v-if="item.icon"
            :name="item.icon.name"
            class="w-5 h-5 pl-2 mr-4"
            :style="{ color: item.icon.color }"
          />

          {{ item.title }}
        </li>
      </ul>
    </Transition>

    <ErrorText class="absolute"> {{ error }}</ErrorText>

    <Icon
      name="material-symbols-light:arrow-drop-down"
      class="absolute right-2 top-8 text-text-0"
      size="24"
    ></Icon>
  </div>
</template>
