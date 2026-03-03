import svgPaths from "@/imports/beginner-island-10";

// Properties pre BeginnerIsland10 komponent
interface BeginnerIsland10Props {
  onClick?: () => void;
}

// Pomocny komponent pre dodatocnu grafiku
function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_20.72%_31.46%_18.32%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.149 42.739">
        <g>
          <path d={svgPaths.pdd8c180} fill="#8C6239" />
          <path d={svgPaths.pfaa800} fill="#8C6239" />
        </g>
      </svg>
    </div>
  );
}

// Komponent pre beginner ostrov c. 10
export default function BeginnerIsland10(props: BeginnerIsland10Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner theme 10"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.p53830f2} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p1d344600} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}