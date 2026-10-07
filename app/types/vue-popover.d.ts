import "vue";

declare module "vue" {
  interface HTMLAttributes {
    popover?: "" | "auto" | "manual" | boolean;
    popovertarget?: string;
    popovertargetaction?: "show" | "hide" | "toggle";
  }
}

export {};
