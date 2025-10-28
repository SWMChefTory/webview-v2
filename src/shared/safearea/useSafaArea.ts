import { request, MODE } from "@/src/shared/client/native/client";
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
  console.log("🔍 top:", JSON.stringify(top));
  console.log("🔍 bottom:", JSON.stringify(bottom));
  console.log("🔍 left:", JSON.stringify(left));
  console.log("🔍 right:", JSON.stringify(right));
  useEffect(() => {
    request(MODE.UNBLOCKING, "SAFE_AREA", { top, bottom, left, right });
  }, [top, bottom, left, right]);
}
