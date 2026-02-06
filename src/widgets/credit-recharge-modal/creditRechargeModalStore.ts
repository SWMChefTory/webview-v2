import { create } from "zustand";
import type { RechargeStep, RechargeSource } from "./types";

interface CreditRechargeModalStore {
  isOpen: boolean;
  step: RechargeStep;
  source: RechargeSource | null;

  open: (source: RechargeSource) => void;
  close: () => void;
  setStep: (step: RechargeStep) => void;
}

export const useCreditRechargeModalStore = create<CreditRechargeModalStore>()(
  (set) => ({
    isOpen: false,
    step: 'clipboard',
    source: null,

    open: (source: RechargeSource) => set({ isOpen: true, step: 'clipboard', source }),
    close: () => set({ isOpen: false, step: 'clipboard', source: null }),
    setStep: (step: RechargeStep) => set({ step }),
  })
);
