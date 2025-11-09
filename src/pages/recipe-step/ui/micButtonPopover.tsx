import { useImperativeHandle, useState } from "react";
import { useAnimate } from "motion/react";

export type popoverHandle = {
  showMessage: (message: string) => void;
};

export function MicButtonPopover({
  ref,
}: {
  ref: React.RefObject<popoverHandle | undefined>;
}) {
  const [scope, animate] = useAnimate();
  const [message, setMessage] = useState<string>("");

  useImperativeHandle(ref, () => ({
    showMessage: (message: string) => {
      animate(
        scope.current,
        { opacity: [1, 1, 0] },
        { times: [0, 0.5, 1], duration: 2, ease: "easeOut" }
      );
      setMessage(message);
    },
  }));

  return (
    <div
      ref={scope}
      style={{ opacity: 0 }}
      className="absolute right-[2] bottom-full bg-gray-500 text-white text-xs px-3 py-2 rounded-md shadow-md whitespace-nowrap z-[100]"
    >
      {message}
      <div
        className="absolute right-[8] top-full w-0 h-0 
            border-l-8 border-l-transparent   
            border-r-8 border-r-transparent 
            border-t-8 border-t-gray-500"
      ></div>
    </div>
  );
}
