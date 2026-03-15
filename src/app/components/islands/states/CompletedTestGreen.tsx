import svgPaths from "@/imports/test-completed-green";

interface CompletedTestGreenProps {
  onClick?: () => void;
}

export default function CompletedTestGreen({ onClick }: CompletedTestGreenProps) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="completed test with mistakes"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p346567e0} fill="#62BB46" stroke="#3B9346" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p1e8b3e00} fill="#62BB46" stroke="#3B9346" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p1ae04700} fill="#3B9346" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}