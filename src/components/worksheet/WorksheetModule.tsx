import { useState } from "react";
import { motion } from "framer-motion";
import { Printer, RefreshCw, Trophy } from "lucide-react";
import { WorksheetCategoryDropdown, type WorksheetCategory } from "./WorksheetCategoryDropdown";
import { WorksheetSection } from "./WorksheetSection";
import { CountAndWrite } from "./CountAndWrite";
import { MissingNumbers } from "./MissingNumbers";
import { AdditionWorksheet } from "./AdditionWorksheet";
import { CompareNumbers } from "./CompareNumbers";
import { Celebration } from "../Celebration";

// Pattern problem component
const PatternProblem = ({ 
  sequence, 
  answer, 
  options, 
  onCorrect 
}: { 
  sequence: string[]; 
  answer: string; 
  options: string[]; 
  onCorrect: () => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === answer) {
      onCorrect();
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-md">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-4">
        {sequence.map((item, idx) => (
          <motion.span
            key={idx}
            className={`text-2xl md:text-4xl ${item === "?" ? "w-10 h-10 md:w-14 md:h-14 border-3 border-dashed border-primary rounded-xl flex items-center justify-center bg-primary/10" : ""}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            {item === "?" ? (
              selected ? (
                <span className={selected === answer ? "" : "opacity-50"}>{selected}</span>
              ) : (
                <span className="text-primary text-xl">?</span>
              )
            ) : item}
          </motion.span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {options.map((option, idx) => {
          const isSelected = selected === option;
          const isCorrect = option === answer;
          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(option)}
              className={`text-xl md:text-3xl p-2 rounded-xl transition-all
                ${isSelected && isCorrect ? "bg-green-100 ring-3 ring-green-400" : ""}
                ${isSelected && !isCorrect ? "bg-red-100 ring-3 ring-red-300" : ""}
                ${!isSelected ? "bg-muted hover:bg-muted/80" : ""}
              `}
              whileHover={{ scale: isSelected ? 1 : 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Measurement compare component
const MeasurementCompare = ({
  items,
  question,
  answer,
  onCorrect,
}: {
  items: { emoji: string; height: number; label: string }[];
  question: string;
  answer: string;
  onCorrect: () => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (label: string) => {
    setSelected(label);
    if (label === answer) {
      onCorrect();
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-md">
      <p className="text-center font-nunito text-muted-foreground mb-4">{question}</p>
      <div className="flex items-end justify-center gap-6 md:gap-10">
        {items.map((item, idx) => {
          const isSelected = selected === item.label;
          const isCorrect = item.label === answer;
          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(item.label)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all
                ${isSelected && isCorrect ? "bg-green-100 ring-3 ring-green-400" : ""}
                ${isSelected && !isCorrect ? "bg-red-100 ring-3 ring-red-300 animate-shake" : ""}
                ${!isSelected ? "bg-muted hover:bg-muted/80" : ""}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ height: `${item.height}px` }} className="flex items-end">
                <span className="text-3xl md:text-5xl">{item.emoji}</span>
              </div>
              <span className="mt-2 font-nunito text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Money counting component
const MoneyCounting = ({
  coins,
  answer,
  options,
  onCorrect,
}: {
  coins: { emoji: string; label: string }[];
  answer: number;
  options: number[];
  onCorrect: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelected(value);
    if (value === answer) {
      onCorrect();
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-md">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-4">
        {coins.map((coin, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <span className="text-4xl md:text-5xl">{coin.emoji}</span>
            <span className="text-xs font-fredoka text-muted-foreground">{coin.label}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <span className="font-nunito text-muted-foreground">Total:</span>
        {options.map((option, idx) => {
          const isSelected = selected === option;
          const isCorrect = option === answer;
          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(option)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl font-fredoka text-lg shadow-md
                ${isSelected && isCorrect ? "bg-green-400 text-white" : ""}
                ${isSelected && !isCorrect ? "bg-red-400 text-white animate-shake" : ""}
                ${!isSelected ? "bg-muted hover:bg-primary/20" : ""}
              `}
              whileHover={{ scale: isSelected ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}¢
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const WorksheetModule = () => {
  const [category, setCategory] = useState<WorksheetCategory>("numbers-counting");
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSectionComplete = (section: string) => {
    const key = `${category}-${section}`;
    const newCompleted = new Set(completedSections);
    newCompleted.add(key);
    setCompletedSections(newCompleted);

    // Check if all 4 sections in category are complete
    const categoryCompleted = [1, 2, 3, 4].every((s) => newCompleted.has(`${category}-${s}`));
    if (categoryCompleted) {
      setShowCelebration(true);
    }
  };

  const handleCategoryChange = (newCategory: WorksheetCategory) => {
    setCategory(newCategory);
  };

  const handlePrint = () => window.print();
  const handleReset = () => {
    setCompletedSections(new Set());
  };

  const getCategoryProgress = () => {
    return [1, 2, 3, 4].filter((s) => completedSections.has(`${category}-${s}`)).length;
  };

  // Render worksheets based on category
  const renderWorksheets = () => {
    switch (category) {
      case "numbers-counting":
        return (
          <>
            <WorksheetSection number={1} title="Count and write the number!" color="pink">
              <CountAndWrite
                items={[
                  { emoji: "⭐", count: 12 },
                  { emoji: "🍎", count: 16 },
                  { emoji: "💗", count: 18 },
                  { emoji: "😊", count: 20 },
                ]}
                onAllCorrect={() => handleSectionComplete("1")}
              />
            </WorksheetSection>

            <WorksheetSection number={2} title="Fill in the missing numbers!" color="yellow">
              <MissingNumbers
                sequence={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
                missing={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
                onAllCorrect={() => handleSectionComplete("2")}
              />
            </WorksheetSection>

            <WorksheetSection number={3} title="Add the numbers!" color="green">
              <AdditionWorksheet
                problems={[
                  { num1: 5, num2: 3 },
                  { num1: 4, num2: 4 },
                  { num1: 7, num2: 2 },
                  { num1: 6, num2: 1 },
                  { num1: 3, num2: 5 },
                  { num1: 2, num2: 8 },
                ]}
                onAllCorrect={() => handleSectionComplete("3")}
              />
            </WorksheetSection>

            <WorksheetSection number={4} title="Compare: Use >, <, or =" color="blue">
              <CompareNumbers
                problems={[
                  { num1: 15, num2: 12 },
                  { num1: 8, num2: 18 },
                  { num1: 20, num2: 20 },
                  { num1: 11, num2: 9 },
                  { num1: 14, num2: 17 },
                  { num1: 13, num2: 13 },
                ]}
                onAllCorrect={() => handleSectionComplete("4")}
              />
            </WorksheetSection>
          </>
        );

      case "patterns":
        return (
          <>
            <WorksheetSection number={1} title="Complete the pattern!" color="blue">
              <div className="space-y-4">
                <PatternProblem
                  sequence={["🔴", "🔵", "🔴", "🔵", "🔴", "?"]}
                  answer="🔵"
                  options={["🔴", "🔵", "🟢"]}
                  onCorrect={() => handleSectionComplete("1")}
                />
              </div>
            </WorksheetSection>

            <WorksheetSection number={2} title="What comes next?" color="pink">
              <div className="space-y-4">
                <PatternProblem
                  sequence={["⭐", "⭐", "🌙", "⭐", "⭐", "?"]}
                  answer="🌙"
                  options={["⭐", "🌙", "☀️"]}
                  onCorrect={() => handleSectionComplete("2")}
                />
              </div>
            </WorksheetSection>

            <WorksheetSection number={3} title="Find the missing shape!" color="yellow">
              <div className="space-y-4">
                <PatternProblem
                  sequence={["▲", "■", "●", "▲", "■", "?"]}
                  answer="●"
                  options={["▲", "■", "●"]}
                  onCorrect={() => handleSectionComplete("3")}
                />
              </div>
            </WorksheetSection>

            <WorksheetSection number={4} title="Continue the sequence!" color="green">
              <div className="space-y-4">
                <PatternProblem
                  sequence={["🍎", "🍊", "🍎", "🍊", "?", "🍊"]}
                  answer="🍎"
                  options={["🍎", "🍊", "🍋"]}
                  onCorrect={() => handleSectionComplete("4")}
                />
              </div>
            </WorksheetSection>
          </>
        );

      case "measurement":
        return (
          <>
            <WorksheetSection number={1} title="Which is TALLER?" color="green">
              <MeasurementCompare
                items={[
                  { emoji: "🌲", height: 80, label: "Tree" },
                  { emoji: "🌸", height: 30, label: "Flower" },
                ]}
                question="Click the taller one!"
                answer="Tree"
                onCorrect={() => handleSectionComplete("1")}
              />
            </WorksheetSection>

            <WorksheetSection number={2} title="Which is SHORTER?" color="blue">
              <MeasurementCompare
                items={[
                  { emoji: "🐘", height: 70, label: "Elephant" },
                  { emoji: "🐁", height: 20, label: "Mouse" },
                ]}
                question="Click the shorter one!"
                answer="Mouse"
                onCorrect={() => handleSectionComplete("2")}
              />
            </WorksheetSection>

            <WorksheetSection number={3} title="Which is LONGER?" color="yellow">
              <MeasurementCompare
                items={[
                  { emoji: "✏️", height: 40, label: "Pencil" },
                  { emoji: "📏", height: 70, label: "Ruler" },
                ]}
                question="Click the longer one!"
                answer="Ruler"
                onCorrect={() => handleSectionComplete("3")}
              />
            </WorksheetSection>

            <WorksheetSection number={4} title="Which is BIGGER?" color="pink">
              <MeasurementCompare
                items={[
                  { emoji: "🏠", height: 50, label: "House" },
                  { emoji: "🏢", height: 85, label: "Building" },
                ]}
                question="Click the bigger one!"
                answer="Building"
                onCorrect={() => handleSectionComplete("4")}
              />
            </WorksheetSection>
          </>
        );

      case "money":
        return (
          <>
            <WorksheetSection number={1} title="Count the pennies!" color="yellow">
              <MoneyCounting
                coins={[
                  { emoji: "🪙", label: "1¢" },
                  { emoji: "🪙", label: "1¢" },
                  { emoji: "🪙", label: "1¢" },
                ]}
                answer={3}
                options={[2, 3, 4]}
                onCorrect={() => handleSectionComplete("1")}
              />
            </WorksheetSection>

            <WorksheetSection number={2} title="How many cents?" color="green">
              <MoneyCounting
                coins={[
                  { emoji: "💰", label: "5¢" },
                  { emoji: "🪙", label: "1¢" },
                ]}
                answer={6}
                options={[5, 6, 7]}
                onCorrect={() => handleSectionComplete("2")}
              />
            </WorksheetSection>

            <WorksheetSection number={3} title="Count the nickels!" color="blue">
              <MoneyCounting
                coins={[
                  { emoji: "💰", label: "5¢" },
                  { emoji: "💰", label: "5¢" },
                ]}
                answer={10}
                options={[5, 10, 15]}
                onCorrect={() => handleSectionComplete("3")}
              />
            </WorksheetSection>

            <WorksheetSection number={4} title="Add the coins!" color="pink">
              <MoneyCounting
                coins={[
                  { emoji: "🥇", label: "10¢" },
                  { emoji: "🪙", label: "1¢" },
                  { emoji: "🪙", label: "1¢" },
                ]}
                answer={12}
                options={[10, 11, 12]}
                onCorrect={() => handleSectionComplete("4")}
              />
            </WorksheetSection>
          </>
        );

      default:
        return null;
    }
  };

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
        <p className="text-lg text-muted-foreground font-nunito">
          Class 1 Challenge: Numbers 1 to 20
        </p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm font-nunito text-muted-foreground">Progress:</span>
          <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(getCategoryProgress() / 4) * 100}%` }}
            />
          </div>
          <span className="text-sm font-fredoka">{getCategoryProgress()}/4</span>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-6 print:hidden">
        <motion.button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-fredoka shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Printer className="w-4 h-4" />
          Print Worksheet
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

      {/* Dotted divider */}
      <div className="border-b-2 border-dashed border-blue-300 mb-6" />

      {/* NAME field */}
      <div className="flex items-center gap-3 mb-6 print:mb-8">
        <span className="font-fredoka text-gray-600">NAME:</span>
        <input
          type="text"
          className="flex-1 max-w-xs border-b-2 border-gray-300 bg-transparent font-nunito outline-none focus:border-blue-400"
          placeholder="_______________________"
        />
      </div>

      {/* Worksheet sections */}
      {renderWorksheets()}

      {/* Completion badge */}
      {getCategoryProgress() === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-fredoka print:hidden"
        >
          <Trophy className="w-6 h-6" />
          All Complete! 🎉
        </motion.div>
      )}

      <Celebration
        show={showCelebration}
        message="You finished the worksheet! 🏆"
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
};
