import { create } from "zustand";
import type { RechargeStep, RechargeSource } from "./types";

export interface RechargeResult {
  amount: number;
  remainingCount: number;
}

interface CreditRechargeModalStore {
  isOpen: boolean;
  step: RechargeStep;
  source: RechargeSource | null;
  rechargeResult: RechargeResult | null;

  open: (source: RechargeSource) => void;
  close: () => void;
  setStep: (step: RechargeStep) => void;
  setRechargeResult: (result: RechargeResult | null) => void;
}

export const useCreditRechargeModalStore = create<CreditRechargeModalStore>()(
  (set) => ({
    isOpen: false,
    step: 'clipboard',
    source: null,
    rechargeResult: null,

    open: (source: RechargeSource) => set({ isOpen: true, step: 'clipboard', source }),
    close: () => set({ isOpen: false, step: 'clipboard', source: null, rechargeResult: null }),
    setStep: (step: RechargeStep) => set({ step }),
    setRechargeResult: (result) => set({ rechargeResult: result }),
  })
);
