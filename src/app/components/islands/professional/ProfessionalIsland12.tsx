import svgPaths from "@/imports/professional-island-12";

interface ProfessionalIsland12Props {
  onClick?: () => void;
}

function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_20.64%_32.87%_18.19%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.4083 41.4675">
        <g>
          <path d={svgPaths.pc476a00} fill="#582DFF" />
          <path d={svgPaths.p6f94100} fill="#582DFF" />
        </g>
      </svg>
    </div>
  );
}

export default function ProfessionalIsland12(props: ProfessionalIsland12Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 12"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0001">
            <g>
              <path d={svgPaths.p175df500} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p217d4300} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}