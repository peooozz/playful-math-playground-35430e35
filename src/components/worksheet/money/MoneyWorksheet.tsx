import { useState } from "react";
import { motion } from "framer-motion";
import { WorksheetSection } from "../WorksheetSection";
import { Celebration } from "../../Celebration";

interface CoinProblem {
  coins: { emoji: string; value: number; label: string }[];
  question: string;
  answer: number;
  options: number[];
}

const coinProblems: CoinProblem[] = [
  {
    coins: [
      { emoji: "🪙", value: 1, label: "1¢" },
      { emoji: "🪙", value: 1, label: "1¢" },
      { emoji: "🪙", value: 1, label: "1¢" },
    ],
    question: "Count the pennies!",
    answer: 3,
    options: [2, 3, 4],
  },
  {
    coins: [
      { emoji: "💰", value: 5, label: "5¢" },
      { emoji: "🪙", value: 1, label: "1¢" },
    ],
    question: "How many cents in total?",
    answer: 6,
    options: [5, 6, 7],
  },
  {
    coins: [
      { emoji: "💰", value: 5, label: "5¢" },
      { emoji: "💰", value: 5, label: "5¢" },
    ],
    question: "Count the nickels!",
    answer: 10,
    options: [5, 10, 15],
  },
  {
    coins: [
      { emoji: "🥇", value: 10, label: "10¢" },
      { emoji: "🪙", value: 1, label: "1¢" },
      { emoji: "🪙", value: 1, label: "1¢" },
    ],
    question: "How many cents altogether?",
    answer: 12,
    options: [10, 11, 12],
  },
];

interface MoneyWorksheetProps {
  worksheetIndex: number;
  onComplete: () => void;
}

export const MoneyWorksheet = ({ worksheetIndex, onComplete }: MoneyWorksheetProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const problemIdx = worksheetIndex % coinProblems.length;
  const problem = coinProblems[problemIdx];

  const handleSelect = (value: number) => {
    setSelectedAnswer(value);
    if (value === problem.answer) {
      setTimeout(() => {
        setShowCelebration(true);
        onComplete();
      }, 500);
    }
  };

  return (
    <WorksheetSection number={worksheetIndex + 1} title={problem.question} color="yellow">
      {/* Coins display */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-6 mb-4">
        {problem.coins.map((coin, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: idx * 0.15, type: "spring" }}
          >
            <motion.span
              className="text-5xl md:text-7xl drop-shadow-lg"
              animate={{
                y: [0, -8, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: idx * 0.2,
              }}
            >
              {coin.emoji}
            </motion.span>
            <span className="mt-2 font-fredoka text-lg md:text-xl text-muted-foreground">
              {coin.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Total indicator */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-nunito text-muted-foreground">Total = </span>
        <span className="font-fredoka text-2xl text-primary">
          {selectedAnswer !== null ? `${selectedAnswer}¢` : "?¢"}
        </span>
      </motion.div>

      {/* Answer options */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {problem.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === problem.answer;

          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(option)}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-2xl font-fredoka text-xl md:text-2xl
                shadow-lg transition-all
                ${isSelected && isCorrect ? "bg-green-400 text-white ring-4 ring-green-300" : ""}
                ${isSelected && !isCorrect ? "bg-red-400 text-white ring-4 ring-red-300 animate-shake" : ""}
                ${!isSelected ? "bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/10" : ""}
              `}
              whileHover={{ scale: isSelected ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              {option}¢
            </motion.button>
          );
        })}
      </div>

      <Celebration
        show={showCelebration}
        message="Money Expert! 💰"
        onComplete={() => setShowCelebration(false)}
      />
    </WorksheetSection>
  );
};
