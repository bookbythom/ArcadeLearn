import svgPaths from "@/imports/intermediate-island-05";

interface IntermediateIsland5Props {
  onClick?: () => void;
}

export default function IntermediateIsland5(props: IntermediateIsland5Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="intermediate theme 5"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 92.9998">
            <g>
              <g>
                <path d={svgPaths.p25635280} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p2c09f380} fill="#EC4545" stroke="#AF4545" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.pd89ec80} fill="#AF4545" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}