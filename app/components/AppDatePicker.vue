<script setup lang="ts">
import { months } from "~/utils/months";

const model = defineModel<string>({ default: "" });

const {
  label = "",
  placeholder = "Select date",
  min = "",
  max = "",
  disabled = false,
} = defineProps<{
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}>();

const isOpen = ref(false);
const rootRef = useTemplateRef("rootRef");

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseISO(
  value: string,
): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { year, month, day };
}

function toISO(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function todayISO(): string {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

const today = todayISO();

const initial = computed(() => parseISO(model.value));

const viewYear = ref(initial.value?.year ?? new Date().getFullYear());
const viewMonth = ref((initial.value?.month ?? new Date().getMonth() + 1) - 1);

const displayValue = computed(() => {
  const parsed = parseISO(model.value);
  if (!parsed) return "";

  return `${parsed.day} ${months[parsed.month - 1]} ${parsed.year}`;
});

const monthLabel = computed(
  () => `${months[viewMonth.value]} ${viewYear.value}`,
);

const calendarDays = computed(() => {
  const year = viewYear.value;
  const monthIndex = viewMonth.value;

  const firstOfMonth = new Date(year, monthIndex, 1);
  // Monday-first offset: JS getDay() is 0 (Sun) - 6 (Sat)
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: ({ day: number; iso: string } | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, iso: toISO(year, monthIndex + 1, day) });
  }
  return cells;
});

function isDisabled(iso: string): boolean {
  if (min && iso < min) return true;
  if (max && iso > max) return true;
  return false;
}

function open() {
  if (disabled) return;

  const parsed = parseISO(model.value);
  if (parsed) {
    viewYear.value = parsed.year;
    viewMonth.value = parsed.month - 1;
  }
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

function selectDay(iso: string) {
  if (isDisabled(iso)) return;
  model.value = iso;
  close();
}

function clear() {
  model.value = "";
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value -= 1;
  } else {
    viewMonth.value -= 1;
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value += 1;
  } else {
    viewMonth.value += 1;
  }
}

function goToday() {
  const now = new Date();
  viewYear.value = now.getFullYear();
  viewMonth.value = now.getMonth();
}

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value) return;
  const el = rootRef.value as HTMLElement | null;
  if (el && !el.contains(event.target as Node)) close();
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") close();
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="rootRef" class="relative mt-1 mb-5">
    <label v-if="label" class="text-text-0">{{ label }}</label>

    <button
      type="button"
      data-testid="datepicker-trigger"
      :disabled="disabled"
      class="text-field mt-1 flex items-center justify-between gap-2 text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span :class="displayValue ? 'text-text-1' : 'text-text-0'">
        {{ displayValue || placeholder }}
      </span>
      <span class="flex items-center gap-1">
        <Icon
          v-if="model"
          name="material-symbols-light:close"
          size="20"
          class="text-text-0 hover:text-text-1"
          data-testid="datepicker-clear"
          @click.stop="clear"
        />
        <Icon
          name="material-symbols-light:calendar-month"
          size="20"
          class="text-text-0"
        />
      </span>
    </button>

    <Transition name="fade">
      <div
        v-if="isOpen"
        data-testid="datepicker-calendar"
        class="absolute z-90 mt-1 w-72 rounded-xl border border-neutral-1 bg-neutral-2 p-3 shadow-lg"
      >
        <div class="mb-2 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            class="rounded-lg p-1 hover:bg-neutral-1"
            @click="prevMonth"
          >
            <Icon name="material-symbols-light:chevron-left" size="20" />
          </button>
          <p class="text-sm font-medium text-text-1">{{ monthLabel }}</p>
          <button
            type="button"
            aria-label="Next month"
            class="rounded-lg p-1 hover:bg-neutral-1"
            @click="nextMonth"
          >
            <Icon name="material-symbols-light:chevron-right" size="20" />
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center">
          <span
            v-for="day in WEEKDAYS"
            :key="day"
            class="py-1 text-xs font-medium text-text-0"
          >
            {{ day }}
          </span>

          <template v-for="(cell, index) in calendarDays" :key="index">
            <span v-if="!cell" />
            <button
              v-else
              type="button"
              :disabled="isDisabled(cell.iso)"
              :data-testid="`datepicker-day-${cell.iso}`"
              :class="[
                'rounded-lg py-1 text-sm transition disabled:cursor-not-allowed disabled:opacity-30',
                cell.iso === model
                  ? 'bg-accent-0 text-white'
                  : cell.iso === today
                    ? 'border border-accent-0 text-text-1'
                    : 'text-text-1 hover:bg-neutral-1',
              ]"
              @click="selectDay(cell.iso)"
            >
              {{ cell.day }}
            </button>
          </template>
        </div>

        <div class="mt-2 flex justify-end">
          <button
            type="button"
            class="text-sm text-accent-0 hover:underline"
            @click="goToday"
          >
            Today
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
