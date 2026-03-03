import svgPaths from "@/imports/professional-island-10";

// Properties pre ProfessionalIsland10 komponent
interface ProfessionalIsland10Props {
  onClick?: () => void;
}

// Pomocny komponent pre dodatocnu grafiku
function GroupComponent() {
  return (
    <div className="absolute inset-[21.05%_20.72%_31.46%_18.32%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.1522 42.7388">
        <g>
          <path d={svgPaths.p2e9c600} fill="#582DFF" />
          <path d={svgPaths.p3e7ea100} fill="#582DFF" />
        </g>
      </svg>
    </div>
  );
}

// Komponent pre professional ostrov c. 10
export default function ProfessionalIsland10(props: ProfessionalIsland10Props) {
  return (
    <button
      onClick={props.onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 w-28 h-24"
      aria-label="professional theme 10"
    >
      <div className="relative size-full">
        <div className="absolute inset-[-1.67%_-1.25%]">
          <svg className="block size-full drop-shadow-lg" fill="none" preserveAspectRatio="none" viewBox="0 0 123 93">
            <g>
              <path d={svgPaths.p3f247e40} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.pfcd1410} fill="#6E44FF" stroke="#582DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
        <GroupComponent />
      </div>
    </button>
  );
}