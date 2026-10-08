import { cloneVNode, type Slot } from "vue";

const _physicalValues = [
  "left",
  "center",
  "right",
  "top",
  "center",
  "bottom",
] as const;

type PhysicalValue = (typeof _physicalValues)[number];

type Position = PhysicalValue | `${PhysicalValue} ${PhysicalValue}`;

function makeActivator(slot: Slot | undefined, id: string): VNode | undefined {
  if (!slot && import.meta.dev) {
    console.error("This component requires one activator");
    return;
  }

  const vNodes = slot();

  if (vNodes.length > 1 && import.meta.dev) {
    console.warn("Only the first Node or Element will be used.");
  }

  const vNode = vNodes[0];

  if (!vNode) {
    console.warn("This component requires one activator");
    return;
  }

  const newNode = cloneVNode(vNode, { popovertarget: id });

  return newNode;
}

export default defineComponent({
  props: {
    modelValue: { type: Boolean, default: false },
    position: { type: String as PropType<Position>, default: "bottom left" },
    minWidth: { type: [Number, String], default: undefined },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    const popoverId = useId();

    const popoverRef = useTemplateRef<HTMLElement>("popover");

    const activator = makeActivator(slots.activator, popoverId);

    const isOpen = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit("update:modelValue", val);
      },
    });

    watch(isOpen, (val) => {
      if (val) {
        popoverRef.value.showPopover();
      } else {
        popoverRef.value.hidePopover();
      }
    });

    function togglePopover(event: ToggleEvent) {
      if (event.newState === "open") {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    }

    onMounted(() => popoverRef.value.addEventListener("toggle", togglePopover));
    onBeforeUnmount(() => {
      popoverRef.value.removeEventListener("toggle", togglePopover);
    });

    return () => (
      <>
        {activator && activator}

        <div
          id={popoverId}
          ref="popover"
          class="rounded-2xl shadow-lg bg-neutral-2 overflow-visible"
          popover=""
          style={{
            positionArea: props.position,
            "min-width": props.minWidth ?? "unset",
          }}
        >
          {slots.default()}
        </div>
      </>
    );
  },
});
