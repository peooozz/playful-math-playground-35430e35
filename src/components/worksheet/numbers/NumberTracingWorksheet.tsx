import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { WorksheetSection } from "../WorksheetSection";
import { Celebration } from "../../Celebration";

interface NumberTracingWorksheetProps {
  worksheetIndex: number;
  onComplete: () => void;
}

// SVG paths for numbers 0-9 with stroke order
const numberPaths: Record<number, { path: string; viewBox: string }> = {
  0: { path: "M50 15 C25 15 15 40 15 60 C15 80 25 105 50 105 C75 105 85 80 85 60 C85 40 75 15 50 15", viewBox: "0 0 100 120" },
  1: { path: "M35 25 L50 15 L50 105", viewBox: "0 0 100 120" },
  2: { path: "M20 35 C20 15 45 10 60 25 C75 40 70 55 50 70 L20 105 L80 105", viewBox: "0 0 100 120" },
  3: { path: "M25 20 C35 10 70 10 70 35 C70 50 55 55 45 55 C55 55 75 60 75 80 C75 105 40 110 20 95", viewBox: "0 0 100 120" },
  4: { path: "M65 105 L65 15 L15 75 L85 75", viewBox: "0 0 100 120" },
  5: { path: "M75 15 L30 15 L25 55 C40 45 75 45 75 75 C75 105 40 110 20 90", viewBox: "0 0 100 120" },
  6: { path: "M70 20 C50 10 20 25 20 60 C20 95 45 105 60 95 C75 85 75 65 60 55 C45 45 20 55 20 60", viewBox: "0 0 100 120" },
  7: { path: "M20 15 L80 15 L45 105", viewBox: "0 0 100 120" },
  8: { path: "M50 55 C30 55 25 40 30 25 C35 10 65 10 70 25 C75 40 70 55 50 55 C25 55 15 75 20 90 C25 105 75 105 80 90 C85 75 75 55 50 55", viewBox: "0 0 100 120" },
  9: { path: "M80 60 C80 25 55 15 40 25 C25 35 25 55 40 65 C55 75 80 65 80 60 L80 100 C70 110 50 110 30 100", viewBox: "0 0 100 120" },
};

const numberNames = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

