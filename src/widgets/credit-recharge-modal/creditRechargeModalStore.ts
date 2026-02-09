import { create } from "zustand";
import type { RechargeStep, RechargeSource } from "./types";
import type { RechargeResponse } from "@/src/entities/balance/api/rechargeApi";

interface CreditRechargeModalStore {
  isOpen: boolean;
  step: RechargeStep;
  source: RechargeSource | null;
  rechargeResult: RechargeResponse | null;
  isSharing: boolean;

  open: (source: RechargeSource) => void;
  close: () => void;
  setStep: (step: RechargeStep) => void;
  setRechargeResult: (result: RechargeResponse | null) => void;
  setIsSharing: (isSharing: boolean) => void;
}

export const useCreditRechargeModalStore = create<CreditRechargeModalStore>()(
  (set) => ({
    isOpen: false,
    step: 'clipboard',
    source: null,
    rechargeResult: null,
    isSharing: false,

    open: (source: RechargeSource) => set({ isOpen: true, step: 'clipboard', source }),
    close: () => set({ isOpen: false, step: 'clipboard', source: null, rechargeResult: null, isSharing: false }),
    setStep: (step: RechargeStep) => set({ step }),
    setRechargeResult: (result) => set({ rechargeResult: result }),
    setIsSharing: (isSharing) => set({ isSharing }),
  })
);
