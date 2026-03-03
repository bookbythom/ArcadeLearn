import { useState, useEffect } from "react";
import svgPaths from "../../../imports/exercise-elements";

// Interface pre properties komponentu TrueFalseExercise
interface TrueFalseExerciseProps {
  question: string;
  options: string[];
  correctAnswer: boolean;
  onNext: () => void;
  onBack: () => void;
  currentSlide: number;
  totalSlides: number;
  initialSelectedOption?: boolean | null;
  initialIsSubmitted?: boolean;
  onStateChange?: (selectedOption: boolean | null, isSubmitted: boolean) => void;
  isLastExercise?: boolean;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  isReviewMode?: boolean;
  hideBackButton?: boolean;
}

// Komponent pre True/False cvicenie
export default function TrueFalseExercise(props: TrueFalseExerciseProps) {
  // State premenne
  const [selectedOption, setSelectedOption] = useState<boolean | null>(props.initialSelectedOption || null);
  const [isSubmitted, setIsSubmitted] = useState(props.initialIsSubmitted || false);

  // Konverzia spravnej odpovede na boolean
  const correctAnswerBoolean = Boolean(props.correctAnswer);

  // Funkcia pre odeslanie odpovede
  const handleSubmitButton = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
      if (props.onStateChange) {
        props.onStateChange(selectedOption, true);
      }
      if (props.onAnswerSubmit) {
        const isCorrect = selectedOption === correctAnswerBoolean;
        props.onAnswerSubmit(isCorrect);
      }
    }
  };

  // Spracovanie stlacenia klavesy Enter
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!isSubmitted && selectedOption !== null) {
          handleSubmitButton();
        } else if (isSubmitted) {
          props.onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, isSubmitted, props.onAnswerSubmit, props.correctAnswer]);

  // Funkcia pre kliknutie na moznost
  const handleOptionClick = (value: boolean) => {
    if (!isSubmitted) {
      setSelectedOption(value);
      if (props.onStateChange) {
        props.onStateChange(value, false);
      }
    }
  };

  // Funkcia pre farbu pozadia tlacidla
  const getOptionBackgroundColor = (value: boolean) => {
    if (!isSubmitted) {
      // Pred odoslanim, zobraz originalne farby (modra pre True, ruzova pre False)
      return value ? '#00bbff' : '#ff0090';
    }
    
    // Po odoslani - zobraz feedback pre obe tlacidla
    const isUserAnswer = value === selectedOption;
    const isCorrect = value === correctAnswerBoolean;
    
    if (isCorrect) {
      // Vzdy zobraz spravnu odpoved zeleno
      return "#4cb025";
    }
    
    if (isUserAnswer && !isCorrect) {
      // Zobraz uzivatelovu zlu odpoved cerveno
      return "#ec4545";
    }
    
    // Ina moznost (nevybrata, nespravna) zostava biela
    return "#ffffff";
  };

  // Funkcia pre farbu textu tlacidla
  const getOptionTextColor = (value: boolean) => {
    if (!isSubmitted) {
      // Pred odoslanim, vsetky moznosti maju biely text
      return "#ffffff";
    }
    
    // Po odoslani
    const isUserAnswer = value === selectedOption;
    const isCorrect = value === correctAnswerBoolean;
    
    // Spravna odpoved a zla vybrata odpoved maju biely text
    if (isCorrect || (isUserAnswer && !isCorrect)) {
      return "#ffffff";
    }
    
    // Ine moznosti maju tmavy text
    return "#222224";
  };

  // Funkcia pre box shadow tlacidla
  const getOptionBoxShadow = (value: boolean) => {
    if (!isSubmitted && value === selectedOption) {
      return "inset 0 0 0 4px white";
    }
    return "none";
  };

  // Funkcia pre dynamicku velkost pisma
  const getDynamicFontSize = () => {
    const totalLength = props.question.length;
    if (totalLength < 100) return 'text-[32px] sm:text-[52px]';
    if (totalLength < 180) return 'text-[28px] sm:text-[42px]';
    if (totalLength < 280) return 'text-[24px] sm:text-[34px]';
    if (totalLength < 400) return 'text-[21px] sm:text-[28px]';
    return 'text-[18px] sm:text-[24px]';
  };

  // Funkcia pre dynamicku vysku riadku
  const getDynamicLineHeight = () => {
    return 'leading-[1.5]';
  };

  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex flex-col overflow-y-auto overscroll-y-contain touch-pan-y">
      {/* Hlavny obsah - vertikalne centrovaný */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 pb-[96px] sm:pb-[110px] pt-4 overflow-y-auto">
        {/* Otazka s pozadim obdlznika - Fixna vyska na desktope */}
        <div className="w-full max-w-[1214px] mb-8 sm:mb-[100px] flex-shrink-0">
          <div className="bg-[#212123] rounded-[20px] sm:rounded-[38px] px-4 sm:px-8 lg:px-[80px] py-6 sm:py-0 min-h-[240px] sm:h-[492px] flex items-center justify-center overflow-auto">
            <p className={`font-['Inter:Regular',sans-serif] font-normal ${getDynamicFontSize()} ${getDynamicLineHeight()} text-center text-white whitespace-pre-wrap`}>
              {props.question}
            </p>
          </div>
        </div>

        {/* Tlacidla True/False */}
        <div className="w-full max-w-[1242px] grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-[16px]">
          {/* Tlacidlo True (Vlavo) */}
          <button
            onClick={() => handleOptionClick(true)}
            disabled={isSubmitted}
            className="rounded-[18px] sm:rounded-[25px] min-h-[84px] sm:h-[137px] flex items-center justify-center transition-all duration-200 hover:opacity-90 px-3"
            style={{
              backgroundColor: getOptionBackgroundColor(true),
              boxShadow: getOptionBoxShadow(true),
              cursor: isSubmitted ? 'default' : 'pointer',
            }}
          >
            <p
              className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[30px] sm:text-[40px] leading-[1.3] text-center"
              style={{ color: getOptionTextColor(true) }}
            >
              {props.options[0]}
            </p>
          </button>

          {/* Tlacidlo False (Vpravo) */}
          <button
            onClick={() => handleOptionClick(false)}
            disabled={isSubmitted}
            className="rounded-[18px] sm:rounded-[25px] min-h-[84px] sm:h-[137px] flex items-center justify-center transition-all duration-200 hover:opacity-90 px-3"
            style={{
              backgroundColor: getOptionBackgroundColor(false),
              boxShadow: getOptionBoxShadow(false),
              cursor: isSubmitted ? 'default' : 'pointer',
            }}
          >
            <p
              className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[30px] sm:text-[40px] leading-[1.3] text-center"
              style={{ color: getOptionTextColor(false) }}
            >
              {props.options[1]}
            </p>
          </button>
        </div>
      </div>

      {/* Spodna navigacia */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#4e4e57] pb-[env(safe-area-inset-bottom)]">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-16">
          <div className="min-h-[88px] sm:h-[110px] py-3 sm:py-0 flex items-center justify-between gap-2 sm:gap-4">
            {/* Tlacidlo Back */}
            {!props.hideBackButton ? (
              <button
                onClick={props.onBack}
                className="bg-[#ec4545] hover:bg-[#d63939] text-white font-['Inter:Bold',sans-serif] font-bold text-[13px] sm:text-[20.55px] rounded-[12px] sm:rounded-[15px] transition-colors px-3 sm:px-6 h-[46px] sm:h-[54px] w-[96px] sm:w-[155px] flex items-center justify-center whitespace-nowrap flex-shrink-0"
              >
                ← Back
              </button>
            ) : (
              <div className="w-[96px] sm:w-[155px] flex-shrink-0" />
            )}

            {/* Progress bodky */}
            <div className="flex items-center justify-center gap-6 sm:gap-[50px] flex-1 overflow-x-auto px-1">
              {Array.from({ length: props.totalSlides }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="w-4 h-4 sm:w-[24px] sm:h-[24px]">
                    <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                      <path
                        d={svgPaths.p1c665200}
                        fill={index === props.currentSlide ? "#4CB025" : "#D9D9D9"}
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Tlacidlo Submit/Next */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitButton}
                disabled={selectedOption === null}
                className={`h-[46px] sm:h-[54px] w-[96px] sm:w-[155px] rounded-[12px] sm:rounded-[15px] px-3 sm:px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0 ${
                  selectedOption === null ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-[#4cb025] hover:bg-[#5cc030]"
                }`}
              >
                <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] sm:text-[20.55px] text-center text-white">
                  Submit
                </p>
                <div className="w-[22px] h-[18px] sm:w-[29px] sm:h-[23px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 29 23">
                    <path d={svgPaths.pf95e080} fill="white" />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                onClick={props.onNext}
                className="bg-[#4cb025] hover:bg-[#5cc030] h-[46px] sm:h-[54px] w-[96px] sm:w-[155px] rounded-[12px] sm:rounded-[15px] px-3 sm:px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0"
              >
                <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] sm:text-[20.55px] text-center text-white">
                  {props.isLastExercise ? 'Finish' : 'Next →'}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}