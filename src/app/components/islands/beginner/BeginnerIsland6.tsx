import svgPaths from "@/imports/beginner-island-06";

interface BeginnerIsland6Props {
  onClick?: () => void;
}

export default function BeginnerIsland6(props: BeginnerIsland6Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner theme 6"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p33744a00} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p2ac46e80} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.pb7f8180} fill="#8C6239" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}