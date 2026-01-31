import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, RefreshCw, Trophy } from "lucide-react";
import { WorksheetCategoryDropdown, type WorksheetCategory } from "./WorksheetCategoryDropdown";
import { WorksheetNavigation } from "./WorksheetNavigation";
import { NumberTracingWorksheet } from "./numbers/NumberTracingWorksheet";
import { PatternWorksheet } from "./patterns/PatternWorksheet";
import { MeasurementWorksheet } from "./measurement/MeasurementWorksheet";
import { MoneyWorksheet } from "./money/MoneyWorksheet";
import { CountAndWrite } from "./CountAndWrite";
import { MissingNumbers } from "./MissingNumbers";
import { AdditionWorksheet } from "./AdditionWorksheet";
import { CompareNumbers } from "./CompareNumbers";
import { WorksheetSection } from "./WorksheetSection";
import { Celebration } from "../Celebration";

// Worksheet counts per category
const worksheetCounts: Record<WorksheetCategory, number> = {
  "numbers-counting": 6,
  "patterns": 4,
  "measurement": 4,
  "money": 4,
};

// Slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export const WorksheetModule = () => {
  const [category, setCategory] = useState<WorksheetCategory>("numbers-counting");
  const [worksheetIndex, setWorksheetIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [completedWorksheets, setCompletedWorksheets] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const totalWorksheets = worksheetCounts[category];

  const handleCategoryChange = (newCategory: WorksheetCategory) => {
    setCategory(newCategory);
    setWorksheetIndex(0);
    setDirection(0);
  };

  const handlePrevious = () => {
    if (worksheetIndex > 0) {
      setDirection(-1);
      setWorksheetIndex(worksheetIndex - 1);
    }
  };

  const handleNext = () => {
    if (worksheetIndex < totalWorksheets - 1) {
      setDirection(1);
      setWorksheetIndex(worksheetIndex + 1);
    }
  };

  const handleWorksheetComplete = useCallback(() => {
    const key = `${category}-${worksheetIndex}`;
    setCompletedWorksheets((prev) => {
      const newSet = new Set(prev);
      newSet.add(key);
      return newSet;
    });
  }, [category, worksheetIndex]);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setCompletedWorksheets(new Set());
    setWorksheetIndex(0);
  };

  // Render worksheet based on category and index
  const renderWorksheet = () => {
    const key = `${category}-${worksheetIndex}`;

    switch (category) {
      case "numbers-counting":
        // Mix of tracing and counting worksheets
        if (worksheetIndex < 3) {
          return <NumberTracingWorksheet worksheetIndex={worksheetIndex} onComplete={handleWorksheetComplete} />;
        } else if (worksheetIndex === 3) {
          return (
            <WorksheetSection number={4} title="Count and write the number!" color="pink">
              <CountAndWrite
                items={[
                  { emoji: "⭐", count: 8 },
                  { emoji: "🍎", count: 12 },
                  { emoji: "💗", count: 15 },
                  { emoji: "🦋", count: 10 },
                ]}
                onAllCorrect={handleWorksheetComplete}
              />
            </WorksheetSection>
          );
        } else if (worksheetIndex === 4) {
          return (
            <WorksheetSection number={5} title="Fill in the missing numbers!" color="yellow">
              <MissingNumbers
                sequence={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                missing={[2, 4, 6, 8, 10]}
                onAllCorrect={handleWorksheetComplete}
              />
            </WorksheetSection>
          );
        } else {
          return (
            <WorksheetSection number={6} title="Add the numbers!" color="green">
              <AdditionWorksheet
                problems={[
                  { num1: 3, num2: 2 },
                  { num1: 4, num2: 3 },
                  { num1: 5, num2: 4 },
                  { num1: 2, num2: 6 },
                ]}
                onAllCorrect={handleWorksheetComplete}
              />
            </WorksheetSection>
          );
        }

      case "patterns":
        return <PatternWorksheet worksheetIndex={worksheetIndex} onComplete={handleWorksheetComplete} />;

      case "measurement":
        return <MeasurementWorksheet worksheetIndex={worksheetIndex} onComplete={handleWorksheetComplete} />;

      case "money":
        return <MoneyWorksheet worksheetIndex={worksheetIndex} onComplete={handleWorksheetComplete} />;

      default:
        return null;
    }
  };

  // Calculate category progress
  const categoryCompleted = Array.from(completedWorksheets).filter((k) =>
    k.startsWith(category)
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl md:text-5xl font-fredoka font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2">
          MATHS MAGIC! ✨
        </h1>
        <p className="text-lg text-muted-foreground font-nunito">Interactive Worksheets</p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm font-nunito text-muted-foreground">Progress:</span>
          <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(categoryCompleted / totalWorksheets) * 100}%` }}
            />
          </div>
          <span className="text-sm font-fredoka">
            {categoryCompleted}/{totalWorksheets}
          </span>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-4 print:hidden">
        <motion.button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-fredoka shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Printer className="w-4 h-4" />
          Print
        </motion.button>
        <motion.button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-fredoka shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>

      {/* Category dropdown */}
      <WorksheetCategoryDropdown value={category} onChange={handleCategoryChange} />

      {/* Navigation arrows */}
      <WorksheetNavigation
        currentIndex={worksheetIndex}
        totalCount={totalWorksheets}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* Worksheet content with slide animation */}
      <div className="relative min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${category}-${worksheetIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {renderWorksheet()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* All complete badge */}
      {categoryCompleted === totalWorksheets && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-fredoka print:hidden z-50"
        >
          <Trophy className="w-6 h-6" />
          Category Complete! 🎉
        </motion.div>
      )}

      <Celebration
        show={showCelebration}
        message="Amazing Work! 🏆"
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
};
