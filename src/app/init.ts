import { useEffect } from "react";
import { communication } from "@/src/shared/client/native/client";

const useInit = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("message", communication);
    return () => {
      console.log("brigdeEnd");
      window.removeEventListener("message", communication);
    };
  }, []);
};

export default useInit;
