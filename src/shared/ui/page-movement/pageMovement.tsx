import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/router";

export default function PageMovementTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -500, opacity: 0 }}
      transition={{ duration: 0.06, ease: "easeInOut" }}
      key={router.asPath}
    >
      {children}
    </motion.div>
  );
}
