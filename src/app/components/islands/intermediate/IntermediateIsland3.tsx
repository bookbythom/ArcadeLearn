import svgPaths from "@/imports/intermediate-island-03";

// Properties pre IntermediateIsland3 komponent
interface IntermediateIsland3Props {
  onClick?: () => void;
}

// Komponent pre intermediate ostrov c. 3
export default function IntermediateIsland3(props: IntermediateIsland3Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 3"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p10ff63f0} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p35a28580} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p2e6ee900} fill="#AF4545" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}