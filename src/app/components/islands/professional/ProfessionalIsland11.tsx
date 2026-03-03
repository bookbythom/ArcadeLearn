import svgPaths from "@/imports/professional-island-11";

// Properties pre ProfessionalIsland11 komponent
interface ProfessionalIsland11Props {
  onClick?: () => void;
}

// Pomocny komponent pre dodatocnu grafiku
function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_28.58%_32.87%_26.07%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.4194 41.4674">
        <g>
          <path d={svgPaths.p11e4fa00} fill="#582DFF" />
          <path d={svgPaths.p5e0de00} fill="#582DFF" />
        </g>
      </svg>
    </div>
  );
}

// Komponent pre professional ostrov c. 11
export default function ProfessionalIsland11(props: ProfessionalIsland11Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 11"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 92.9998">
            <g>
              <path d={svgPaths.p166e5800} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p13100300} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}