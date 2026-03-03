import svgPaths from "@/imports/professional-island-07";

// Properties pre ProfessionalIsland7 komponent
interface ProfessionalIsland7Props {
  onClick?: () => void;
}

// Komponent pre professional ostrov c. 7
export default function ProfessionalIsland7(props: ProfessionalIsland7Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 7"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <g>
                <path d={svgPaths.p2dfad0f0} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p13587200} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p3303f880} fill="#582DFF" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}