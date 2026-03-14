import { useState, useEffect, useMemo } from "react";
import svgPaths from "../../../imports/exercise-elements";
import useViewportScale from "@/app/utils/useViewportScale";

// Rozhranie pre props komponentu ChooseCorrectOptionExercise
interface ChooseCorrectOptionExerciseProps {
  question: string;
  options: string[];
  correctAnswer: { [key: number]: string };
  onNext: () => void;
  onBack: () => void;
  currentSlide: number;
  totalSlides: number;
  initialSelectedOptions?: { [key: number]: string };
  initialIsSubmitted?: boolean;
  onStateChange?: (selectedOptions: { [key: number]: string }, isSubmitted: boolean) => void;
  isLastExercise?: boolean;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  isReviewMode?: boolean;
  hideBackButton?: boolean;
}

// Komponent pre vyber spravnej moznosti z dropdown menu
export default function ChooseCorrectOptionExercise(props: ChooseCorrectOptionExerciseProps) {
  const viewportScale = useViewportScale({ baseHeight: 980, minScale: 0.66 });

  // Pomieshaj moznosti raz pri mount komponente alebo ked sa zmenia moznosti
  const shuffledOptions = useMemo(() => {
    const optionsCopy = [...props.options];
    
    // Fisher-Yates shuffle algoritmus
    for (let i = optionsCopy.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = optionsCopy[i];
      optionsCopy[i] = optionsCopy[randomIndex];
      optionsCopy[randomIndex] = temp;
    }
    return optionsCopy;
  }, [props.options.join(',')]);

  // State premenne
  const [selectedOption, setSelectedOption] = useState<string | null>(
    props.initialSelectedOptions?.[0] || null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(props.initialIsSubmitted || false);

  // Funkcia pre odoslanie odpovede
  const handleSubmitButton = () => {
    setIsSubmitted(true);
    if (props.onStateChange) {
      props.onStateChange({ 0: selectedOption || "" }, true);
    }
    if (props.onAnswerSubmit) {
      const isCorrect = selectedOption === props.correctAnswer[0];
      props.onAnswerSubmit(isCorrect);
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
  }, [isSubmitted, selectedOption, props.onNext]);

  // Inicializacia z props
  useEffect(() => {
    if (props.initialSelectedOptions?.[0]) {
      setSelectedOption(props.initialSelectedOptions[0]);
    }
    if (props.initialIsSubmitted !== undefined) {
      setIsSubmitted(props.initialIsSubmitted);
    }
  }, [props.initialSelectedOptions, props.initialIsSubmitted]);

  // Funkcia pre prepnutie dropdown menu
  const toggleExpandDropdown = () => {
    if (isSubmitted) return;
    setIsExpanded(!isExpanded);
  };

  // Funkcia pre vyber moznosti
  const selectOption = (option: string) => {
    if (isSubmitted) return;

    setSelectedOption(option);
    setIsExpanded(false);

    if (props.onStateChange) {
      props.onStateChange({ 0: option }, false);
    }
  };

  // Funkcia pre farbu pozadia dropdown tlacidla
  const getBackgroundColor = () => {
    if (!isSubmitted) {
      return "#d9d9d9";
    }
    return selectedOption === props.correctAnswer[0] ? "#4cb025" : "#ec4545";
  };

  // Funkcia pre parsovanie otazky
  const parseQuestion = () => {
    const parts = props.question.split("________");
    return parts;
  };

  const questionParts = parseQuestion();

  // Funkcia pre dynamicku velkost pisma otazky
  const getDynamicQuestionFontSize = () => {
    const totalLength = props.question.length;
    if (totalLength < 80) return 'text-[41.1px]';
    if (totalLength < 120) return 'text-[36px]';
    if (totalLength < 180) return 'text-[30px]';
    if (totalLength < 250) return 'text-[26px]';
    return 'text-[22px]';
  };

  const getDynamicQuestionLineHeight = () => {
    return 'leading-[1.5]';
  };

  // Funkcia pre velkost pisma moznosti
  const getOptionFontSize = (text: string) => {
    const length = text.length;
    if (length < 20) return 'text-[22px]';
    if (length < 28) return 'text-[20px]';
    if (length < 38) return 'text-[18px]';
    if (length < 50) return 'text-[17px]';
    return 'text-[16px]';
  };

  // Zatvorenie dropdown menu pri kliknuti mimo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        {/* Kontajner s otazkou - Fixna vyska na desktope */}
        <div className="w-full max-w-[1180px] mb-6 lg:mb-[50px] flex-shrink-0">
          <div className="bg-[#212123] rounded-[38px] px-6 sm:px-10 lg:px-[80px] py-0 min-h-[220px] h-[min(492px,48vh)] flex items-center justify-center overflow-auto">
            <div className="flex flex-wrap items-center justify-center gap-[8px]">
              {/* Text pred medzerou */}
              {questionParts[0] && (
                <span className={`font-normal ${getDynamicQuestionFontSize()} ${getDynamicQuestionLineHeight()} text-white text-center`}>
                  {questionParts[0]}
                </span>
              )}

              {/* Dropdown pre medzeru */}
              <div className="relative inline-block" data-dropdown>
                <button
                  onClick={toggleExpandDropdown}
                  disabled={isSubmitted}
                  className={`
                    rounded-[15px] h-[52px] sm:h-[60px] w-[min(320px,78vw)]
                    transition-all duration-200
                    ${!isSubmitted ? "cursor-pointer hover:opacity-90" : "cursor-default"}
                    flex items-center justify-center px-2
                  `}
                  style={{ backgroundColor: getBackgroundColor() }}
                >
                  {selectedOption ? (
                    <span 
                      className={`font-normal ${getOptionFontSize(selectedOption)} leading-[1.3]`}
                      style={{ color: isSubmitted ? '#ffffff' : '#323235' }}
                    >
                      {selectedOption}
                    </span>
                  ) : (
                    <span className="font-normal text-[20px] sm:text-[27.4px] leading-[1.4] text-[#666]">
                      klikni sem
                    </span>
                  )}
                </button>

                {/* Dropdown moznosti */}
                {isExpanded && !isSubmitted && (
                  <div
                    className="absolute top-0 left-0 z-[120] bg-[#d9d9d9] rounded-[15px] w-[min(320px,78vw)] p-[14px] sm:p-[20px] flex flex-col gap-[10px] sm:gap-[12px] shadow-2xl"
                    style={{ 
                      boxShadow: "0 0 0 4px #4cb025",
                    }}
                  >
                    {shuffledOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectOption(option)}
                        className="bg-white rounded-[11px] h-[44px] sm:h-[50px] hover:bg-[#4cb025] hover:text-white transition-all px-[12px] sm:px-[16px]"
                      >
                        <span className={`font-bold ${getOptionFontSize(option)} leading-[1.3]`}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text po medzere */}
              {questionParts[1] && (
                <span className={`font-normal ${getDynamicQuestionFontSize()} ${getDynamicQuestionLineHeight()} text-white text-center`}>
                  {questionParts[1]}
                </span>
              )}
            </div>
          </div>
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
                disabled={!selectedOption}
                className={`h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0 ${
                  !selectedOption ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-[#4cb025] hover:bg-[#5cc030]"
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