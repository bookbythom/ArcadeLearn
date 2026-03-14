import { useEffect } from 'react';

// Vlastnosti pre ExerciseTypePopup komponent
interface ExerciseTypePopupProps {
  exerciseType: string;
  onClose: () => void;
}

// Komponent pre popup s typom cvicenia
export default function ExerciseTypePopup(props: ExerciseTypePopupProps) {
  // Automaticky zatvor popup po 3 sekundach
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [props.onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-4" 
      onClick={props.onClose}
    >
      <div 
        className="bg-[#212123] rounded-[30px] sm:rounded-[46px] px-6 sm:px-14 lg:px-32 py-8 sm:py-14 lg:py-24 w-full max-w-[760px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center">
          Exercise Type
        </h2>
        <p className="text-[#4cb025] text-2xl sm:text-3xl lg:text-4xl text-center font-bold break-words">
          {props.exerciseType}
        </p>
      </div>
    </div>
  );
}