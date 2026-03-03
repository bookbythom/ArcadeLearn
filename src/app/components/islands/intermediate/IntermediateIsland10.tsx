import svgPaths from "@/imports/intermediate-island-10";

// Properties pre IntermediateIsland10 komponent
interface IntermediateIsland10Props {
  onClick?: () => void;
}

// Pomocny komponent pre dodatocnu grafiku
function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_20.53%_31.46%_18.51%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.1519 42.7386">
        <g>
          <path d={svgPaths.p2b1b9280} fill="#AF4545" />
          <path d={svgPaths.p36bfa00} fill="#AF4545" />
        </g>
      </svg>
    </div>
  );
}

// Komponent pre intermediate ostrov c. 10
export default function IntermediateIsland10(props: IntermediateIsland10Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 10"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.p22bbb100} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p6b20000} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}