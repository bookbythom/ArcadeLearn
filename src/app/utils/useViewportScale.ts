import { useEffect, useMemo, useState } from "react";

interface ViewportScaleOptions {
  baseHeight?: number;
  minScale?: number;
  maxScale?: number;
}

// Returns a smooth scale factor based on current viewport height.
export default function useViewportScale(options: ViewportScaleOptions = {}) {
  const { baseHeight = 980, minScale = 0.68, maxScale = 1 } = options;

  const getViewportHeight = () => {
    if (typeof window === "undefined") {
      return baseHeight;
    }
    return window.innerHeight;
  };

  const [viewportHeight, setViewportHeight] = useState<number>(getViewportHeight);

  useEffect(() => {
    let animationFrameId = 0;

    const updateHeight = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setViewportHeight(window.innerHeight);
      });
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return useMemo(() => {
    const rawScale = viewportHeight / baseHeight;
    return Math.min(maxScale, Math.max(minScale, rawScale));
  }, [viewportHeight, baseHeight, minScale, maxScale]);
}
