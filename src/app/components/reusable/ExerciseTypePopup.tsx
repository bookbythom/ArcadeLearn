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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120]" 
      onClick={props.onClose}
    >
      <div 
        className="bg-[#212123] rounded-[46px] px-32 py-24 max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-6xl font-bold mb-8 text-center">
          Exercise Type
        </h2>
        <p className="text-[#4cb025] text-4xl text-center font-bold">
          {props.exerciseType}
        </p>
      </div>
    </div>
  );
}