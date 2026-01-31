import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorksheetSection } from "../WorksheetSection";
import { Celebration } from "../../Celebration";

interface PatternProblem {
  sequence: string[];
  answer: string;
  options: string[];
}

const patternProblems: PatternProblem[] = [
  { sequence: ["🔴", "🔵", "🔴", "🔵", "🔴", "?"], answer: "🔵", options: ["🔴", "🔵", "🟢"] },
  { sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "?"], answer: "🌙", options: ["⭐", "🌙", "☀️"] },
  { sequence: ["🍎", "🍊", "🍎", "🍊", "?", "🍊"], answer: "🍎", options: ["🍎", "🍊", "🍋"] },
  { sequence: ["▲", "■", "●", "▲", "■", "?"], answer: "●", options: ["▲", "■", "●"] },
];

interface PatternWorksheetProps {
  worksheetIndex: number;
  onComplete: () => void;
}

export const PatternWorksheet = ({ worksheetIndex, onComplete }: PatternWorksheetProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  // Different problem sets for different worksheets
  const problemOffset = (worksheetIndex * 2) % patternProblems.length;
  const problems = [
    patternProblems[problemOffset],
    patternProblems[(problemOffset + 1) % patternProblems.length],
  ];

  const handleSelect = (problemIdx: number, option: string) => {
    const newAnswers = { ...answers, [problemIdx]: option };
    setAnswers(newAnswers);

    // Check if all correct
    const allCorrect = problems.every((p, idx) => newAnswers[idx] === p.answer);
    if (allCorrect) {
      setTimeout(() => {
        setShowCelebration(true);
        onComplete();
      }, 500);
    }
  };

  return (
    <WorksheetSection number={worksheetIndex + 1} title="Complete the Pattern!" color="blue">
      <div className="space-y-6">
        {problems.map((problem, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="bg-card rounded-2xl p-4 md:p-6 shadow-md"
          >
            {/* Pattern sequence */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-4">
              {problem.sequence.map((item, seqIdx) => (
                <motion.span
                  key={seqIdx}
                  className={`
                    text-3xl md:text-5xl
                    ${item === "?" ? "w-12 h-12 md:w-16 md:h-16 border-4 border-dashed border-primary rounded-xl flex items-center justify-center bg-primary/10" : ""}
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: seqIdx * 0.1 }}
                >
                  {item === "?" ? (
                    answers[idx] ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={answers[idx] === problem.answer ? "" : "opacity-50"}
                      >
                        {answers[idx]}
                      </motion.span>
                    ) : (
                      <span className="text-primary text-2xl">?</span>
                    )
                  ) : (
                    item
                  )}
                </motion.span>
              ))}
            </div>

            {/* Answer options */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <span className="font-nunito text-muted-foreground text-sm md:text-base">Choose:</span>
              {problem.options.map((option, optIdx) => {
                const isSelected = answers[idx] === option;
                const isCorrect = option === problem.answer;
                const showResult = isSelected;

                return (
                  <motion.button
                    key={optIdx}
                    onClick={() => handleSelect(idx, option)}
                    className={`
                      text-2xl md:text-4xl p-2 md:p-3 rounded-xl transition-all
                      ${showResult && isCorrect ? "bg-green-100 ring-4 ring-green-400" : ""}
                      ${showResult && !isCorrect ? "bg-red-100 ring-4 ring-red-300" : ""}
                      ${!showResult ? "bg-muted hover:bg-muted/80 hover:scale-110" : ""}
                    `}
                    whileHover={{ scale: isSelected ? 1 : 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <Celebration
        show={showCelebration}
        message="Pattern Master! 🎨"
        onComplete={() => setShowCelebration(false)}
      />
    </WorksheetSection>
  );
};
