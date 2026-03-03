import svgPaths from "../../../imports/result_page_graph";

// Interface pre properties komponentu ResultPage
interface ResultPageProps {
  correctAnswers: number;
  totalExercises: number;
  onCheckMistakes: () => void;
  onFinish: () => void;
}

// Komponent pre zobrazenie vysledkov
export default function ResultPage(props: ResultPageProps) {
  // Vypocet ziskanych XP bodov
  const xpEarned = props.correctAnswers * 5;
  
  // Vypocet percentualneho uspesnosti
  const percentageScore = (props.correctAnswers / props.totalExercises) * 100;
  
  // Konstanty pre kruhovy indikator
  const circleRadius = 140;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashOffset = circleCircumference - (percentageScore / 100) * circleCircumference;

  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex items-center justify-center">
      {/* Hlavny kontajner - tmavo sedy zaobleny box */}
      <div className="relative w-[90vw] max-w-[999px] h-auto">
        {/* Pozadie kontajnera */}
        <div className="bg-[#212123] rounded-[46px] w-full px-16 py-16">
          
          {/* Kruhovy indikator progresu */}
          <div className="flex justify-center mb-12">
            <div className="relative w-[296px] h-[296px]">
              {/* SVG kruhovy progres */}
              <div className="absolute inset-0 -rotate-90">
                <svg className="block size-full" fill="none" viewBox="0 0 296 296">
                  {/* Pozadie sedy kruh */}
                  <path 
                    d={svgPaths.p159523c0} 
                    stroke="#D9D9D9" 
                    strokeWidth="16" 
                    fill="none"
                  />
                  {/* Progres zeleny kruh */}
                  <circle
                    cx="148"
                    cy="148"
                    r={circleRadius}
                    fill="none"
                    stroke="#4CB025"
                    strokeWidth="16"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashOffset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1s ease-in-out',
                    }}
                  />
                </svg>
              </div>
              
              {/* Text so skore v strede */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-['Inter:Bold',sans-serif] font-bold text-white text-[clamp(50px,8vw,80px)] leading-[1.5]">
                  {props.correctAnswers}/{props.totalExercises}
                </p>
              </div>
            </div>
          </div>

          {/* Kontajner s tlacidlami */}
          <div className="flex flex-nowrap items-center justify-center gap-6">
            {/* XP Tlacidlo (Zlte) */}
            <button
              className="bg-[#ffe76f] rounded-[24px] px-8 py-5 transition-colors cursor-default flex-shrink-0"
              disabled
            >
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[#c99e00] text-[clamp(18px,3vw,32px)] leading-[1.5]">
                +{xpEarned}xp
              </p>
            </button>

            {/* Tlacidlo kontroly chyb (len ak nie je perfektne skore) */}
            {props.correctAnswers < props.totalExercises && (
              <button
                onClick={props.onCheckMistakes}
                className="bg-[#ff7d7d] rounded-[24px] px-8 py-5 hover:bg-[#ff6b6b] transition-colors flex-shrink-0"
              >
                <p className="font-['Inter:Bold',sans-serif] font-bold text-[#bb2323] text-[clamp(18px,3vw,32px)] leading-[1.5] whitespace-nowrap">
                  Check Mistakes
                </p>
              </button>
            )}

            {/* Tlacidlo FINISH (Biele) */}
            <button
              onClick={props.onFinish}
              className="bg-white rounded-[24px] px-8 py-5 hover:bg-[#f0f0f0] transition-colors flex-shrink-0"
            >
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[#222224] text-[clamp(18px,3vw,32px)] leading-[1.5]">
                FINISH
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}