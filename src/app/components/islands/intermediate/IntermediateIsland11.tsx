import svgPaths from "@/imports/intermediate-island-11";

// Properties pre IntermediateIsland11 komponent
interface IntermediateIsland11Props {
  onClick?: () => void;
}

// Pomocny komponent pre dodatocnu grafiku
function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_28.58%_32.87%_26.08%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.4128 41.4672">
        <g>
          <path d={svgPaths.p148e7b30} fill="#AF4545" />
          <path d={svgPaths.p120ee500} fill="#AF4545" />
        </g>
      </svg>
    </div>
  );
}

// Komponent pre intermediate ostrov c. 11
export default function IntermediateIsland11(props: IntermediateIsland11Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 11"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.p10edfa00} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p64b7d80} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}