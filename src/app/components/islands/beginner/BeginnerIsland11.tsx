import svgPaths from "@/imports/beginner-island-11";

interface BeginnerIsland11Props {
  onClick?: () => void;
}

function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_28.58%_32.87%_26.08%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.4165 41.4671">
        <g>
          <path d={svgPaths.p11db700} fill="#8C6239" />
          <path d={svgPaths.p2347e300} fill="#8C6239" />
        </g>
      </svg>
    </div>
  );
}

export default function BeginnerIsland11(props: BeginnerIsland11Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="beginner theme 11"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.p226b0800} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p3fca2900} fill="#C69C6D" stroke="#8C6239" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}