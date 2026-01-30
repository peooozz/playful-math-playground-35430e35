import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { numberData, getNumberData } from "@/data/numberPaths";
import { TracingCanvas } from "./TracingCanvas";
import { PracticeGrid } from "./PracticeGrid";
import { NumberSelector } from "./NumberSelector";
import { Celebration } from "./Celebration";

export const NumbersModule = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [tracingProgress, setTracingProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());

  const currentData = getNumberData(currentNumber);

  const handleComplete = useCallback(() => {
    if (!completedNumbers.has(currentNumber)) {
      setShowCelebration(true);
      setCompletedNumbers(prev => new Set([...prev, currentNumber]));
      
      // Play success sound
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+ZjX1wYWNvfoyWlpCEd2hhZXF+ipOTjoR4bGRkbn2Ij5CLgnVrZGRseIWNjomBdmxlZWt3g4qLhoB0a2VlanWAh4mFgHRrZWZqdoCGiIR/c2pmaGt1f4WHg35yamhpbHZ/g4SDfXFpZ2psdH2BgoF8cGlnanF3foGAfXBpZ2pwdXt+fnpvZ2Zpb3N5e3t4bmZmaG5xdnd3dG1mZWdsc3V2dnJtZmVnam9ydHRybGZlZ2ptcHJycmtlZGVoa25wb29qZWRkZmhqbW5tamVkZGVnaGprampnZGRkZWZnaGhoZ2VkZGRlZmZnZ2ZlZGRkZGVlZmVlZGRkZGRkZGRkZGRkZGRkZGRk");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [currentNumber, completedNumbers]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const goToNextNumber = useCallback(() => {
    if (currentNumber < 10) {
      setCurrentNumber(currentNumber + 1);
      setTracingProgress(0);
    }
  }, [currentNumber]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Number Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <NumberSelector
          currentNumber={currentNumber}
          onNumberChange={(num) => {
            setCurrentNumber(num);
            setTracingProgress(0);
          }}
        />
      </motion.div>

      {/* Number Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNumber}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="mb-6"
        >
          {/* Number name and objects */}
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-rainbow mb-2">
              {currentData.name}
            </h2>
            
            {/* Countable objects */}
            {currentData.objects.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
                {currentData.objects.map((obj, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-3xl md:text-4xl"
                  >
                    {obj}
                  </motion.span>
                ))}
              </div>
            )}
            
            {currentData.objects.length > 0 && (
              <p className="text-lg md:text-xl text-muted-foreground mt-2 font-nunito">
                Count: {currentData.objects.length} {currentData.objectName}
              </p>
            )}
          </div>

          {/* Tracing Canvas */}
          <TracingCanvas
            numberData={currentData}
            onComplete={handleComplete}
            onProgress={setTracingProgress}
          />

          {/* Practice Grid */}
          <div className="mt-8">
            <PracticeGrid numberData={currentData} />
          </div>

          {/* Next Number Button */}
          {completedNumbers.has(currentNumber) && currentNumber < 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <motion.button
                onClick={goToNextNumber}
                className="px-8 py-3 bg-success text-white rounded-2xl font-fredoka font-bold text-lg shadow-lg touch-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Number →
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress tracker */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground font-nunito">
          Numbers completed: {completedNumbers.size} / 11
        </p>
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: 11 }).map((_, num) => (
            <div
              key={num}
              className={`w-3 h-3 rounded-full transition-colors ${
                completedNumbers.has(num) ? "bg-success" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <Celebration
        show={showCelebration}
        message="You traced it!"
        onComplete={handleCelebrationComplete}
      />
    </div>
  );
};
