import { motion } from "framer-motion";
import { useState } from "react";
import { WorksheetInput } from "./WorksheetInput";

interface CountItem {
  emoji: string;
  count: number;
}

interface CountAndWriteProps {
  items?: CountItem[];
  onAllCorrect?: () => void;
}

const defaultItems: CountItem[] = [
  { emoji: "⭐", count: 12 },
  { emoji: "🍎", count: 16 },
  { emoji: "💗", count: 18 },
  { emoji: "😊", count: 20 }
];

export const CountAndWrite = ({ items = defaultItems, onAllCorrect }: CountAndWriteProps) => {
  const [correctCount, setCorrectCount] = useState(0);

  const handleCorrect = () => {
    const newCount = correctCount + 1;
    setCorrectCount(newCount);
    if (newCount === items.length) {
      onAllCorrect?.();
    }
  };

  const renderEmojis = (emoji: string, count: number) => {
    const rows = Math.ceil(count / 5);
    const emojiArray = [];
    
    for (let row = 0; row < rows; row++) {
      const startIdx = row * 5;
      const endIdx = Math.min(startIdx + 5, count);
      const rowEmojis = [];
      
      for (let i = startIdx; i < endIdx; i++) {
        rowEmojis.push(
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className="text-2xl md:text-3xl"
          >
            {emoji}
          </motion.span>
        );
      }
      
      emojiArray.push(
        <div key={row} className="flex gap-1 justify-center">
          {rowEmojis}
        </div>
      );
    }
    
    return emojiArray;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-md border border-pink-100 flex items-center gap-4"
        >
          <div className="flex-1 flex flex-col gap-1">
            {renderEmojis(item.emoji, item.count)}
          </div>
          <WorksheetInput
            correctAnswer={item.count}
            onCorrect={handleCorrect}
            color="pink"
            size="lg"
          />
        </motion.div>
      ))}
    </div>
  );
};
