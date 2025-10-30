import { MODE, request } from "@/src/shared/client/native/client";
import { useEffect } from "react";

export type SafeAreaProps = {
  color: string;
  isExists: boolean;
};

export function useSafeArea({
  top,
  bottom,
  left,
  right,
}: {
  top?: SafeAreaProps;
  bottom?: SafeAreaProps;
  left?: SafeAreaProps;
  right?: SafeAreaProps;
}) {
  useEffect(() => {
    request(MODE.UNBLOCKING, "SAFE_AREA", { top, bottom, left, right });
  }, [top, bottom, left, right]);
}
