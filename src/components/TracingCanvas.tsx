import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { NumberData } from "@/data/numberPaths";

interface TracingCanvasProps {
  numberData: NumberData;
  onComplete: () => void;
  onProgress: (progress: number) => void;
}

export const TracingCanvas = ({ numberData, onComplete, onProgress }: TracingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const pathPointsRef = useRef<{ x: number; y: number }[]>([]);
  const tracedPointsRef = useRef<Set<number>>(new Set());

  // Parse SVG path to points
  const parsePath = useCallback((pathStr: string, width: number, height: number) => {
    const points: { x: number; y: number }[] = [];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const path = new Path2D(pathStr);
    
    // Sample points along the path
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 100;
    tempCanvas.height = 120;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.stroke(path);
    
    // Generate points along the path
    const scaleX = width / 100;
    const scaleY = height / 120;
    
    for (let t = 0; t <= 1; t += 0.02) {
      const x = parsePathPoint(pathStr, t, "x") * scaleX;
      const y = parsePathPoint(pathStr, t, "y") * scaleY;
      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y });
      }
    }
    
    return points;
  }, []);

  // Simple path point parser
  const parsePathPoint = (pathStr: string, t: number, axis: "x" | "y"): number => {
    const commands = pathStr.match(/[MLCQSAHVZ][^MLCQSAHVZ]*/gi) || [];
    let currentX = 0, currentY = 0;
    const allPoints: { x: number; y: number }[] = [];
    
    commands.forEach(cmd => {
      const type = cmd[0].toUpperCase();
      const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
      
      if (type === "M" || type === "L") {
        for (let i = 0; i < nums.length; i += 2) {
          currentX = nums[i];
          currentY = nums[i + 1];
          allPoints.push({ x: currentX, y: currentY });
        }
      } else if (type === "C") {
        for (let i = 0; i < nums.length; i += 6) {
          // Bezier curve - sample points
          for (let bt = 0; bt <= 1; bt += 0.1) {
            const startX = currentX, startY = currentY;
            const cp1x = nums[i], cp1y = nums[i + 1];
            const cp2x = nums[i + 2], cp2y = nums[i + 3];
            const endX = nums[i + 4], endY = nums[i + 5];
            
            const x = Math.pow(1 - bt, 3) * startX + 3 * Math.pow(1 - bt, 2) * bt * cp1x + 3 * (1 - bt) * Math.pow(bt, 2) * cp2x + Math.pow(bt, 3) * endX;
            const y = Math.pow(1 - bt, 3) * startY + 3 * Math.pow(1 - bt, 2) * bt * cp1y + 3 * (1 - bt) * Math.pow(bt, 2) * cp2y + Math.pow(bt, 3) * endY;
            allPoints.push({ x, y });
          }
          currentX = nums[i + 4];
          currentY = nums[i + 5];
        }
      }
    });
    
    if (allPoints.length === 0) return 50;
    const idx = Math.floor(t * (allPoints.length - 1));
    return axis === "x" ? allPoints[idx]?.x || 50 : allPoints[idx]?.y || 60;
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d")!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Generate path points for tracing detection
    pathPointsRef.current = [];
    const scaleX = rect.width / 100;
    const scaleY = rect.height / 120;
    
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = parsePathPoint(numberData.path, t, "x") * scaleX;
      const y = parsePathPoint(numberData.path, t, "y") * scaleY;
      pathPointsRef.current.push({ x, y });
    }
    
    tracedPointsRef.current = new Set();
    setProgress(0);
    setShowHint(true);
  }, [numberData]);

  // Get position from event
  const getPosition = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Check if point is near path
  const checkNearPath = useCallback((x: number, y: number) => {
    const threshold = 35; // Tolerance for kids
    let nearestDist = Infinity;
    let nearestIdx = -1;
    
    pathPointsRef.current.forEach((point, idx) => {
      const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });
    
    if (nearestDist < threshold && nearestIdx >= 0) {
      tracedPointsRef.current.add(nearestIdx);
      const newProgress = (tracedPointsRef.current.size / pathPointsRef.current.length) * 100;
      setProgress(newProgress);
      onProgress(newProgress);
      
      if (newProgress >= 70) {
        onComplete();
      }
      
      return true;
    }
    return false;
  }, [onComplete, onProgress]);

  // Drawing handlers
  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setShowHint(false);
    
    const pos = getPosition(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    checkNearPath(pos.x, pos.y);
  }, [getPosition, checkNearPath]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const pos = getPosition(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx) {
      ctx.strokeStyle = "hsl(340, 82%, 62%)";
      ctx.lineWidth = 12;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    
    checkNearPath(pos.x, pos.y);
  }, [isDrawing, getPosition, checkNearPath]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tracedPointsRef.current = new Set();
    setProgress(0);
    setShowHint(true);
    onProgress(0);
  }, [onProgress]);

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        className="relative aspect-square max-w-[280px] md:max-w-[350px] mx-auto bg-card rounded-3xl shadow-card overflow-hidden border-4 border-muted"
      >
        {/* SVG guide path */}
        <svg
          viewBox={numberData.viewBox}
          className="absolute inset-0 w-full h-full p-6"
          style={{ pointerEvents: "none" }}
        >
          {/* Dotted guide */}
          <path
            d={numberData.path}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="8"
            strokeDasharray="4 8"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Animated hint */}
          {showHint && (
            <motion.circle
              r="8"
              fill="hsl(var(--primary))"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={numberData.path}
              />
            </motion.circle>
          )}
        </svg>
        
        {/* Tracing canvas */}
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
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 mx-auto max-w-[280px] md:max-w-[350px]">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0.3 }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2 font-nunito">
          {progress < 70 ? "Trace the number!" : "Great job! 🎉"}
        </p>
      </div>
      
      {/* Clear button */}
      <motion.button
        onClick={clearCanvas}
        className="mt-4 mx-auto block px-6 py-2 bg-muted rounded-xl font-fredoka text-foreground hover:bg-muted/80 transition-colors touch-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 Clear
      </motion.button>
    </div>
  );
};
