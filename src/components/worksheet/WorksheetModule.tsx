import { useState } from "react";
import { motion } from "framer-motion";
import { Printer, RefreshCw, Trophy } from "lucide-react";
import { WorksheetSection } from "./WorksheetSection";
import { CountAndWrite } from "./CountAndWrite";
import { MissingNumbers } from "./MissingNumbers";
import { AdditionWorksheet } from "./AdditionWorksheet";
import { CompareNumbers } from "./CompareNumbers";
import { Celebration } from "../Celebration";

export const WorksheetModule = () => {
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSectionComplete = (section: number) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(section);
    setCompletedSections(newCompleted);
    
    if (newCompleted.size === 4) {
      setShowCelebration(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    window.location.reload();
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
              animate={{ width: `${(completedSections.size / 4) * 100}%` }}
            />
          </div>
          <span className="text-sm font-fredoka">{completedSections.size}/4</span>
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

      {/* Section 1: Count and Write */}
      <WorksheetSection number={1} title="Count and write the number!" color="pink">
        <CountAndWrite 
          items={[
            { emoji: "⭐", count: 12 },
            { emoji: "🍎", count: 16 },
            { emoji: "💗", count: 18 },
            { emoji: "😊", count: 20 }
          ]}
          onAllCorrect={() => handleSectionComplete(1)}
        />
      </WorksheetSection>

      {/* Section 2: Fill in Missing Numbers */}
      <WorksheetSection number={2} title="Fill in the missing numbers!" color="yellow">
        <MissingNumbers 
          sequence={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
          missing={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
          onAllCorrect={() => handleSectionComplete(2)}
        />
      </WorksheetSection>

      {/* Section 3: Addition */}
      <WorksheetSection number={3} title="Add the numbers!" color="green">
        <AdditionWorksheet 
          problems={[
            { num1: 5, num2: 3 },
            { num1: 4, num2: 4 },
            { num1: 7, num2: 2 },
            { num1: 6, num2: 1 },
            { num1: 3, num2: 5 },
            { num1: 2, num2: 8 }
          ]}
          onAllCorrect={() => handleSectionComplete(3)}
        />
      </WorksheetSection>

      {/* Section 4: Compare Numbers */}
      <WorksheetSection number={4} title="Compare: Use >, <, or =" color="blue">
        <CompareNumbers 
          problems={[
            { num1: 15, num2: 12 },
            { num1: 8, num2: 18 },
            { num1: 20, num2: 20 },
            { num1: 11, num2: 9 },
            { num1: 14, num2: 17 },
            { num1: 13, num2: 13 }
          ]}
          onAllCorrect={() => handleSectionComplete(4)}
        />
      </WorksheetSection>

      {/* Completion badge */}
      {completedSections.size === 4 && (
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
