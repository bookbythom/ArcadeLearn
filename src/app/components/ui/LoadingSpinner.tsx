// Loading spinner komponent
interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner(props: LoadingSpinnerProps) {
  const spinnerSize = 80;
  const circleRadius = 32;
  const strokeWidth = 6;
  const color = '#4cb025';
  
  return (
    <div className={`fixed inset-0 bg-[#1c1c1e] grid place-items-center ${props.className || 'z-[105]'}`}>
      <svg 
        className="animate-spin" 
        width={spinnerSize} 
        height={spinnerSize} 
        viewBox={'0 0 ' + spinnerSize + ' ' + spinnerSize}
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
  );
}
