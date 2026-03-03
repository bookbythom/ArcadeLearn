import svgPaths from "@/imports/beginner-island-07";

// Properties pre BeginnerIsland7 komponent
interface BeginnerIsland7Props {
  onClick?: () => void;
}

// Komponent pre beginner ostrov c. 7
export default function BeginnerIsland7(props: BeginnerIsland7Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner theme 7"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p345afc80} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p29ae0e80} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p366e7180} fill="#8C6239" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}