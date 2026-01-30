import { motion } from "framer-motion";
import { useState } from "react";
import { WorksheetInput } from "./WorksheetInput";

interface MissingNumbersProps {
  sequence?: number[];
  missing?: number[];
  onAllCorrect?: () => void;
}

export const MissingNumbers = ({ 
  sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  missing = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  onAllCorrect 
}: MissingNumbersProps) => {
  const [correctCount, setCorrectCount] = useState(0);

  const handleCorrect = () => {
    const newCount = correctCount + 1;
    setCorrectCount(newCount);
    if (newCount === missing.length) {
      onAllCorrect?.();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
      {sequence.map((num, idx) => {
        const isMissing = missing.includes(num);
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            {isMissing ? (
              <WorksheetInput
                correctAnswer={num}
                onCorrect={handleCorrect}
                color="yellow"
                size="md"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-yellow-400 flex items-center justify-center font-fredoka font-bold text-xl text-white shadow-md">
                {num}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
