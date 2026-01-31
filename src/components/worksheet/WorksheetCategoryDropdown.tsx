import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type WorksheetCategory = 
  | "numbers-counting"
  | "patterns" 
  | "measurement" 
  | "money";

interface WorksheetCategoryDropdownProps {
  value: WorksheetCategory;
  onChange: (category: WorksheetCategory) => void;
}

const categoryInfo: Record<WorksheetCategory, { label: string; emoji: string }> = {
  "numbers-counting": { label: "Numbers & Counting", emoji: "🔢" },
  "patterns": { label: "Patterns", emoji: "🔷" },
  "measurement": { label: "Measurement", emoji: "📏" },
  "money": { label: "Money", emoji: "💰" },
};

export const WorksheetCategoryDropdown = ({ value, onChange }: WorksheetCategoryDropdownProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xs mx-auto mb-6"
    >
      <Select value={value} onValueChange={(v) => onChange(v as WorksheetCategory)}>
        <SelectTrigger className="h-14 text-lg font-fredoka bg-card border-2 border-primary/30 rounded-2xl shadow-lg hover:border-primary/50 transition-colors">
          <SelectValue>
            <span className="flex items-center gap-3">
              <span className="text-2xl">{categoryInfo[value].emoji}</span>
              <span>{categoryInfo[value].label}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-2 border-primary/20 rounded-xl shadow-xl z-50">
          {(Object.keys(categoryInfo) as WorksheetCategory[]).map((category) => (
            <SelectItem
              key={category}
              value={category}
              className="text-lg font-nunito py-3 px-4 cursor-pointer hover:bg-primary/10 rounded-lg m-1"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{categoryInfo[category].emoji}</span>
                <span>{categoryInfo[category].label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};
