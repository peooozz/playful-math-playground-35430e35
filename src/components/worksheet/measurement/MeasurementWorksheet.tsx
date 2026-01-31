import { useState } from "react";
import { motion } from "framer-motion";
import { WorksheetSection } from "../WorksheetSection";
import { Celebration } from "../../Celebration";

interface MeasurementProblem {
  type: "compare" | "order";
  items: { emoji: string; height: number; label: string }[];
  question: string;
  answer: string;
}

const measurementProblems: MeasurementProblem[] = [
  {
    type: "compare",
    items: [
      { emoji: "🌲", height: 80, label: "Tree" },
      { emoji: "🌸", height: 30, label: "Flower" },
    ],
    question: "Which is TALLER?",
    answer: "Tree",
  },
  {
    type: "compare",
    items: [
      { emoji: "🐘", height: 70, label: "Elephant" },
      { emoji: "🐁", height: 20, label: "Mouse" },
    ],
    question: "Which is SHORTER?",
    answer: "Mouse",
  },
  {
    type: "order",
    items: [
      { emoji: "🏠", height: 60, label: "House" },
      { emoji: "🏢", height: 90, label: "Building" },
      { emoji: "🏕️", height: 40, label: "Tent" },
    ],
    question: "Order from SHORTEST to TALLEST",
    answer: "Tent,House,Building",
  },
  {
    type: "compare",
    items: [
      { emoji: "✏️", height: 50, label: "Pencil" },
      { emoji: "📏", height: 70, label: "Ruler" },
    ],
    question: "Which is LONGER?",
    answer: "Ruler",
  },
];

interface MeasurementWorksheetProps {
  worksheetIndex: number;
  onComplete: () => void;
}

export const MeasurementWorksheet = ({ worksheetIndex, onComplete }: MeasurementWorksheetProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const problemIdx = worksheetIndex % measurementProblems.length;
  const problem = measurementProblems[problemIdx];

  const handleCompareSelect = (label: string) => {
    setSelectedAnswers({ 0: label });
    if (label === problem.answer) {
      setTimeout(() => {
        setShowCelebration(true);
        onComplete();
      }, 500);
    }
  };

  const handleOrderSelect = (label: string) => {
    if (orderedItems.includes(label)) {
      setOrderedItems(orderedItems.filter((l) => l !== label));
    } else {
      const newOrder = [...orderedItems, label];
      setOrderedItems(newOrder);

      if (newOrder.length === problem.items.length) {
        if (newOrder.join(",") === problem.answer) {
          setTimeout(() => {
            setShowCelebration(true);
            onComplete();
          }, 500);
        }
      }
    }
  };

  const getOrderNumber = (label: string) => {
    const idx = orderedItems.indexOf(label);
    return idx >= 0 ? idx + 1 : null;
  };

  return (
    <WorksheetSection number={worksheetIndex + 1} title={problem.question} color="green">
      <div className="flex flex-wrap items-end justify-center gap-6 md:gap-10 py-6">
        {problem.items.map((item, idx) => {
          const isSelected = selectedAnswers[0] === item.label;
          const isCorrect = item.label === problem.answer;
          const orderNum = problem.type === "order" ? getOrderNumber(item.label) : null;

          return (
            <motion.button
              key={idx}
              onClick={() =>
                problem.type === "compare"
                  ? handleCompareSelect(item.label)
                  : handleOrderSelect(item.label)
              }
              className={`
                relative flex flex-col items-center p-4 rounded-2xl transition-all
                ${isSelected && isCorrect ? "bg-green-100 ring-4 ring-green-400" : ""}
                ${isSelected && !isCorrect ? "bg-red-100 ring-4 ring-red-300 animate-shake" : ""}
                ${orderNum ? "bg-primary/20 ring-2 ring-primary" : ""}
                ${!isSelected && !orderNum ? "bg-card hover:bg-muted" : ""}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
            >
              {/* Order number badge */}
              {orderNum && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-fredoka font-bold shadow-lg"
                >
                  {orderNum}
                </motion.div>
              )}

              {/* Visual height representation */}
              <div
                className="flex items-end justify-center mb-2"
                style={{ height: `${item.height}px` }}
              >
                <motion.span
                  className="text-4xl md:text-6xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                >
                  {item.emoji}
                </motion.span>
              </div>

              {/* Label */}
              <span className="font-nunito font-semibold text-foreground text-sm md:text-base">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Order display for ordering problems */}
      {problem.type === "order" && orderedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted rounded-xl"
        >
          <span className="font-nunito text-muted-foreground">Your order:</span>
          {orderedItems.map((label, idx) => (
            <span key={idx} className="font-fredoka text-primary">
              {idx > 0 && " → "}
              {label}
            </span>
          ))}
        </motion.div>
      )}

      {/* Reset button for ordering */}
      {problem.type === "order" && orderedItems.length > 0 && (
        <motion.button
          onClick={() => setOrderedItems([])}
          className="mx-auto mt-4 block px-4 py-2 bg-muted rounded-xl font-nunito text-muted-foreground hover:bg-muted/80"
          whileTap={{ scale: 0.95 }}
        >
          🔄 Reset Order
        </motion.button>
      )}

      <Celebration
        show={showCelebration}
        message="Great Measuring! 📏"
        onComplete={() => setShowCelebration(false)}
      />
    </WorksheetSection>
  );
};
