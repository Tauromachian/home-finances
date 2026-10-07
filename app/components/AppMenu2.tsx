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
    position: { type: Object as PropType<Position>, default: "bottom left" },
  },
  setup(props, { slots }) {
    const popoverId = useId();

    const activator = makeActivator(slots.activator, popoverId);

    return () => (
      <>
        {activator && activator}

        <div
          id={popoverId}
          ref="popover"
          class="rounded-2xl shadow-lg bg-neutral-2"
          popover=""
          style={{ positionArea: props.position }}
        >
          {slots.default()}
        </div>
      </>
    );
  },
});
