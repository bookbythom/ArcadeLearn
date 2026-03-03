import svgPaths from "@/imports/professional-test-island";

interface ProfessionalTestIslandProps {
  onClick?: () => void;
}

export default function ProfessionalTestIsland(props: ProfessionalTestIslandProps) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional final test"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p2e826c72} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p18c29a30} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p2ad21d00} fill="#582DFF" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}