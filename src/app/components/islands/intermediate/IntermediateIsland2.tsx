import svgPaths from "@/imports/intermediate-island-02";

// Properties pre IntermediateIsland2 komponent
interface IntermediateIsland2Props {
  onClick?: () => void;
}

// Komponent pre intermediate ostrov c. 2
export default function IntermediateIsland2(props: IntermediateIsland2Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 2"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <g>
                <path d={svgPaths.p1e01db00} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p203bcc00} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p836f700} fill="#AF4545" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}