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

function showMessage(message: string) {
  if (!appToaster?.value) return;
  appToaster.value.openToast(message);
}

async function onFileSelected(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0];
  if (!file.value) return;

  model.value.name = file.value.name;

  isParsing.value = true;

  try {
    model.value.raw = await parseSpreadsheetFile(file.value);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : "Could not read file");
  } finally {
    isParsing.value = false;
  }

  emit("change");
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
    class="flex flex-col items-center justify-center w-full h-60 border border-accent-0 rounded-lg cursor-pointer p-10"
    @click="clickOnInputFile"
  >
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
