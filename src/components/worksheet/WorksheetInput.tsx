import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface WorksheetInputProps {
  correctAnswer: string | number;
  onCorrect?: () => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  color?: "pink" | "yellow" | "green" | "blue";
}

export const WorksheetInput = ({
  correctAnswer,
  onCorrect,
  placeholder = "",
  size = "md",
  color = "pink"
}: WorksheetInputProps) => {
  const [value, setValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-xl",
    lg: "w-16 h-16 text-2xl"
  };

  const colorClasses = {
    pink: "border-pink-400 focus:border-pink-500",
    yellow: "border-yellow-400 focus:border-yellow-500",
    green: "border-green-400 focus:border-green-500",
    blue: "border-blue-400 focus:border-blue-500"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (newValue.trim() === String(correctAnswer).trim()) {
      setIsCorrect(true);
      onCorrect?.();
    } else if (newValue.length >= String(correctAnswer).length) {
      setIsCorrect(false);
    } else {
      setIsCorrect(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2 border-dashed rounded-lg
          text-center font-fredoka font-bold
          bg-white/80 backdrop-blur-sm
          outline-none transition-all
          ${isCorrect === true ? "bg-green-100 border-green-500 text-green-700" : ""}
          ${isCorrect === false ? "bg-red-100 border-red-400 animate-shake" : ""}
        `}
        maxLength={3}
      />
    </motion.div>
  );
};
