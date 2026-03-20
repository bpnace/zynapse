"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

type GridSetup = {
  cols: number;
  rows: number;
  squares: Float32Array;
  dpr: number;
};

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const gridRef = useRef<GridSetup | null>(null);
  const lastTimeRef = useRef(0);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    const toRGBA = (input: string) => {
      if (typeof window === "undefined") {
        return "rgba(0, 0, 0,";
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return "rgba(0, 0, 0,";
      }

      ctx.fillStyle = input;
      ctx.fillRect(0, 0, 1, 1);

      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b},`;
    };

    return toRGBA(color);
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, nextWidth: number, nextHeight: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = nextWidth * dpr;
      canvas.height = nextHeight * dpr;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;

      const cols = Math.floor(nextWidth / (squareSize + gridGap));
      const rows = Math.floor(nextHeight / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);

      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [gridGap, maxOpacity, squareSize],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number,
      grid: GridSetup,
    ) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let col = 0; col < grid.cols; col++) {
        for (let row = 0; row < grid.rows; row++) {
          const opacity = grid.squares[col * grid.rows + row];
          ctx.fillStyle = `${memoizedColor}${opacity})`;
          ctx.fillRect(
            col * (squareSize + gridGap) * grid.dpr,
            row * (squareSize + gridGap) * grid.dpr,
            squareSize * grid.dpr,
            squareSize * grid.dpr,
          );
        }
      }
    },
    [gridGap, memoizedColor, squareSize],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const updateCanvasSize = () => {
      const nextWidth = width || container.clientWidth;
      const nextHeight = height || container.clientHeight;
      setCanvasSize({ width: nextWidth, height: nextHeight });
      gridRef.current = setupCanvas(canvas, nextWidth, nextHeight);
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [height, setupCanvas, width]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !isInView) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const animate = (time: number) => {
      const grid = gridRef.current;
      if (!grid) {
        return;
      }

      const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.12);
      lastTimeRef.current = time;

      updateSquares(grid.squares, deltaTime);
      drawGrid(ctx, canvas.width, canvas.height, grid);
      frameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [drawGrid, isInView, updateSquares]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};
