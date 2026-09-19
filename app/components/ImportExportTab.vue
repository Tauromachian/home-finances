<script setup lang="ts">
import {
  downloadTextFile,
  downloadXlsxFile,
  exportFilename,
  normalizeImportRows,
  toCsv,
  type NormalizedImport,
  type SheetColumn,
  type SheetRow,
} from "~/utils/spreadsheet";
import { isInRange } from "~/utils/period";

const props = defineProps<{
  records: Record<string, unknown>[];
  columns: SheetColumn[];
  importUrl: string;
  entityName: string;
  dateKey: string;
}>();

const emit = defineEmits<{
  imported: [];
}>();

const { activeGroupId, activeGroup } = useGroups();
const appToaster = inject<Ref>("appToaster");

const fileImport = reactive({
  name: "",
  raw: [],
});
const preview = ref<NormalizedImport | null>(null);
const isImporting = ref(false);

const scopeLabel = computed(() => activeGroup.value?.name ?? "Personal");
const filePrefix = computed(() => `${props.entityName}s`);

// Empty bounds mean unbounded, so clearing a picker exports everything
// on that side again.
const exportStart = ref("");
const exportEnd = ref("");

const exportRecords = computed(() =>
  (props.records ?? []).filter((record) =>
    isInRange(
      String(record[props.dateKey] ?? ""),
      exportStart.value || null,
      exportEnd.value || null,
    ),
  ),
);

function showMessage(message: string) {
  if (!appToaster?.value) return;
  appToaster.value.openToast(message);
}

function exportCsv() {
  downloadTextFile(
    exportFilename(filePrefix.value, "csv"),
    toCsv(exportRecords.value, props.columns),
    "text/csv",
  );
  showMessage(`${exportRecords.value.length} ${filePrefix.value} exported`);
}

async function exportExcel() {
  await downloadXlsxFile(
    exportFilename(filePrefix.value, "xlsx"),
    exportRecords.value,
    props.columns,
  );
  showMessage(`${exportRecords.value.length} ${filePrefix.value} exported`);
}

function resetImport() {
  preview.value = null;
}

async function onFileSelected() {
  preview.value = normalizeImportRows(fileImport.raw, props.columns);
}

async function confirmImport() {
  if (!preview.value?.rows.length) return;

  isImporting.value = true;

  try {
    const res = await fetch(props.importUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: preview.value.rows,
        groupId: activeGroupId.value,
      }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data?.message ?? "Import failed");

    const skipped: string[] = data.errors ?? [];
    showMessage(
      skipped.length
        ? `${data.inserted} imported, ${skipped.length} rows rejected`
        : `${data.inserted} ${filePrefix.value} imported!`,
    );

    preview.value = { rows: [], errors: skipped };
    resetFileOnly();
    emit("imported");
  } catch (error) {
    showMessage(error instanceof Error ? error.message : "Import failed");
  } finally {
    isImporting.value = false;
  }
}

function resetFileOnly() {
  fileImport.name = "";
}

function previewCell(row: SheetRow, column: SheetColumn): string {
  const value = row[column.key];
  return value === null || value === undefined ? "" : String(value);
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppCard>
      <AppCardBody>
        <p class="text-md font-bold">Export</p>
        <p class="text-sm text-text-0 mt-1">
          Downloads the {{ exportRecords.length }} {{ filePrefix }} in the
          current scope ({{ scopeLabel }}) and period.
        </p>
        <div class="grid sm:grid-cols-2 gap-x-5 mt-4">
          <AppDatePicker
            v-model="exportStart"
            label="Start date"
            placeholder="Select start date"
            :max="exportEnd || ''"
          />
          <AppDatePicker
            v-model="exportEnd"
            label="End date"
            placeholder="Select end date"
            :min="exportStart || ''"
          />
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <BaseButton :disabled="!exportRecords.length" @click="exportCsv">
            Export CSV
          </BaseButton>
          <BaseButton
            variant="outlined"
            :disabled="!exportRecords.length"
            @click="exportExcel"
          >
            Export Excel
          </BaseButton>
        </div>
      </AppCardBody>
    </AppCard>

    <AppCard>
      <AppCardBody>
        <p class="text-md font-bold">Import</p>
        <p class="text-sm text-text-0 mt-1">
          New rows are added to the current scope ({{ scopeLabel }}). Expected
          columns: {{ columns.map((c) => c.label).join(", ") }}.
        </p>

        <AppImport
          v-model="fileImport"
          class="mt-5"
          accept=".csv,.xlsx,.xls"
          @change="onFileSelected"
          @reset-import="resetImport"
        ></AppImport>

        <div v-if="preview" class="mt-4">
          <p class="text-sm text-text-1">
            {{ preview.rows.length }} rows ready to import,
            {{ preview.errors.length }} with errors.
          </p>

          <div
            v-if="preview.rows.length"
            class="overflow-x-auto mt-3 rounded-xl border border-neutral-1"
          >
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-text-0">
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    class="px-3 py-2 font-medium"
                  >
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in preview.rows.slice(0, 5)"
                  :key="index"
                  class="border-t border-neutral-1 text-text-1"
                >
                  <td
                    v-for="column in columns"
                    :key="column.key"
                    class="px-3 py-2"
                  >
                    {{ previewCell(row, column) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              v-if="preview.rows.length > 5"
              class="text-xs text-text-0 px-3 py-2"
            >
              …and {{ preview.rows.length - 5 }} more rows.
            </p>
          </div>

          <ul v-if="preview.errors.length" class="mt-3 flex flex-col gap-1">
            <li
              v-for="(error, index) in preview.errors.slice(0, 10)"
              :key="index"
              class="text-sm text-red-600"
            >
              {{ error }}
            </li>
            <li v-if="preview.errors.length > 10" class="text-sm text-text-0">
              …and {{ preview.errors.length - 10 }} more errors.
            </li>
          </ul>

          <BaseButton
            class="mt-4"
            :disabled="!preview.rows.length || isImporting"
            @click="confirmImport"
          >
            {{
              isImporting ? "Importing…" : `Import ${preview.rows.length} rows`
            }}
          </BaseButton>
        </div>
      </AppCardBody>
    </AppCard>
  </div>
</template>
