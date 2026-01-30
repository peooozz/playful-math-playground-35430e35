import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnswerButton } from "./AnswerButton";
import { Celebration } from "./Celebration";
import { RefreshCw, ArrowRight } from "lucide-react";

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  emoji: string;
}

const emojis = ["🍎", "⭐", "🧸", "🎈", "🌸", "🍇", "🦋", "🌻", "🎁", "🍒"];

const generateProblem = (): Problem => {
  const num1 = Math.floor(Math.random() * 9) + 2; // 2-10
  const num2 = Math.floor(Math.random() * num1); // 0 to num1-1
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return { num1, num2, answer: num1 - num2, emoji };
};

const generateChoices = (answer: number): number[] => {
  const choices = new Set<number>([answer]);
  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2;
    const choice = Math.max(0, Math.min(10, answer + offset));
    if (choice !== answer) choices.add(choice);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
};

export const SubtractionModule = () => {
  const [problem, setProblem] = useState<Problem>(() => generateProblem());
  const [choices, setChoices] = useState<number[]>(() => generateChoices(problem.answer));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [removedItems, setRemovedItems] = useState<number[]>([]);

  const handleAnswer = useCallback((value: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(value);
    const correct = value === problem.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setShowCelebration(true);
      setScore(s => s + 1);
      // Play success sound
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+ZjX1wYWNvfoyWlpCEd2hhZXF+ipOTjoR4bGRkbn2Ij5CLgnVrZGRseIWNjomBdmxlZWt3g4qLhoB0a2VlanWAh4mFgHRrZWZqdoCGiIR/c2pmaGt1f4WHg35yamhpbHZ/g4SDfXFpZ2psdH2BgoF8cGlnanF3foGAfXBpZ2pwdXt+fnpvZ2Zpb3N5e3t4bmZmaG5xdnd3dG1mZWdsc3V2dnJtZmVnam9ydHRybGZlZ2ptcHJycmtlZGVoa25wb29qZWRkZmhqbW5tamVkZGVnaGprampnZGRkZWZnaGhoZ2VkZGRlZmZnZ2ZlZGRkZGVlZmVlZGRkZGRkZGRkZGRkZGRkZGRk");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 1500);
    }
  }, [problem.answer, selectedAnswer]);

  const nextProblem = useCallback(() => {
    const newProblem = generateProblem();
    setProblem(newProblem);
    setChoices(generateChoices(newProblem.answer));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTotalProblems(t => t + 1);
    setShowCelebration(false);
    setRemovedItems([]);
  }, []);

  const resetGame = useCallback(() => {
    nextProblem();
    setScore(0);
    setTotalProblems(0);
  }, [nextProblem]);

  // Handle item removal animation
  const handleRemoveItem = useCallback((idx: number) => {
    if (removedItems.length < problem.num2 && !removedItems.includes(idx)) {
      setRemovedItems(prev => [...prev, idx]);
    }
  }, [problem.num2, removedItems]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-rainbow mb-2">
          Subtraction Fun! ➖
        </h2>
        <p className="text-muted-foreground font-nunito">
          Tap objects to take them away, then find the answer
        </p>
      </div>

      {/* Score */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="bg-card px-4 py-2 rounded-xl shadow-md">
          <span className="font-fredoka text-foreground">
            ⭐ Score: {score}
          </span>
        </div>
        <div className="bg-card px-4 py-2 rounded-xl shadow-md">
          <span className="font-fredoka text-muted-foreground">
            Problems: {totalProblems + 1}
          </span>
        </div>
      </div>

      {/* Problem Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${problem.num1}-${problem.num2}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-card rounded-3xl p-6 md:p-8 shadow-card mb-6"
        >
          {/* Visual explanation */}
          <div className="text-center mb-4">
            <p className="text-lg font-nunito text-muted-foreground">
              We have {problem.num1} {problem.emoji}, take away {problem.num2}
            </p>
            {removedItems.length < problem.num2 && (
              <p className="text-sm text-primary font-nunito animate-pulse">
                👆 Tap {problem.num2 - removedItems.length} more to remove!
              </p>
            )}
          </div>

          {/* Visual objects */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="flex flex-wrap justify-center gap-2 p-4 bg-muted/30 rounded-2xl max-w-[300px]"
            >
              {Array.from({ length: problem.num1 }).map((_, idx) => {
                const isRemoved = removedItems.includes(idx);
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: isRemoved ? 0.3 : 1, 
                      scale: isRemoved ? 0.7 : 1,
                      y: isRemoved ? -20 : 0
                    }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleRemoveItem(idx)}
                    className={`text-3xl md:text-4xl transition-all ${
                      isRemoved 
                        ? "cursor-default line-through decoration-4 decoration-destructive" 
                        : "cursor-pointer hover:scale-110 active:scale-95"
                    }`}
                    disabled={isRemoved || removedItems.length >= problem.num2}
                    whileHover={!isRemoved && removedItems.length < problem.num2 ? { scale: 1.2 } : {}}
                    whileTap={!isRemoved && removedItems.length < problem.num2 ? { scale: 0.8 } : {}}
                  >
                    {problem.emoji}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Removed items indicator */}
          {removedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-center mb-4"
            >
              <p className="text-sm text-muted-foreground font-nunito">
                Removed: {removedItems.length} / {problem.num2}
              </p>
            </motion.div>
          )}

          {/* Equation display */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
            <span className="text-3xl md:text-4xl font-fredoka font-bold text-foreground">
              {problem.num1}
            </span>
            <span className="text-3xl md:text-4xl font-bold text-secondary">
              −
            </span>
            <span className="text-3xl md:text-4xl font-fredoka font-bold text-foreground">
              {problem.num2}
            </span>
            <span className="text-3xl md:text-4xl font-bold text-foreground">
              =
            </span>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-accent/30 border-4 border-dashed border-accent flex items-center justify-center">
              {selectedAnswer !== null ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl md:text-3xl font-fredoka font-bold"
                >
                  {selectedAnswer}
                </motion.span>
              ) : (
                <span className="text-xl text-muted-foreground">?</span>
              )}
            </div>
          </div>

          {/* Answer choices */}
          <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
            {choices.map((choice) => (
              <AnswerButton
                key={choice}
                value={choice}
                onClick={() => handleAnswer(choice)}
                isSelected={selectedAnswer === choice}
                isCorrect={selectedAnswer === choice ? isCorrect : null}
                disabled={selectedAnswer !== null}
                size="lg"
              />
            ))}
          </div>

          {/* Hint message */}
          <AnimatePresence>
            {showHint && isCorrect === false && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-4 text-lg font-nunito text-primary"
              >
                Count the remaining {problem.emoji}s! The answer is {problem.answer} 💪
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        {selectedAnswer !== null && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={nextProblem}
            className="flex items-center gap-2 px-6 py-3 bg-success text-white rounded-2xl font-fredoka font-bold shadow-lg touch-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
        
        <motion.button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-2xl font-fredoka shadow-md touch-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" /> Reset
        </motion.button>
      </div>

      <Celebration
        show={showCelebration}
        message="Correct!"
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
};
