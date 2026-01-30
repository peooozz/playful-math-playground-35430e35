import { motion } from "framer-motion";
import { useState } from "react";

interface CompareProblem {
  num1: number;
  num2: number;
}

interface CompareNumbersProps {
  problems?: CompareProblem[];
  onAllCorrect?: () => void;
}

const defaultProblems: CompareProblem[] = [
  { num1: 15, num2: 12 },
  { num1: 8, num2: 18 },
  { num1: 20, num2: 20 },
  { num1: 11, num2: 9 },
  { num1: 14, num2: 17 },
  { num1: 13, num2: 13 }
];

export const CompareNumbers = ({ 
  problems = defaultProblems, 
  onAllCorrect 
}: CompareNumbersProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());

  const getCorrectAnswer = (num1: number, num2: number): string => {
    if (num1 > num2) return ">";
    if (num1 < num2) return "<";
    return "=";
  };

  const handleSelect = (idx: number, symbol: string) => {
    if (correctAnswers.has(idx)) return;
    
    const correct = getCorrectAnswer(problems[idx].num1, problems[idx].num2);
    setAnswers(prev => ({ ...prev, [idx]: symbol }));
    
    if (symbol === correct) {
      const newCorrect = new Set(correctAnswers);
      newCorrect.add(idx);
      setCorrectAnswers(newCorrect);
      
      if (newCorrect.size === problems.length) {
        onAllCorrect?.();
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {problems.map((problem, idx) => {
        const isCorrect = correctAnswers.has(idx);
        const selectedAnswer = answers[idx];
        const correctAnswer = getCorrectAnswer(problem.num1, problem.num2);
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-2xl p-4 shadow-md border-2 transition-colors ${
              isCorrect ? "border-green-400 bg-green-50" : "border-blue-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl md:text-3xl font-fredoka font-bold text-gray-700">
                {problem.num1}
              </span>
              
              {/* Answer button or display */}
              {isCorrect ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-xl"
                >
                  {correctAnswer}
                </motion.span>
              ) : selectedAnswer && selectedAnswer !== correctAnswer ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                  className="w-10 h-10 rounded-lg bg-red-400 flex items-center justify-center text-white font-bold text-xl"
                >
                  {selectedAnswer}
                </motion.span>
              ) : (
                <span className="text-2xl text-blue-400 font-bold">?</span>
              )}
              
              <span className="text-2xl md:text-3xl font-fredoka font-bold text-gray-700">
                {problem.num2}
              </span>
            </div>
            
            {/* Symbol buttons */}
            {!isCorrect && (
              <div className="flex justify-center gap-2">
                {[">", "<", "="].map((symbol) => (
                  <motion.button
                    key={symbol}
                    onClick={() => handleSelect(idx, symbol)}
                    className={`w-10 h-10 rounded-lg font-bold text-lg transition-all
                      ${selectedAnswer === symbol && selectedAnswer !== correctAnswer
                        ? "bg-red-100 text-red-500 border-2 border-red-300"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95"
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {symbol}
                  </motion.button>
                ))}
              </div>
            )}
            
            {isCorrect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-green-600 text-sm font-nunito"
              >
                ✓ Correct!
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
