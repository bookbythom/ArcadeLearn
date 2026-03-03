import svgPaths from "@/imports/intermediate-island-12";

// Properties pre IntermediateIsland12 komponent
interface IntermediateIsland12Props {
  onClick?: () => void;
}

// Pomocny komponent pre dodatocnu grafiku
function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_20.64%_32.87%_18.19%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.4081 41.4675">
        <g>
          <path d={svgPaths.p19af4071} fill="#AF4545" />
          <path d={svgPaths.p321d9e80} fill="#AF4545" />
        </g>
      </svg>
    </div>
  );
}

// Komponent pre intermediate ostrov c. 12
export default function IntermediateIsland12(props: IntermediateIsland12Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 12"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.p7ddd3f2} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p18c97380} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}