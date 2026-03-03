import svgPaths from "@/imports/professional-island-06";

interface ProfessionalIsland6Props {
  onClick?: () => void;
}

export default function ProfessionalIsland6(props: ProfessionalIsland6Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 6"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 92.9998">
            <g>
              <g>
                <path d={svgPaths.p2a466380} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p26dfef00} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p3d940f00} fill="#582DFF" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}