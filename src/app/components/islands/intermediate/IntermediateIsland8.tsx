import svgPaths from "@/imports/intermediate-island-08";

// Properties pre IntermediateIsland8 komponent
interface IntermediateIsland8Props {
  onClick?: () => void;
}

// Komponent pre intermediate ostrov c. 8
export default function IntermediateIsland8(props: IntermediateIsland8Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 8"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <g>
                <path d={svgPaths.p33744a00} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p3c873580} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p1ec00f00} fill="#AF4545" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}