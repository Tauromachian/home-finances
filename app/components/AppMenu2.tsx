import { cloneVNode, type Slot } from "vue";

const positions = [
  "top left",
  "top",
  "top right",
  "bottom left",
  "bottom",
  "bottom right",
  "left",
  "right",
] as const;

type MenuPosition = (typeof positions)[number];

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
    position: {
      type: String as PropType<MenuPosition>,
      default: "bottom left",
      validator(value: string | undefined) {
        return positions.includes(value as MenuPosition);
      },
    },
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