export const NumberTracingWorksheet = ({ worksheetIndex, onComplete }: NumberTracingWorksheetProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Path sampling for hit detection
  const pathPointsRef = useRef<{ x: number; y: number }[]>([]);
  const tracedPointsRef = useRef<Set<number>>(new Set());
  const lastValidPointRef = useRef<{ x: number; y: number } | null>(null);

  const num = worksheetIndex % 10;
  const numberData = numberPaths[num];

  // Generate path points for hit testing
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d")!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Sample points from the SVG path
    const points: { x: number; y: number }[] = [];
    const scaleX = rect.width / 100;
    const scaleY = rect.height / 120;
    const padding = rect.width * 0.15;

    // Parse and sample path
    const path = numberData.path;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 100;
    tempCanvas.height = 120;
    const tempCtx = tempCanvas.getContext("2d")!;
    
    const path2D = new Path2D(path);
    tempCtx.stroke(path2D);

    // Sample 50 points along normalized path
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const { x, y } = samplePath(path, t);
      points.push({
        x: padding + x * (rect.width - padding * 2) / 100,
        y: padding + y * (rect.height - padding * 2) / 120,
      });
    }

    pathPointsRef.current = points;
    tracedPointsRef.current = new Set();
    setProgress(0);
    setIsComplete(false);
  }, [worksheetIndex, numberData]);

  // Simple path point sampler
  const samplePath = (pathStr: string, t: number): { x: number; y: number } => {
    const commands = pathStr.match(/[MLCQSAHVZ][^MLCQSAHVZ]*/gi) || [];
    const allPoints: { x: number; y: number }[] = [];
    let cx = 0, cy = 0;

    commands.forEach((cmd) => {
      const type = cmd[0].toUpperCase();
      const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

      if (type === "M" || type === "L") {
        for (let i = 0; i < nums.length; i += 2) {
          cx = nums[i];
          cy = nums[i + 1];
          allPoints.push({ x: cx, y: cy });
        }
      } else if (type === "C") {
        for (let i = 0; i < nums.length; i += 6) {
          for (let bt = 0; bt <= 1; bt += 0.1) {
            const x = bezier(cx, nums[i], nums[i + 2], nums[i + 4], bt);
            const y = bezier(cy, nums[i + 1], nums[i + 3], nums[i + 5], bt);
            allPoints.push({ x, y });
          }
          cx = nums[i + 4];
          cy = nums[i + 5];
        }
      }
    });

    if (allPoints.length === 0) return { x: 50, y: 60 };
    const idx = Math.min(Math.floor(t * allPoints.length), allPoints.length - 1);
    return allPoints[idx];
  };

  const bezier = (p0: number, p1: number, p2: number, p3: number, t: number) => {
    const t1 = 1 - t;
    return t1 * t1 * t1 * p0 + 3 * t1 * t1 * t * p1 + 3 * t1 * t * t * p2 + t * t * t * p3;
  };

  // Get touch/mouse position
  const getPosition = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Strict path hit detection
  const isOnPath = useCallback((x: number, y: number): { valid: boolean; nearestIdx: number } => {
    const threshold = 30; // Strict tolerance
    let nearestDist = Infinity;
    let nearestIdx = -1;

    pathPointsRef.current.forEach((point, idx) => {
      const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });

    return {
      valid: nearestDist < threshold,
      nearestIdx,
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const pos = getPosition(e);
    if (!pos) return;

    const { valid, nearestIdx } = isOnPath(pos.x, pos.y);
    if (!valid) return; // Don't start if not on path

    setIsDrawing(true);
    lastValidPointRef.current = pos;

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    if (nearestIdx >= 0) {
      tracedPointsRef.current.add(nearestIdx);
    }
  }, [getPosition, isOnPath]);

  // Continue drawing
  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getPosition(e);
    if (!pos) return;

    const { valid, nearestIdx } = isOnPath(pos.x, pos.y);
    const ctx = canvasRef.current?.getContext("2d");

    if (valid && ctx && lastValidPointRef.current) {
      // Draw on path
      ctx.strokeStyle = "hsl(280, 70%, 55%)";
      ctx.lineWidth = 10;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);

      lastValidPointRef.current = pos;

      // Track progress
      if (nearestIdx >= 0) {
        tracedPointsRef.current.add(nearestIdx);
        const newProgress = (tracedPointsRef.current.size / pathPointsRef.current.length) * 100;
        setProgress(newProgress);

        if (newProgress >= 75 && !isComplete) {
          setIsComplete(true);
          setTimeout(() => {
            setShowCelebration(true);
            onComplete();
          }, 300);
        }
      }
    } else if (!valid) {
      // Off path - stop and show hint
      setIsDrawing(false);
      if (ctx) {
        ctx.beginPath();
      }
    }
  }, [isDrawing, getPosition, isOnPath, isComplete, onComplete]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
    }
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tracedPointsRef.current = new Set();
    setProgress(0);
    setIsComplete(false);
  }, []);

  return (
    <WorksheetSection number={worksheetIndex + 1} title={`Trace the number ${num}!`} color="pink">
      <div className="flex flex-col items-center">
        {/* Number name */}
        <motion.h3
          className="font-fredoka text-2xl md:text-3xl text-primary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {numberNames[num]}
        </motion.h3>

        {/* Tracing canvas */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[250px] md:max-w-[300px] aspect-[100/120] bg-card rounded-3xl shadow-lg overflow-hidden border-4 border-primary/20"
        >
          {/* SVG guide */}
          <svg
            viewBox={numberData.viewBox}
            className="absolute inset-0 w-full h-full p-6"
            style={{ pointerEvents: "none" }}
          >
            {/* Dotted guide path */}
            <path
              d={numberData.path}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="10"
              strokeDasharray="5 10"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Start indicator */}
            {progress < 10 && (
              <motion.circle
                r="6"
                fill="hsl(var(--primary))"
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <animateMotion dur="0.01s" path={numberData.path} keyPoints="0;0" keyTimes="0;1" />
              </motion.circle>
            )}
          </svg>

          {/* Canvas for tracing */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {/* Completion overlay */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-green-400/20 flex items-center justify-center pointer-events-none"
            >
              <motion.span
                className="text-6xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                transition={{ type: "spring" }}
              >
                ⭐
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[250px] md:max-w-[300px] mt-4">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2 font-nunito">
            {progress < 75 ? "Stay on the dotted line!" : "Perfect! ⭐"}
          </p>
        </div>

        {/* Clear button */}
        <motion.button
          onClick={clearCanvas}
          className="mt-4 px-6 py-2 bg-muted rounded-xl font-fredoka text-foreground hover:bg-muted/80"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Clear
        </motion.button>
      </div>

      <Celebration
        show={showCelebration}
        message={`You traced ${num}! 🎉`}
        onComplete={() => setShowCelebration(false)}
      />
    </WorksheetSection>
  );
};
