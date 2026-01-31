import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WorksheetNavigationProps {
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const WorksheetNavigation = ({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
}: WorksheetNavigationProps) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCount - 1;

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {/* Previous button */}
      <motion.button
        onClick={onPrevious}
        disabled={isFirst}
        className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
          font-fredoka shadow-lg transition-all
          ${isFirst 
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
            : "bg-primary text-primary-foreground hover:scale-110 active:scale-95"
          }
        `}
        whileHover={!isFirst ? { scale: 1.1 } : {}}
        whileTap={!isFirst ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </motion.button>

      {/* Page indicator */}
      <div className="flex items-center gap-2">
        <span className="font-fredoka text-lg md:text-xl text-foreground">
          {currentIndex + 1}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="font-fredoka text-lg md:text-xl text-muted-foreground">
          {totalCount}
        </span>
      </div>

      {/* Dot indicators */}
      <div className="hidden md:flex items-center gap-1.5 mx-4">
        {Array.from({ length: totalCount }).map((_, idx) => (
          <motion.div
            key={idx}
            className={`
              w-2.5 h-2.5 rounded-full transition-colors
              ${idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"}
            `}
            animate={idx === currentIndex ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        disabled={isLast}
        className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
          font-fredoka shadow-lg transition-all
          ${isLast 
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
            : "bg-primary text-primary-foreground hover:scale-110 active:scale-95"
          }
        `}
        whileHover={!isLast ? { scale: 1.1 } : {}}
        whileTap={!isLast ? { scale: 0.95 } : {}}
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </motion.button>
    </div>
  );
};
