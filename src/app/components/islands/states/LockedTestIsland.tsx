import svgPaths from "@/imports/island-locked-test";

interface LockedTestIslandProps {
  onClick?: () => void;
}

export default function LockedTestIsland(_props: LockedTestIslandProps) {
  // Zamknute test ostrovy nemaju onClick handler, su neaktivne
  return (
    <div
      className="relative group cursor-not-allowed opacity-50 w-28 h-24"
    >
      <div className="relative size-full">
        {/* Zaklad ostrova */}
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <path d={svgPaths.p346567e0} fill="#CCCCCC" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p5f9b900} fill="#CCCCCC" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        {/* Ikona zamku */}
        <div className="absolute inset-[22.47%_25.53%_32.7%_25.53%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.7328 40.346">
            <path d={svgPaths.p3db1d380} fill="#7F7F7F" />
          </svg>
        </div>
      </div>
    </div>
  );
}