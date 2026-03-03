import svgPaths from "@/imports/professional-island-08";

interface ProfessionalIsland8Props {
  onClick?: () => void;
}

export default function ProfessionalIsland8(props: ProfessionalIsland8Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 8"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 92.9998">
            <g>
              <g>
                <path d={svgPaths.p2a466380} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <path d={svgPaths.p36c0000} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>
              <path d={svgPaths.p11036500} fill="#582DFF" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}