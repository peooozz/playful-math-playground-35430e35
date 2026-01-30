import { motion } from "framer-motion";

const decorations = [
  { emoji: "🦋", position: "top-8 left-4 md:left-12", delay: 0 },
  { emoji: "🌸", position: "top-16 right-8 md:right-16", delay: 0.5 },
  { emoji: "🎈", position: "top-32 left-2 md:left-8", delay: 1 },
  { emoji: "🌻", position: "bottom-32 right-4 md:right-12", delay: 1.5 },
  { emoji: "🎀", position: "bottom-48 left-4 md:left-16", delay: 2 },
  { emoji: "🍀", position: "bottom-16 right-8 md:right-20", delay: 0.8 },
  { emoji: "⭐", position: "top-48 right-2 md:right-8", delay: 1.2 },
  { emoji: "🌈", position: "bottom-24 left-8 md:left-24", delay: 0.3 },
];

export const FloatingDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((dec, index) => (
        <motion.div
          key={index}
          className={`absolute ${dec.position} text-2xl md:text-3xl opacity-60`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 0.6, 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            delay: dec.delay,
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {dec.emoji}
        </motion.div>
      ))}
    </div>
  );
};
