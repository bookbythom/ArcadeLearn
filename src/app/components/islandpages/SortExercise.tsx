import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import svgPaths from "../../../imports/exercise-elements";
import useViewportScale from "@/app/utils/useViewportScale";

// Rozhranie pre vlastnosti komponentu SortExercise
interface SortExerciseProps {
  question: string;
  options: string[];
  correctAnswer: string[] | number[]; // Moze byt pole stringov alebo pole indexov
  categories?: string[]; // Volitelne kategorie na lavej strane
  onNext: () => void;
  onBack: () => void;
  currentSlide: number;
  totalSlides: number;
  initialItemOrder?: DraggableItem[];
  initialIsSubmitted?: boolean;
  onStateChange?: (itemOrder: DraggableItem[], isSubmitted: boolean) => void;
  isLastExercise?: boolean;
  onAnswerSubmit?: (isCorrect: boolean) => void;
  isReviewMode?: boolean;
  hideBackButton?: boolean;
}

// Rozhranie pre draggable polozku
interface DraggableItem {
  id: string;
  label: string;
  position: number;
}

const ItemType = "SORT_ITEM";

// Komponent pre draggable polozku
function DraggableItemComponent(props: {
  item: DraggableItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  isSubmitted: boolean;
  correctIndex: number;
  categories?: string[];
}) {
  // Hook pre drag
  const [dragState, dragRef] = useDrag({
    type: ItemType,
    item: { index: props.index },
    canDrag: !props.isSubmitted,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Hook pre drop
  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== props.index) {
        props.moveItem(draggedItem.index, props.index);
        draggedItem.index = props.index;
      }
    },
    canDrop: () => !props.isSubmitted,
  });

  // Funkcia pre farbu pozadia
  const getBackgroundColor = () => {
    const idleColors = ['#ffae00', '#582dff', '#00bbff', '#ff0090'];
    const itemOriginalIndex = parseInt(props.item.id) - 1; // Ziskaj originalny index z ID polozky
    
    if (!props.isSubmitted) {
      return idleColors[itemOriginalIndex % 4];
    }
    
    return itemOriginalIndex === props.correctIndex ? "#4cb025" : "#ec4545";
  };

  // Funkcia pre farbu textu
  const getTextColor = () => {
    return "#ffffff";
  };

  // Funkcia pre velkost pisma
  const getFontSize = () => {
    if (props.item.label.length > 40) {
      return "text-[30px]";
    }
    return "text-[38px]";
  };

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`
        h-[120px] w-full rounded-[34px] transition-all duration-200
        ${!props.isSubmitted ? "cursor-move hover:opacity-90" : "cursor-default"}
        ${dragState.isDragging ? "opacity-50" : "opacity-100"}
        flex items-center justify-center px-[24px] py-[16px]
      `}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
    >
      <p
        className={`font-bold text-center leading-[1.2] ${getFontSize()} break-words`}
        style={{ 
          color: getTextColor(),
        }}
      >
        {props.item.label}
      </p>
    </div>
  );
}

