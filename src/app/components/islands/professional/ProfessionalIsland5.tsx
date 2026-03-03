import svgPaths from "@/imports/professional-island-05";

interface ProfessionalIsland5Props {
  onClick?: () => void;
}

export default function ProfessionalIsland5(props: ProfessionalIsland5Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 5"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p237080} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p10711600} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p3a519ac0} fill="#582DFF" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}