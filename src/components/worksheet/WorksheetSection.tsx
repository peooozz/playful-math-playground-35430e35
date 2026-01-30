import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WorksheetSectionProps {
  number: number;
  title: string;
  color: "pink" | "yellow" | "green" | "blue";
  children: ReactNode;
}

const colorStyles = {
  pink: {
    bg: "bg-pink-100",
    badge: "bg-pink-500",
    title: "text-pink-600",
    border: "border-pink-200"
  },
  yellow: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-500",
    title: "text-yellow-600",
    border: "border-yellow-200"
  },
  green: {
    bg: "bg-green-50",
    badge: "bg-green-500",
    title: "text-green-600",
    border: "border-green-200"
  },
  blue: {
    bg: "bg-blue-50",
    badge: "bg-blue-500",
    title: "text-blue-600",
    border: "border-blue-200"
  }
};

export const WorksheetSection = ({ number, title, color, children }: WorksheetSectionProps) => {
  const styles = colorStyles[color];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.1 }}
      className={`${styles.bg} ${styles.border} border-2 rounded-3xl p-4 md:p-6 mb-6 shadow-lg`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`${styles.badge} w-8 h-8 rounded-full flex items-center justify-center text-white font-fredoka font-bold text-lg shadow-md`}>
          {number}
        </div>
        <h3 className={`${styles.title} text-xl md:text-2xl font-fredoka font-bold`}>
          {title}
        </h3>
      </div>
      <div className="pl-0 md:pl-2">
        {children}
      </div>
    </motion.section>
  );
};
