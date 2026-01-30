import { motion } from "framer-motion";
import { NumberData } from "@/data/numberPaths";

interface PracticeGridProps {
  numberData: NumberData;
}

export const PracticeGrid = ({ numberData }: PracticeGridProps) => {
  const gridSize = numberData.number === 10 ? 8 : 12;
  
  return (
    <div className="w-full max-w-[320px] md:max-w-[400px] mx-auto">
      <h3 className="text-lg md:text-xl font-fredoka text-foreground text-center mb-3">
        Practice Writing
      </h3>
      <div className="bg-card rounded-2xl p-4 shadow-card border-2 border-muted">
        <div className={`grid ${numberData.number === 10 ? "grid-cols-4" : "grid-cols-4 md:grid-cols-6"} gap-2`}>
          {Array.from({ length: gridSize }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30"
            >
              <svg
                viewBox={numberData.viewBox}
                className="w-full h-full p-1"
              >
                <path
                  d={numberData.path}
                  fill="none"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="3"
                  strokeDasharray="2 4"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
