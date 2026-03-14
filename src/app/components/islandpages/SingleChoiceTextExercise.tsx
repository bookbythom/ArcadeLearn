import { useState, useEffect, useMemo } from "react";
import svgPaths from "../../../imports/exercise-elements";
import useViewportScale from "@/app/utils/useViewportScale";

// Rozhranie pre vlastnosti komponentu SingleChoiceTextExercise
interface SingleChoiceTextExerciseProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onNext: () => void;
  onBack: () => void;
  currentSlide: number;
  totalSlides: number;
  initialSelectedOption?: number | null;
  initialIsSubmitted?: boolean;
  onStateChange?: (selectedOption: number | null, isSubmitted: boolean) => void;
  isLastExercise?: boolean;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  hideBackButton?: boolean;
}

// Komponent pre textove cvicenie s jednou moznostou
export default function SingleChoiceTextExercise(props: SingleChoiceTextExerciseProps) {
  const viewportScale = useViewportScale({ baseHeight: 980, minScale: 0.66 });

  // Pomieshaj moznosti raz pri mount komponente alebo ked sa zmenia moznosti
  const shuffledData = useMemo(() => {
    const indicesArray = props.options.map((_, index) => index);
    
    // Fisher-Yates shuffle algoritmus
    for (let i = indicesArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = indicesArray[i];
      indicesArray[i] = indicesArray[randomIndex];
      indicesArray[randomIndex] = temp;
    }
    
    // Mapa originalneho indexu na pomieshany index
    const indexMap = new Map<number, number>();
    indicesArray.forEach((originalIndex, shuffledIndex) => {
      indexMap.set(originalIndex, shuffledIndex);
    });
    
    return {
      shuffledOptions: indicesArray.map(i => props.options[i]),
      indexMap: indexMap
    };
  }, [props.options.join(',')]);

  // State premenne
  const [selectedOption, setSelectedOption] = useState<number | null>(
    props.initialSelectedOption !== null ? shuffledData.indexMap.get(props.initialSelectedOption || 0) ?? null : null
  );
  const [isSubmitted, setIsSubmitted] = useState(props.initialIsSubmitted || false);

  // Funkcia pre odoslanie odpovede
  const handleSubmitButton = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
      
      // Konverzia pomieshaneho indexu spat na originalny index
      const originalIndex = Array.from(shuffledData.indexMap.entries()).find(([_, shuffled]) => shuffled === selectedOption)?.[0];
      
      if (props.onStateChange && originalIndex !== undefined) {
        props.onStateChange(originalIndex, true);
      }
      if (props.onAnswerSubmit && originalIndex !== undefined) {
        const isCorrect = originalIndex === props.correctAnswer;
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
  }, [selectedOption, isSubmitted, props.onAnswerSubmit]);

  // Funkcia pre kliknutie na moznost
  const handleOptionClick = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
      
      // Konverzia pomieshaneho indexu spat na originalny index
      const originalIndex = Array.from(shuffledData.indexMap.entries()).find(([_, shuffled]) => shuffled === index)?.[0];
      
      if (props.onStateChange && originalIndex !== undefined) {
        props.onStateChange(originalIndex, false);
      }
    }
  };

  // Funkcia pre farbu pozadia tlacidla
  const getOptionBackgroundColor = (index: number) => {
    const idleColors = ['#00bbff', '#ff0090', '#582dff', '#ffae00'];
    
    if (!isSubmitted) {
      return idleColors[index % 4];
    }
    
    // Ziskaj pomieshany index spravnej odpovede
    const correctAnswerShuffledIndex = shuffledData.indexMap.get(props.correctAnswer);
    
    if (index === correctAnswerShuffledIndex) {
      return "#4cb025";
    }
    if (index === selectedOption && index !== correctAnswerShuffledIndex) {
      return "#ec4545";
    }
    return "#ffffff";
  };

  // Funkcia pre farbu textu tlacidla
  const getOptionTextColor = (index: number) => {
    if (!isSubmitted) {
      return "#ffffff";
    }
    
    const correctAnswerShuffledIndex = shuffledData.indexMap.get(props.correctAnswer);
    
    if (index === correctAnswerShuffledIndex || (index === selectedOption && index !== correctAnswerShuffledIndex)) {
      return "#ffffff";
    }
    return "#222224";
  };

  // Funkcia pre box shadow tlacidla
  const getOptionBoxShadow = (index: number) => {
    if (!isSubmitted && index === selectedOption) {
      return "inset 0 0 0 4px white";
    }
    
    const correctAnswerShuffledIndex = shuffledData.indexMap.get(props.correctAnswer);
    
    if (isSubmitted && index === correctAnswerShuffledIndex && index !== selectedOption) {
      return "inset 0 0 0 4px #4cb025";
    }
    return "none";
  };

  // Pomocna funkcia pre ziskanie font family na zaklade textu moznosti
  const getFontFamily = (option: string): string => {
    const optionLower = option.toLowerCase();
    
    if (optionLower.includes('times new roman')) return '"Times New Roman", serif';
    if (optionLower.includes('arial')) return 'Arial, sans-serif';
    if (optionLower.includes('georgia')) return 'Georgia, serif';
    if (optionLower.includes('helvetica')) return 'Helvetica, Arial, sans-serif';
    if (optionLower.includes('monospace') || optionLower.includes('kuriér')) return '"Courier New", monospace';
    if (optionLower.includes('verdana')) return 'Verdana, sans-serif';
    if (optionLower.includes('tahoma')) return 'Tahoma, sans-serif';
    if (optionLower.includes('trebuchet')) return '"Trebuchet MS", sans-serif';
    if (optionLower.includes('palatino')) return 'Palatino, serif';
    if (optionLower.includes('garamond')) return 'Garamond, serif';
    if (optionLower.includes('bookman')) return '"Bookman Old Style", serif';
    if (optionLower.includes('comic sans')) return '"Comic Sans MS", cursive';
    
    // Kategorie fontov
    if (optionLower.includes('sans-serif') || optionLower.includes('bezpätkové') || optionLower.includes('bezpatkove')) {
      return 'Arial, Helvetica, sans-serif';
    }
    if (optionLower.includes('serif') || optionLower.includes('pätkové') || optionLower.includes('patkove')) {
      return '"Georgia", serif';
    }
    if (optionLower.includes('script') || optionLower.includes('skriptové') || optionLower.includes('skriptove')) {
      return 'cursive';
    }
    if (optionLower.includes('decorative') || optionLower.includes('dekoratívne') || optionLower.includes('dekorativne')) {
      return 'fantasy';
    }
    
    // Defaultna hodnota
    return '"Inter:Bold", sans-serif';
  };

  // Pomocna funkcia pre ziskanie dynamickej velkosti pisma na zaklade dlzky textu
  const getDynamicOptionFontSize = (option: string): string => {
    const length = option.length;
    if (length > 60) return 'text-[28px]';
    if (length > 40) return 'text-[32px]';
    if (length > 25) return 'text-[36px]';
    return 'text-[40px]';
  };

  const getDynamicOptionLineHeight = (option: string): string => {
    const length = option.length;
    if (length > 60) return 'leading-[1.3]';
    if (length > 40) return 'leading-[1.3]';
    if (length > 25) return 'leading-[1.3]';
    return 'leading-[1.25]';
  };

  // Funkcia pre dynamicku velkost pisma otazky
  const getDynamicQuestionFontSize = () => {
    const totalLength = props.question.length;
    if (totalLength < 100) return 'text-[47.95px]';
    if (totalLength < 180) return 'text-[38px]';
    if (totalLength < 280) return 'text-[32px]';
    if (totalLength < 400) return 'text-[26px]';
    return 'text-[22px]';
  };

  const getDynamicQuestionLineHeight = () => {
    return 'leading-[1.5]';
  };

  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] overflow-hidden">
      <div
        className="absolute top-0 left-1/2"
        style={{
          width: `${100 / viewportScale}%`,
          height: `${100 / viewportScale}%`,
          transform: `translateX(-50%) scale(${viewportScale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="relative h-full flex flex-col">
      {/* Hlavny obsah - vertikalne centrovaný */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-4 sm:px-8 lg:px-12 pb-[120px] pt-4 overflow-y-auto">
        {/* Otazka s pozadim obdlznika - Fixna vyska na desktope */}
        <div className="w-full max-w-[1208px] mb-6 lg:mb-[50px] flex-shrink-0">
          <div className="bg-[#212123] rounded-[38px] px-6 sm:px-10 lg:px-[80px] py-0 min-h-[220px] h-[min(492px,48vh)] flex items-center justify-center overflow-auto">
            <p className={`font-normal ${getDynamicQuestionFontSize()} ${getDynamicQuestionLineHeight()} text-center text-white whitespace-pre-wrap`}>
              {props.question}
            </p>
          </div>
        </div>

        {/* Grid s moznostami - Fixna pozicia na desktope */}
        <div className="w-full max-w-[1294px] grid grid-cols-2 gap-[16px]">
          {shuffledData.shuffledOptions.map((option, index) => {
            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSubmitted}
                className="h-[88px] sm:h-[104px] lg:h-[120px] rounded-[18px] flex items-center justify-center transition-all duration-200 hover:opacity-90 px-4 py-2"
                style={{
                  backgroundColor: getOptionBackgroundColor(index),
                  boxShadow: getOptionBoxShadow(index),
                  cursor: isSubmitted ? 'default' : 'pointer',
                }}
              >
                <p
                  className={`font-bold ${getDynamicOptionFontSize(option)} ${getDynamicOptionLineHeight(option)} text-center break-words`}
                  style={{ color: getOptionTextColor(index), fontFamily: getFontFamily(option) }}
                >
                  {option}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spodna navigacia */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#4e4e57]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="h-[clamp(84px,11vh,110px)] flex items-center justify-between gap-4">
            {/* Tlacidlo Back */}
            {!props.hideBackButton ? (
              <button
                onClick={props.onBack}
                className="bg-[#ec4545] hover:bg-[#d63939] text-white font-bold text-[clamp(16px,2vw,20.55px)] rounded-[15px] transition-colors px-6 h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] flex items-center justify-center whitespace-nowrap flex-shrink-0 leading-none"
              >
                ← Back
              </button>
            ) : (
              <div className="w-[140px] sm:w-[155px] flex-shrink-0" />
            )}

            {/* Progress bodky */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-[50px] flex-1 overflow-x-auto px-1">
              {Array.from({ length: props.totalSlides }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="w-[24px] h-[24px]">
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

            {/* Tlacidlo Odoslat/Dalsi */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitButton}
                disabled={selectedOption === null}
                className={`h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0 ${
                  selectedOption === null ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-[#4cb025] hover:bg-[#5cc030]"
                }`}
              >
                <p className="font-bold text-[20.55px] text-center text-white">
                  Submit
                </p>
                <div className="w-[29px] h-[23px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 29 23">
                    <path d={svgPaths.pf95e080} fill="white" />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                onClick={props.onNext}
                className="bg-[#4cb025] hover:bg-[#5cc030] h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0"
              >
                <p className="font-bold text-[20.55px] text-center text-white">
                  {props.isLastExercise ? 'Finish' : 'Next →'}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}