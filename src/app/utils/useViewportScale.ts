import { useEffect, useState } from "react";

interface ViewportScaleOptions {
  baseWidth?: number;
  baseHeight?: number;
  minScale?: number;
  maxScale?: number;
}

// Returns a smooth scale factor based on current viewport size.
export default function useViewportScale(options: ViewportScaleOptions = {}) {
  const { baseWidth = 1440, baseHeight = 980, minScale = 0.68, maxScale = 1 } = options;
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const widthScale = window.innerWidth / baseWidth;
    const heightScale = window.innerHeight / baseHeight;
    const smallerRatio = Math.min(widthScale, heightScale);

    if (smallerRatio < minScale) {
      return minScale;
    }
    if (smallerRatio > maxScale) {
      return maxScale;
    }
    return smallerRatio;
  });

  useEffect(() => {
    const updateScale = () => {
      const widthScale = window.innerWidth / baseWidth;
      const heightScale = window.innerHeight / baseHeight;
      const smallerRatio = Math.min(widthScale, heightScale);

      let nextScale = smallerRatio;
      if (nextScale < minScale) {
        nextScale = minScale;
      }
      if (nextScale > maxScale) {
        nextScale = maxScale;
      }

      setScale(nextScale);
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
