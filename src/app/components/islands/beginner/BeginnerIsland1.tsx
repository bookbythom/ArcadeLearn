import svgPaths from "@/imports/beginner-island-01";

// Properties pre BeginnerIsland1 komponent
interface BeginnerIsland1Props {
  onClick?: () => void;
}

// Komponent pre beginner ostrov c. 1
export default function BeginnerIsland1(props: BeginnerIsland1Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner theme 1"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p346567e0} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p3119e200} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.pacd7200} fill="#8C6239" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}