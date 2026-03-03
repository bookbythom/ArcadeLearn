import svgPaths from "@/imports/beginner-test-island";

// Properties pre BeginnerTestIsland komponent
interface BeginnerTestIslandProps {
  onClick?: () => void;
}

// Komponent pre beginner test ostrov
export default function BeginnerTestIsland(props: BeginnerTestIslandProps) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner final test"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <g>
                <path d={svgPaths.p346567e0} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p5f9b900} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p2f319500} fill="#8C6239" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}