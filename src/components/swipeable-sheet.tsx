"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SwipeableSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  side?: "bottom" | "right" | "left";
  threshold?: number;
}

export function SwipeableSheet({
  isOpen,
  onClose,
  children,
  className,
  side = "bottom",
  threshold = 100,
}: SwipeableSheetProps) {
  const [translateValue, setTranslateValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const getEventPosition = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      return side === "bottom" ? e.touches[0].clientY : e.touches[0].clientX;
    }
    return side === "bottom" ? e.clientY : e.clientX;
  };

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      // Only allow dragging from the handle area (top 60px for bottom sheets)
      if (sheetRef.current && side === "bottom") {
        const touch = "touches" in e ? e.touches[0] : e;
        const rect = sheetRef.current.getBoundingClientRect();
        const relativeY = touch.clientY - rect.top;
        if (relativeY > 60) return; // Only allow drag from handle area
      }

      startPos.current = getEventPosition(e);
      setIsDragging(true);
    },
    [side]
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return;

      const currentPos = getEventPosition(e);
      let diff = currentPos - startPos.current;

      // Only allow dragging in the closing direction
      if (side === "bottom") {
        diff = Math.max(0, diff); // Only allow down drag
      } else if (side === "right") {
        diff = Math.max(0, diff); // Only allow right drag
      } else if (side === "left") {
        diff = Math.min(0, diff); // Only allow left drag
      }

      setTranslateValue(diff);
    },
    [isDragging, side]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (Math.abs(translateValue) > threshold) {
      onClose();
    }

    setTranslateValue(0);
  }, [isDragging, translateValue, threshold, onClose]);

  if (!isOpen) return null;

  const getTransform = () => {
    switch (side) {
      case "bottom":
        return `translateY(${translateValue}px)`;
      case "right":
        return `translateX(${translateValue}px)`;
      case "left":
        return `translateX(${translateValue}px)`;
      default:
        return undefined;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        style={{
          opacity: Math.max(0, 1 - Math.abs(translateValue) / (threshold * 2)),
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed z-50 bg-white shadow-2xl",
          side === "bottom" && "bottom-0 left-0 right-0 rounded-t-2xl",
          side === "right" && "top-0 right-0 bottom-0 w-80 rounded-l-2xl",
          side === "left" && "top-0 left-0 bottom-0 w-80 rounded-r-2xl",
          className
        )}
        style={{
          transform: getTransform(),
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* Drag handle for bottom sheets */}
        {side === "bottom" && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>
        )}
        {children}
      </div>
    </>
  );
}
