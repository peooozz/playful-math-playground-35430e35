import { useState } from "react";
import { motion } from "framer-motion";
import { FloatingDecorations } from "@/components/FloatingDecorations";
import { ModuleTabs, type ModuleType } from "@/components/ModuleTabs";
import { NumbersModule } from "@/components/NumbersModule";
import { AdditionModule } from "@/components/AdditionModule";
import { SubtractionModule } from "@/components/SubtractionModule";
import { WorksheetModule } from "@/components/worksheet/WorksheetModule";

const Index = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>("worksheet");

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Floating decorations */}
      <FloatingDecorations />

      {/* Main content */}
      <div className="relative z-10 py-6 md:py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-10 px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-fredoka font-bold text-rainbow mb-2 md:mb-3">
            🌈 Math Fun! 🌈
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-nunito max-w-md mx-auto">
            Learn numbers, addition & subtraction with fun!
          </p>
          
          {/* Cute mascot */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-4xl md:text-5xl mt-4"
          >
            🐻
          </motion.div>
        </motion.header>

        {/* Module tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ModuleTabs
            activeModule={activeModule}
            onModuleChange={setActiveModule}
          />
        </motion.div>

        {/* Module content */}
        <motion.main
          key={activeModule}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="pb-10"
        >
          {activeModule === "worksheet" && <WorksheetModule />}
          {activeModule === "numbers" && <NumbersModule />}
          {activeModule === "addition" && <AdditionModule />}
          {activeModule === "subtraction" && <SubtractionModule />}
        </motion.main>

        {/* Footer */}
        <footer className="text-center py-6 px-4">
          <p className="text-sm text-muted-foreground font-nunito">
            Made with 💖 for little learners
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
