import svgPaths from "@/imports/island-completed-green";

interface CompletedIslandGreenProps {
  onClick?: () => void;
}

export default function CompletedIslandGreen(props: CompletedIslandGreenProps) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="completed island with mistakes"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <g>
                <path d={svgPaths.p346567e0} fill="#62BB46" stroke="#3B9346" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p5f9b900} fill="#62BB46" stroke="#3B9346" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p3946c000} fill="#3B9346" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}