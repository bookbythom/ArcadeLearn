import { useEffect, useState } from "react";

interface ViewportScaleOptions {
  baseWidth?: number;
  baseHeight?: number;
  minScale?: number;
  maxScale?: number;
}

function clampScale(value: number, minScale: number, maxScale: number): number {
  if (value < minScale) {
    return minScale;
  }
  if (value > maxScale) {
    return maxScale;
  }
  return value;
}

function computeViewportScale(baseWidth: number, baseHeight: number, minScale: number, maxScale: number): number {
  const widthScale = window.innerWidth / baseWidth;
  const heightScale = window.innerHeight / baseHeight;
  const smallerRatio = Math.min(widthScale, heightScale);
  return clampScale(smallerRatio, minScale, maxScale);
}

// Returns a smooth scale factor based on current viewport size.
export default function useViewportScale(options: ViewportScaleOptions = {}) {
  const { baseWidth = 1440, baseHeight = 980, minScale = 0.68, maxScale = 1 } = options;
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    return computeViewportScale(baseWidth, baseHeight, minScale, maxScale);
  });

  useEffect(() => {
    const updateScale = () => {
      setScale(computeViewportScale(baseWidth, baseHeight, minScale, maxScale));
    };

    if (typeof window === "undefined") {
      return;
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [baseWidth, baseHeight, minScale, maxScale]);

  return scale;
}
