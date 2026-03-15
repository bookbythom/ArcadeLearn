import svgPaths from "@/imports/island-locked";

interface LockedIslandProps {
  onClick?: () => void;
}

export default function LockedIsland(_props: LockedIslandProps) {
  // Zamknute ostrovy nemaju onClick handler, su neaktivne
  return (
    <div
      className="relative group cursor-not-allowed opacity-50 w-28 h-24"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <g>
                <path d={svgPaths.p346567e0} fill="#CCCCCC" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p5f9b900} fill="#CCCCCC" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p24f99500} fill="#808080" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}