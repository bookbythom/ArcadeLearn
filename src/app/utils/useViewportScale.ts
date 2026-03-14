import { useEffect, useMemo, useState } from "react";

interface ViewportScaleOptions {
  baseWidth?: number;
  baseHeight?: number;
  minScale?: number;
  maxScale?: number;
}

// Returns a smooth scale factor based on current viewport size.
export default function useViewportScale(options: ViewportScaleOptions = {}) {
  const { baseWidth = 1440, baseHeight = 980, minScale = 0.68, maxScale = 1 } = options;

  const getViewportSize = () => {
    if (typeof window === "undefined") {
      return { width: baseWidth, height: baseHeight };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  };

  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>(getViewportSize);

  useEffect(() => {
    let animationFrameId = 0;

    const updateSize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return useMemo(() => {
    const widthScale = viewportSize.width / baseWidth;
    const heightScale = viewportSize.height / baseHeight;
    const rawScale = Math.min(widthScale, heightScale);
    return Math.min(maxScale, Math.max(minScale, rawScale));
  }, [viewportSize, baseWidth, baseHeight, minScale, maxScale]);
}
