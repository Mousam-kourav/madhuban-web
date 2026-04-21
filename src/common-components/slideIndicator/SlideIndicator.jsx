"use client";
import { useState, useEffect, useCallback } from "react";

const SlideIndecator = ({ SLIDE_DURATION = 3000, slidesCount = 3 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      goToSlide((activeIndex + 1) % slidesCount);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, goToSlide]);

  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-lg px-6">
        {/* Dot indicators */}
        <div className="flex gap-2 mb-10">
          {Array(slidesCount)
            .fill(null)
            .map((_, i) => (
              <button
                key={i}
                className="relative h-1.5 flex-1 rounded-full overflow-hidden "
                style={{ backgroundColor: "white" }}
              >
                {/* Completed dots */}
                {i < activeIndex && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: "var(--primary-gray2)" }}
                  />
                )}
                {/* Active dot with fill animation */}
                {i === activeIndex && !isPaused && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: "var(--primary-gray2)",
                      animation: `dot-fill ${SLIDE_DURATION}ms linear forwards`,
                      boxShadow: "0 0 8px hsl(var(--dot-glow) / 0.5)",
                    }}
                  />
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SlideIndecator;
