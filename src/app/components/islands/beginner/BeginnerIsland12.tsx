import svgPaths from "@/imports/beginner-island-12";

interface BeginnerIsland12Props {
  onClick?: () => void;
}

function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_20.64%_32.87%_18.19%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.4083 41.4673">
        <g>
          <path d={svgPaths.pe68f300} fill="#8C6239" />
          <path d={svgPaths.p33423c00} fill="#8C6239" />
        </g>
      </svg>
    </div>
  );
}

export default function BeginnerIsland12(props: BeginnerIsland12Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner theme 12"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.pf5fa200} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p1848db00} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}