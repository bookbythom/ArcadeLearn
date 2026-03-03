import streakIconPaths from "@/imports/streak_icon";

// Streak ikona komponent
export function StreakIcon() {
  const height = 25;
  const width = 19;
  
  return (
    <div 
      className="overflow-clip relative shrink-0" 
      style={{ height: height + 'px', width: width + 'px' }}
    >
      <div className="absolute contents inset-0">
        <svg 
          className="block size-full" 
          fill="none" 
          preserveAspectRatio="none" 
          viewBox="0 0 27.9995 38.0007"
        >
          <g>
            <path 
              d={streakIconPaths.p1cb700} 
              fill="#FF9505" 
            />
            <path 
              d={streakIconPaths.p28faaf80} 
              fill="#FFBA05" 
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
