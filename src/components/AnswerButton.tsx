import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnswerButtonProps {
  value: number;
  onClick: () => void;
  isSelected?: boolean;
  isCorrect?: boolean | null;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
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
];

export const AnswerButton = ({ 
  value, 
  onClick, 
  isSelected, 
  isCorrect, 
  disabled,
  size = "md" 
}: AnswerButtonProps) => {
  const colorClass = colors[value % colors.length];
  
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-14 h-14 md:w-16 md:h-16 text-2xl md:text-3xl",
    lg: "w-16 h-16 md:w-20 md:h-20 text-3xl md:text-4xl",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-2xl font-fredoka font-bold text-white",
        "shadow-lg transition-all no-select touch-button",
        "flex items-center justify-center",
        sizeClasses[size],
        colorClass,
        isSelected && "ring-4 ring-white ring-offset-2 ring-offset-background",
        isCorrect === true && "bg-success animate-bounce",
        isCorrect === false && isSelected && "opacity-50 shake",
        disabled && "cursor-not-allowed opacity-70"
      )}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isCorrect === true ? { scale: [1, 1.2, 1] } : {}}
    >
      {value}
    </motion.button>
  );
};
