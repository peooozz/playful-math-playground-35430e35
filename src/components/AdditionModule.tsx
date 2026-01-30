import { useState, useCallback, useMemo } from "react";
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
  const num1 = Math.floor(Math.random() * 6); // 0-5
  const num2 = Math.floor(Math.random() * (6 - num1)) + (num1 === 0 ? 1 : 0); // ensure sum <= 10
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return { num1, num2, answer: num1 + num2, emoji };
};

const generateChoices = (answer: number): number[] => {
  const choices = new Set<number>([answer]);
  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const choice = Math.max(0, Math.min(10, answer + offset));
    if (choice !== answer) choices.add(choice);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
};

export const AdditionModule = () => {
  const [problem, setProblem] = useState<Problem>(() => generateProblem());
  const [choices, setChoices] = useState<number[]>(() => generateChoices(problem.answer));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [showHint, setShowHint] = useState(false);

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
      // Play soft hint sound
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
  }, []);

  const resetGame = useCallback(() => {
    nextProblem();
    setScore(0);
    setTotalProblems(0);
  }, [nextProblem]);

  // Render objects for visualization
  const renderObjects = (count: number, emoji: string) => {
    return Array.from({ length: count }).map((_, idx) => (
      <motion.span
        key={idx}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.1 }}
        className="text-3xl md:text-4xl"
      >
        {emoji}
      </motion.span>
    ));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-rainbow mb-2">
          Addition Fun! ➕
        </h2>
        <p className="text-muted-foreground font-nunito">
          Count the objects and find the answer
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
          {/* Visual objects */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
            {/* First group */}
            <motion.div 
              className="flex flex-wrap justify-center gap-2 p-4 bg-muted/30 rounded-2xl min-w-[100px]"
              animate={showHint ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {renderObjects(problem.num1, problem.emoji)}
              {problem.num1 === 0 && (
                <span className="text-2xl text-muted-foreground">—</span>
              )}
            </motion.div>

            {/* Plus sign */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-primary"
            >
              +
            </motion.div>

            {/* Second group */}
            <motion.div 
              className="flex flex-wrap justify-center gap-2 p-4 bg-muted/30 rounded-2xl min-w-[100px]"
              animate={showHint ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {renderObjects(problem.num2, problem.emoji)}
              {problem.num2 === 0 && (
                <span className="text-2xl text-muted-foreground">—</span>
              )}
            </motion.div>

            {/* Equals */}
            <div className="text-4xl md:text-5xl font-bold text-foreground">
              =
            </div>

            {/* Answer placeholder */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/30 border-4 border-dashed border-accent flex items-center justify-center">
              {selectedAnswer !== null ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-3xl md:text-4xl font-fredoka font-bold"
                >
                  {selectedAnswer}
                </motion.span>
              ) : (
                <span className="text-2xl text-muted-foreground">?</span>
              )}
            </div>
          </div>

          {/* Equation text */}
          <p className="text-center text-2xl md:text-3xl font-fredoka text-foreground mb-6">
            {problem.num1} + {problem.num2} = ?
          </p>

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
                Count all the {problem.emoji}s again! The answer is {problem.answer} 💪
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
