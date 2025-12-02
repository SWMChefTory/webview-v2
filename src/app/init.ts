import { useEffect } from "react";
import { communication } from "@/src/shared/client/native/client";

const useInit = () => {
  useEffect(() => {
    // if (typeof window === "undefined") throw new Error("window is not defined");
    //사파리 전용
    window.addEventListener("message", communication);
    //크로미움 전용
    document.addEventListener('message' as any, communication); 
    return () => {
      console.log("brigdeEnd");
      window.removeEventListener("message", communication);
    };
  }, []);
};

export default useInit;
