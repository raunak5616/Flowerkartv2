import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function Toast({ message, type = "success", show }) {
  const Icon = type === "success" ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-bold shadow-2xl backdrop-blur ${
            type === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
              : "border-rose-200 bg-rose-50/95 text-rose-700"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
