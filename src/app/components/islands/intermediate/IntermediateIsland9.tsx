import svgPaths from "@/imports/intermediate-island-09";

// Properties pre IntermediateIsland9 komponent
interface IntermediateIsland9Props {
  onClick?: () => void;
}

// Komponent pre intermediate ostrov c. 9
export default function IntermediateIsland9(props: IntermediateIsland9Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 9"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <g>
                <path d={svgPaths.p944ae80} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p393c9600} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p104a3200} fill="#AF4545" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}