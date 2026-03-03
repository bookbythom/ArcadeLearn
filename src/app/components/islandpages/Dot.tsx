// Interface pre properties komponentu Dot
interface DotProps {
  isActive?: boolean;
}

// Komponent pre bodku v navigacii
export function Dot(props: DotProps) {
  const isActive = props.isActive || false;
  
  // Vyber farby podla aktivneho stavu
  const dotColor = isActive ? "#4CB025" : "#D9D9D9";
  
  return (
    <div className="w-4 h-4 sm:w-[24px] sm:h-[24px] shrink-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68 68">
        <circle cx="34" cy="34" fill={dotColor} r="34" />
      </svg>
    </div>
  );
}