import type { Transition } from "motion/react";

export const microDampingPreset: Transition = {
  type: "spring",
  damping: 24,
};

export const microReboundPreset: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
};
