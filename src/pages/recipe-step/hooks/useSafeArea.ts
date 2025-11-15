import type { SafeAreaProps } from "@/src/shared/safearea/useSafaArea";
import { Orientation } from "./useOrientation";
import { useSafeArea as useSafeAreaGlobal } from "@/src/shared/safearea/useSafaArea";

type SafeAreaConfig = {
  top: SafeAreaProps;
  bottom: SafeAreaProps;
  left: SafeAreaProps;
  right: SafeAreaProps;
};

const SAFE_AREA_CONFIG: Record<Orientation, SafeAreaConfig> = {
  portrait: {
    top: { color: "#000000", isExists: true },
    bottom: { color: "#000000", isExists: false },
    left: { color: "#000000", isExists: false },
    right: { color: "#000000", isExists: false },
  },
  "landscape-left": {
    top: { color: "#000000", isExists: false },
    bottom: { color: "#000000", isExists: false },
    left: { color: "#000000", isExists: false },
    right: { color: "#000000", isExists: true },
  },
  "landscape-right": {
    top: { color: "#000000", isExists: false },
    bottom: { color: "#000000", isExists: false },
    left: { color: "#000000", isExists: true },
    right: { color: "#000000", isExists: false },
  },
};

export function useSafeArea({ orientation }: { orientation: Orientation }) {
  useSafeAreaGlobal(SAFE_AREA_CONFIG[orientation]);
}
