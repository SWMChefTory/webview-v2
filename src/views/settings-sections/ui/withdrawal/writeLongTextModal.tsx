import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WriteCustomerFeedbackModalContent from "./writeCustomerFeedbackModalContent";

export default function WriteLongTextModal({
  isVisible,
  setModalVisible,
  label,
  initialFeedback, 
  onSave,
}: {
  isVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  label: string;
  initialFeedback?: string; 
  onSave: (feedback: string) => void; 
}) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setModalVisible(false)}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300 
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            style={{ height: "90vh" }}
          >
            <div className="w-full h-full overflow-hidden">
              <WriteCustomerFeedbackModalContent
                onClose={() => setModalVisible(false)}
                onSave={(feedback) => { 
                  onSave(feedback);
                  setModalVisible(false);
                }}
                label={label}
                initialFeedback={initialFeedback} 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}