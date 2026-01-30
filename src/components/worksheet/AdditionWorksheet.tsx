import { motion } from "framer-motion";
import { useState } from "react";
import { WorksheetInput } from "./WorksheetInput";

interface AdditionProblem {
  num1: number;
  num2: number;
}

interface AdditionWorksheetProps {
  problems?: AdditionProblem[];
  onAllCorrect?: () => void;
}

const defaultProblems: AdditionProblem[] = [
  { num1: 5, num2: 3 },
  { num1: 4, num2: 4 },
  { num1: 7, num2: 2 },
  { num1: 6, num2: 1 },
  { num1: 3, num2: 5 },
  { num1: 2, num2: 8 }
];

export const AdditionWorksheet = ({ 
  problems = defaultProblems, 
  onAllCorrect 
}: AdditionWorksheetProps) => {
  const [correctCount, setCorrectCount] = useState(0);

  const handleCorrect = () => {
    const newCount = correctCount + 1;
    setCorrectCount(newCount);
    if (newCount === problems.length) {
      onAllCorrect?.();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {problems.map((problem, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-md border border-green-100"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-fredoka font-bold text-gray-700">
              {problem.num1}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-green-500">+</span>
              <span className="text-2xl md:text-3xl font-fredoka font-bold text-gray-700">
                {problem.num2}
              </span>
            </div>
            <div className="w-full h-0.5 bg-green-300 my-2" />
            <WorksheetInput
              correctAnswer={problem.num1 + problem.num2}
              onCorrect={handleCorrect}
              color="green"
              size="md"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
