<script setup lang="ts">
import { parseSpreadsheetFile } from "~/utils/spreadsheet";
import BaseButton from "./BaseButton.vue";

type FileImport = {
  name: string;
  raw: Record<string, unknown>[];
};

const model = defineModel({
  type: Object as PropType<FileImport>,
  default: null,
});

defineProps<{
  accept?: string;
}>();

const emit = defineEmits<{
  change: [];
  "reset-import": [];
}>();

const appToaster = inject<Ref>("appToaster");

const isParsing = ref(false);
const fileInputRef = useTemplateRef("input-ref");
const file = ref<File>();
const isDragEntering = ref(false);

function showMessage(message: string) {
  if (!appToaster?.value) return;
  appToaster.value.openToast(message);
}

async function selectFile(file?: File) {
  if (!file) return;

  model.value.name = file.name;

  isParsing.value = true;

  try {
    model.value.raw = await parseSpreadsheetFile(file);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : "Could not read file");
  } finally {
    isParsing.value = false;
  }

  emit("change");
}

function onFileSelected(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0];

  selectFile(file.value);
}

function onDrop(event: DragEvent) {
  file.value = event.dataTransfer.files?.[0];

  selectFile(file.value);
  isDragEntering.value = false;
}

function clickOnInputFile() {
  fileInputRef.value.click();
}

function resetImport() {
  model.value.name = "";
  file.value = null;
  emit("reset-import");
  if (fileInputRef.value) fileInputRef.value.value = "";
}
</script>

<template>
  <div
    class="flex flex-col relative border-dashed items-center justify-center w-full h-60 border-3 border-accent-0 rounded-lg cursor-pointer p-10"
    @dragenter.prevent="isDragEntering = true"
    @click="clickOnInputFile"
  >
    <div
      class="absolute bg-black opacity-25 inset-0 z-10"
      :class="{ block: isDragEntering, hidden: !isDragEntering }"
      @dragover.prevent
      @dragleave.prevent="isDragEntering = false"
      @drop.prevent.stop="onDrop"
    ></div>

    <AppCard
      v-if="file"
      class="mx-10 relative rounded"
      variant="outlined"
      radius="rounded-md"
      role="button"
    >
      <AppCardBody class="flex justify-between items-center">
        <div>
          <p>
            {{ file.name }}
          </p>
          <p>{{ file.type }}</p>
        </div>

        <BaseButton variant="text" @click.stop="resetImport">
          <Icon
            v-if="file"
            name="material-symbols-light:close"
            size="30"
          ></Icon>
        </BaseButton>
      </AppCardBody>
    </AppCard>

    <AppLoader v-else-if="isParsing" size="70"></AppLoader>

    <template v-else>
      <Icon name="material-symbols-light:upload" size="70"></Icon>
      <p>Drag and drop or click to search</p>
    </template>

    <input
      ref="input-ref"
      type="file"
      class="hidden"
      :accept="accept"
      @change="onFileSelected"
    />
  </div>
</template>
