import { useState, useEffect, useMemo } from "react";
import svgPaths from "../../../imports/exercise-elements";

// Interface pre properties komponentu TextMultipleChoiceExercise
interface TextMultipleChoiceExerciseProps {
  question: string;
  options: string[];
  correctAnswer: number[];
  onNext: () => void;
  onBack: () => void;
  currentSlide: number;
  totalSlides: number;
  initialSelectedOptions?: number[];
  initialIsSubmitted?: boolean;
  onStateChange?: (selectedOptions: number[], isSubmitted: boolean) => void;
  isLastExercise?: boolean;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  hideBackButton?: boolean;
}

// Komponent pre text multiple choice cvicenie
export default function TextMultipleChoiceExercise(props: TextMultipleChoiceExerciseProps) {
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
    const reverseIndexMap = new Map<number, number>();
    indicesArray.forEach((originalIndex, shuffledIndex) => {
      indexMap.set(originalIndex, shuffledIndex);
      reverseIndexMap.set(shuffledIndex, originalIndex);
    });
    
    return {
      shuffledOptions: indicesArray.map(i => props.options[i]),
      indexMap,
      reverseIndexMap
    };
  }, [props.options.join(',')]);

  // Konvertuj initial selected options z originalnych indexov na pomieshane indexy
  const initialShuffledOptions = useMemo(() => {
    return (props.initialSelectedOptions || []).map(originalIndex => shuffledData.indexMap.get(originalIndex)).filter((idx): idx is number => idx !== undefined);
  }, [props.initialSelectedOptions, shuffledData.indexMap]);

  // State premenne
  const [selectedOptions, setSelectedOptions] = useState<number[]>(initialShuffledOptions);
  const [isSubmitted, setIsSubmitted] = useState(props.initialIsSubmitted || false);

  // Funkcia pre odoslanie odpovede
  const handleSubmitButton = () => {
    if (selectedOptions.length > 0) {
      setIsSubmitted(true);
      
      // Konvertuj pomieshane indexy spat na originalne indexy
      const originalIndices = selectedOptions.map(shuffledIdx => shuffledData.reverseIndexMap.get(shuffledIdx)).filter((idx): idx is number => idx !== undefined);
      
      if (props.onStateChange) {
        props.onStateChange(originalIndices, true);
      }
      if (props.onAnswerSubmit) {
        const isCorrect =
          originalIndices.length === props.correctAnswer.length &&
          originalIndices.every((opt) => props.correctAnswer.includes(opt));
        props.onAnswerSubmit(isCorrect);
      }
    }
  };

  // Spracovanie stlacenia klavesy Enter
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!isSubmitted && selectedOptions.length > 0) {
          handleSubmitButton();
        } else if (isSubmitted) {
          props.onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSubmitted, selectedOptions, props.onNext]);

  // Funkcia pre kliknutie na moznost
  const handleOptionClick = (shuffledIndex: number) => {
    if (!isSubmitted) {
      if (selectedOptions.includes(shuffledIndex)) {
        // Ak je moznost uz vybrata, odstran ju
        const newOptions = selectedOptions.filter((opt) => opt !== shuffledIndex);
        setSelectedOptions(newOptions);
        if (props.onStateChange) {
          // Konvertuj pomieshane indexy spat na originalne indexy
          const originalIndices = newOptions.map(idx => shuffledData.reverseIndexMap.get(idx)).filter((idx): idx is number => idx !== undefined);
          props.onStateChange(originalIndices, false);
        }
      } else {
        // Ak nie je vybrata, pridaj ju
        const newOptions = [...selectedOptions, shuffledIndex];
        setSelectedOptions(newOptions);
        if (props.onStateChange) {
          // Konvertuj pomieshane indexy spat na originalne indexy
          const originalIndices = newOptions.map(idx => shuffledData.reverseIndexMap.get(idx)).filter((idx): idx is number => idx !== undefined);
          props.onStateChange(originalIndices, false);
        }
      }
    }
  };

  // Funkcia pre ziskanie stylou moznosti
  const getOptionStyles = (shuffledIndex: number) => {
    const idleColors = ['#00bbff', '#ff0090', '#582dff', '#ffae00'];
    const isSelected = selectedOptions.includes(shuffledIndex);
    
    // Ziskaj originalny index z pomieshaneho indexu
    const originalIndex = shuffledData.reverseIndexMap.get(shuffledIndex);
    const isCorrect = originalIndex !== undefined && props.correctAnswer.includes(originalIndex);

    if (!isSubmitted) {
      return {
        background: idleColors[shuffledIndex % 4],
        textColor: "#ffffff",
        boxShadow: isSelected ? "inset 0 0 0 4px white" : "none",
      };
    }

    if (isSelected && isCorrect) {
      return {
        background: "#4cb025",
        textColor: "#ffffff",
        boxShadow: "none",
      };
    } else if (isSelected && !isCorrect) {
      return {
        background: "#ec4545",
        textColor: "#ffffff",
        boxShadow: "none",
      };
    } else if (!isSelected && isCorrect) {
      return {
        background: "#ffffff",
        textColor: "#222224",
        boxShadow: "inset 0 0 0 4px #4cb025",
      };
    }
    return {
      background: "#ffffff",
      textColor: "#222224",
      boxShadow: "none",
    };
  };

  // Pomocna funkcia pre ziskanie font family na zaklade textu moznosti
  const getFontFamily = (option: string): string => {
    const optionLower = option.toLowerCase();
    
    if (optionLower.includes('times new roman')) return '"Times New Roman", serif';
    if (optionLower.includes('arial')) return 'Arial, sans-serif';
    if (optionLower.includes('georgia')) return 'Georgia, serif';
    if (optionLower.includes('helvetica')) return 'Helvetica, Arial, sans-serif';
    if (optionLower.includes('courier') || optionLower.includes('kuriér')) return '"Courier New", monospace';
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
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex flex-col">
      {/* Hlavny obsah - vertikalne centrovaný */}
      <div className="flex-1 flex flex-col items-center justify-center px-12 pb-[110px] pt-4 overflow-y-auto">
        {/* Otazka s pozadim obdlznika - Fixna vyska na desktope */}
        <div className="w-full max-w-[1208px] mb-[50px] flex-shrink-0">
          <div className="bg-[#212123] rounded-[38px] px-[80px] py-0 h-[492px] flex items-center justify-center overflow-auto">
            <p className={`font-normal ${getDynamicQuestionFontSize()} ${getDynamicQuestionLineHeight()} text-center text-white whitespace-pre-wrap`}>
              {props.question}
            </p>
          </div>
        </div>

        {/* Grid s moznostami - Fixna pozicia na desktope */}
        <div className="w-full max-w-[1294px] grid grid-cols-2 gap-[16px]">
          {shuffledData.shuffledOptions.map((option, index) => {
            const styles = getOptionStyles(index);

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSubmitted}
                className="h-[120px] rounded-[18px] flex items-center justify-center transition-all duration-200 hover:opacity-90 px-4 py-2"
                style={{
                  backgroundColor: styles.background,
                  boxShadow: styles.boxShadow,
                  cursor: isSubmitted ? 'default' : 'pointer',
                }}
              >
                <p
                  className={`font-bold ${getDynamicOptionFontSize(option)} ${getDynamicOptionLineHeight(option)} text-center break-words`}
                  style={{ color: styles.textColor, fontFamily: getFontFamily(option) }}
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
        <div className="w-full max-w-[1920px] mx-auto px-16">
          <div className="h-[110px] flex items-center justify-between gap-4">
            {/* Tlacidlo Back */}
            {!props.hideBackButton ? (
              <button
                onClick={props.onBack}
                className="bg-[#ec4545] hover:bg-[#d63939] text-white font-bold text-[20.55px] rounded-[15px] transition-colors px-6 h-[54px] w-[155px] flex items-center justify-center whitespace-nowrap flex-shrink-0"
              >
                ← Back
              </button>
            ) : (
              <div className="w-[155px] flex-shrink-0" />
            )}

            {/* Progress bodky */}
            <div className="flex items-center justify-center gap-[50px] flex-1 overflow-x-auto px-1">
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

            {/* Tlacidlo Submit/Next */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitButton}
                disabled={selectedOptions.length === 0}
                className={`h-[54px] w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0 ${
                  selectedOptions.length === 0 ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-[#4cb025] hover:bg-[#5cc030]"
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
                className="bg-[#4cb025] hover:bg-[#5cc030] h-[54px] w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0"
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
  );
}