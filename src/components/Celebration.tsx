import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface CelebrationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export const Celebration = ({ show, message = "Great Job!", onComplete }: CelebrationProps) => {
  useEffect(() => {
    if (show) {
      // Fire confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ["#ff6b8a", "#ffd93d", "#6bcb77", "#4d96ff", "#c56cf0"];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Call onComplete after animation
      const timeout = setTimeout(() => {
        onComplete?.();
      }, duration + 500);

      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-card rounded-3xl px-8 py-6 shadow-2xl border-4 border-accent"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-5xl md:text-6xl"
              >
                ⭐
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-fredoka font-bold text-rainbow">
                {message}
              </h2>
              <div className="flex gap-2 text-3xl">
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ delay: 0, duration: 0.5, repeat: Infinity }}
                >
                  🎉
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ delay: 0.2, duration: 0.5, repeat: Infinity }}
                >
                  🌟
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ delay: 0.4, duration: 0.5, repeat: Infinity }}
                >
                  🎊
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
