import svgPaths from "../../../imports/result_page_graph";
import useViewportScale from "@/app/utils/useViewportScale";

// Rozhranie pre vlastnosti komponentu ResultPage
interface ResultPageProps {
  correctAnswers: number;
  totalExercises: number;
  xpEarned: number;
  onCheckMistakes: () => void;
  onFinish: () => void;
}

// Komponent pre zobrazenie vysledkov
export default function ResultPage(props: ResultPageProps) {
  const { correctAnswers, totalExercises, xpEarned, onCheckMistakes, onFinish } = props;
  const viewportScale = useViewportScale({ baseHeight: 930, minScale: 0.7 });

  // Vypocet percentualneho uspesnosti
  const percentageScore = totalExercises > 0 ? (correctAnswers / totalExercises) * 100 : 0;
  
  // Konstanty pre kruhovy indikator
  const circleRadius = 140;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashOffset = circleCircumference - (percentageScore / 100) * circleCircumference;

  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-6">
      {/* Hlavny kontajner - tmavo sedy zaobleny box */}
      <div
        className="relative w-[90vw] max-w-[999px] h-auto my-auto"
        style={{
          transform: `scale(${viewportScale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Pozadie kontajnera */}
        <div className="bg-[#212123] rounded-[46px] w-full px-6 sm:px-10 lg:px-16 py-6 sm:py-10 lg:py-16">
          
          {/* Kruhovy indikator progresu */}
          <div className="flex justify-center mb-6 sm:mb-10 lg:mb-12">
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] lg:w-[296px] lg:h-[296px]">
              {/* Kruhovy progres v SVG */}
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
                <p className="font-bold text-white text-[clamp(50px,8vw,80px)] leading-[1.5]">
                  {correctAnswers}/{totalExercises}
                </p>
              </div>
            </div>
          </div>

          {/* Kontajner s tlacidlami */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {/* XP Tlacidlo (Zlte) */}
            <button
              className="bg-[#ffe76f] rounded-[20px] sm:rounded-[24px] px-5 sm:px-8 py-3 sm:py-5 transition-colors cursor-default flex-shrink-0 min-w-[130px]"
              disabled
            >
              <p className="font-bold text-[#c99e00] text-[clamp(16px,3vw,32px)] leading-[1.4]">
                +{xpEarned}xp
              </p>
            </button>

            {/* Tlacidlo kontroly chyb (len ak nie je perfektne skore) */}
            {correctAnswers < totalExercises && (
              <button
                onClick={onCheckMistakes}
                className="bg-[#ff7d7d] rounded-[20px] sm:rounded-[24px] px-5 sm:px-8 py-3 sm:py-5 hover:bg-[#ff6b6b] transition-colors flex-shrink-0 min-w-[180px]"
              >
                <p className="font-bold text-[#bb2323] text-[clamp(16px,3vw,32px)] leading-[1.4] whitespace-nowrap">
                  Check Mistakes
                </p>
              </button>
            )}

            {/* Tlacidlo FINISH (Biele) */}
            <button
              onClick={onFinish}
              className="bg-white rounded-[20px] sm:rounded-[24px] px-5 sm:px-8 py-3 sm:py-5 hover:bg-[#f0f0f0] transition-colors flex-shrink-0 min-w-[130px]"
            >
              <p className="font-bold text-[#222224] text-[clamp(16px,3vw,32px)] leading-[1.4]">
                FINISH
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}