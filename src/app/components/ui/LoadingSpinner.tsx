// Loading spinner komponent
export function LoadingSpinner() {
  const spinnerSize = 80;
  const circleRadius = 32;
  const strokeWidth = 6;
  const color = '#4cb025';
  
  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex items-center justify-center">
      <div className="relative">
        <svg 
          className="animate-spin" 
          width={spinnerSize} 
          height={spinnerSize} 
          viewBox={'0 0 ' + spinnerSize + ' ' + spinnerSize}
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={circleRadius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="160"
            strokeDashoffset="40"
          />
        </svg>
      </div>
    </div>
  );
}
