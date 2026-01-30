import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NumberSelectorProps {
  currentNumber: number;
  onNumberChange: (num: number) => void;
}

const colors = [
  "bg-rainbow-red",
  "bg-rainbow-orange", 
  "bg-rainbow-yellow",
  "bg-rainbow-green",
  "bg-rainbow-teal",
  "bg-rainbow-blue",
  "bg-rainbow-purple",
  "bg-rainbow-pink",
  "bg-rainbow-red",
  "bg-rainbow-green",
  "bg-rainbow-blue",
];

export const NumberSelector = ({ currentNumber, onNumberChange }: NumberSelectorProps) => {
  return (
    <div className="w-full">
      {/* Navigation arrows */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <motion.button
          onClick={() => onNumberChange(Math.max(0, currentNumber - 1))}
          disabled={currentNumber === 0}
          className="w-12 h-12 rounded-full bg-card shadow-md flex items-center justify-center disabled:opacity-30 touch-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </motion.button>
        
        <div className="text-2xl md:text-3xl font-fredoka font-bold text-foreground">
          Number {currentNumber}
        </div>
        
        <motion.button
          onClick={() => onNumberChange(Math.min(10, currentNumber + 1))}
          disabled={currentNumber === 10}
          className="w-12 h-12 rounded-full bg-card shadow-md flex items-center justify-center disabled:opacity-30 touch-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </motion.button>
      </div>
      
      {/* Number grid */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2">
        {Array.from({ length: 11 }).map((_, num) => (
          <motion.button
            key={num}
            onClick={() => onNumberChange(num)}
            className={`
              w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl
              font-fredoka font-bold text-lg md:text-2xl text-white
              shadow-md transition-all no-select touch-button
              ${colors[num]}
              ${currentNumber === num ? "ring-4 ring-white ring-offset-2 ring-offset-background scale-110" : ""}
            `}
            whileHover={{ scale: currentNumber === num ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: num * 0.05 }}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
