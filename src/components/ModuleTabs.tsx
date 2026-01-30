import { motion } from "framer-motion";
import { Hash, Plus, Minus, FileText } from "lucide-react";

export type ModuleType = "numbers" | "addition" | "subtraction" | "worksheet";

interface ModuleTabsProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const tabs = [
  { 
    id: "worksheet" as ModuleType, 
    label: "Worksheet", 
    emoji: "📝",
    icon: FileText,
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
    hoverColor: "hover:from-blue-600 hover:to-purple-600"
  },
  { 
    id: "numbers" as ModuleType, 
    label: "Numbers", 
    emoji: "🔢",
    icon: Hash,
    color: "bg-rainbow-pink",
    hoverColor: "hover:bg-rainbow-pink/90"
  },
  { 
    id: "addition" as ModuleType, 
    label: "Addition", 
    emoji: "➕",
    icon: Plus,
    color: "bg-rainbow-green",
    hoverColor: "hover:bg-rainbow-green/90"
  },
  { 
    id: "subtraction" as ModuleType, 
    label: "Subtraction", 
    emoji: "➖",
    icon: Minus,
    color: "bg-rainbow-blue",
    hoverColor: "hover:bg-rainbow-blue/90"
  },
];

export const ModuleTabs = ({ activeModule, onModuleChange }: ModuleTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-2">
      {tabs.map((tab) => {
        const isActive = activeModule === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onModuleChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl
              font-fredoka font-semibold text-sm md:text-lg
              transition-all duration-200 no-select touch-button
              ${isActive 
                ? `${tab.color} text-white shadow-lg scale-105` 
                : "bg-card text-foreground shadow-md hover:shadow-lg"
              }
            `}
            whileHover={{ scale: isActive ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg md:text-xl">{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-2xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