// Hlavny komponent cvicenia zoradovania
function SortExerciseContent(props: SortExerciseProps) {
  const {
    question,
    options,
    correctAnswer,
    categories,
    onNext,
    onBack,
    currentSlide,
    totalSlides,
    initialItemOrder,
    initialIsSubmitted,
    onStateChange,
    isLastExercise,
    onAnswerSubmit,
    hideBackButton,
  } = props;

  const viewportScale = useViewportScale({ baseHeight: 980, minScale: 0.66 });

  // Inicializacia draggable poloziek
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>(() => {
    if (initialItemOrder) {
      return initialItemOrder;
    }
    const items = options.map((opt, idx) => {
      const label = !categories && opt.includes(' - ')
        ? opt.split(' - ')[1]
        : opt;
      return {
        id: String(idx + 1),
        label: label,
        position: idx
      };
    });
    // Pomieshaj polozky nahodne
    return items.sort(() => Math.random() - 0.5).map((item, pos) => ({ ...item, position: pos }));
  });

  const [isSubmitted, setIsSubmitted] = useState(initialIsSubmitted || false);

  // Funkcia pre odoslanie odpovede
  const handleSubmitButton = () => {
    setIsSubmitted(true);
    if (onStateChange) {
      onStateChange(draggableItems, true);
    }
    if (onAnswerSubmit) {
      let isCorrect = false;
      
      // Kontrola ci je spravna odpoved pole cisel alebo stringov
      if (Array.isArray(correctAnswer) && typeof correctAnswer[0] === 'number') {
        isCorrect = draggableItems.every((item, index) => {
          const itemOriginalIndex = parseInt(item.id) - 1; // Konvertuj 1-based ID na 0-based index
          return itemOriginalIndex === correctAnswer[index];
        });
      } else {
        isCorrect = draggableItems.every((item, index) => {
          const correctAnswerText = correctAnswer[index];
          const compareText = typeof correctAnswerText === 'string' && correctAnswerText.includes(' - ')
            ? correctAnswerText.split(' - ')[1]
            : correctAnswerText;
          return item.label === compareText;
        });
      }
      
      onAnswerSubmit(isCorrect);
    }
  };

  // Spracovanie stlacenia klavesy Enter
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!isSubmitted) {
          handleSubmitButton();
        } else {
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSubmitted, onNext]);

  // Funkcia pre presun polozky
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = draggableItems[dragIndex];
    const newItems = [...draggableItems];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    const updatedItems = newItems.map((item, idx) => ({ ...item, position: idx }));
    setDraggableItems(updatedItems);
    if (onStateChange) {
      onStateChange(updatedItems, false);
    }
  };

  // Funkcia pre dynamicku velkost pisma otazky
  const getDynamicQuestionFontSize = () => {
    const totalLength = question.length;
    if (totalLength < 60) return 'text-[34.25px]';
    if (totalLength < 100) return 'text-[30px]';
    if (totalLength < 150) return 'text-[26px]';
    if (totalLength < 200) return 'text-[22px]';
    return 'text-[18px]';
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 pb-[120px] pt-4 overflow-y-auto">
        {/* Pozadie otazky */}
        <div className="relative w-full max-w-[1278px] mb-6 lg:mb-[66px]">
          <div className="w-full bg-[#212123] rounded-[38px] px-[32px] py-[35px]">
            <p className={`font-normal ${getDynamicQuestionFontSize()} ${getDynamicQuestionLineHeight()} text-center text-white`}>
              {question}
            </p>
          </div>
        </div>

        {/* Layout s dvoma stlpcami */}
        <div className="w-full max-w-[1242px] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-[64px]">
          {/* Lavy stlpec - Staticke kategorie */}
          <div className="flex flex-col gap-3 sm:gap-5 lg:gap-[40px]">
            {categories ? (
              categories.map((category, index) => (
                <div
                  key={`category-${index}`}
                  className="h-[88px] sm:h-[104px] lg:h-[120px] w-full bg-[#d9d9d9] rounded-[34px] flex items-center justify-center px-[24px]"
                >
                  <p className="font-bold text-[34.25px] leading-[1.3] text-black text-center">
                    {category}
                  </p>
                </div>
              ))
            ) : (
              options.map((option, index) => {
                const parts = option.split(' - ');
                const leftText = parts[0];
                return (
                  <div
                    key={`category-${index}`}
                    className="h-[88px] sm:h-[104px] lg:h-[120px] w-full bg-[#d9d9d9] rounded-[34px] flex items-center justify-center px-[24px]"
                  >
                    <p className="font-bold text-[34.25px] leading-[1.3] text-black text-center">
                      {leftText}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Pravy stlpec - Draggable polozky */}
          <div className="flex flex-col gap-3 sm:gap-5 lg:gap-[40px]">
            {draggableItems.map((item, index) => (
              <DraggableItemComponent
                key={item.id}
                item={item}
                index={index}
                moveItem={moveItem}
                isSubmitted={isSubmitted}
                correctIndex={Array.isArray(correctAnswer) && typeof correctAnswer[0] === 'number' ? Number(correctAnswer[index]) : index}
                categories={categories}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Spodna navigacia */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#4e4e57]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="h-[clamp(84px,11vh,110px)] flex items-center justify-between gap-4">
            {/* Tlacidlo Back */}
            {!hideBackButton ? (
              <button
                onClick={onBack}
                className="bg-[#ec4545] hover:bg-[#d63939] text-white font-bold text-[clamp(16px,2vw,20.55px)] rounded-[15px] transition-colors px-6 h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] flex items-center justify-center whitespace-nowrap flex-shrink-0 leading-none"
              >
                ← Back
              </button>
            ) : (
              <div className="w-[140px] sm:w-[155px] flex-shrink-0" />
            )}

            {/* Progress bodky */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-[50px] flex-1 overflow-x-auto px-1">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="w-[24px] h-[24px]">
                    <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                      <path
                        d={svgPaths.p1c665200}
                        fill={index === currentSlide ? "#4CB025" : "#D9D9D9"}
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
                className="bg-[#4cb025] hover:bg-[#5cc030] h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0"
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
                onClick={onNext}
                className="bg-[#4cb025] hover:bg-[#5cc030] h-[clamp(44px,6vh,54px)] w-[140px] sm:w-[155px] rounded-[15px] px-6 flex items-center justify-center gap-[6px] transition-all flex-shrink-0"
              >
                <p className="font-bold text-[20.55px] text-center text-white">
                  {isLastExercise ? 'Finish' : 'Next →'}
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

// Export komponentu s obalom pre DnD
export default function SortExercise(props: SortExerciseProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <SortExerciseContent {...props} />
    </DndProvider>
  );
}