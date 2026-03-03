import svgPaths from "@/imports/professional-island-01";

// Properties pre ProfessionalIsland1 komponent
interface ProfessionalIsland1Props {
  onClick?: () => void;
}

// Komponent pre professional ostrov c. 1
export default function ProfessionalIsland1(props: ProfessionalIsland1Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 1"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93.0002">
            <g>
              <g>
                <path d={svgPaths.p346567e0} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.pe5cc800} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p2d787e00} fill="#582DFF" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}