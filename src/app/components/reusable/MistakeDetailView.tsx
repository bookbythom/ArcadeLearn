import { type MistakeExercise } from '@/app/utils/mistakesUtils';
import { beginnerThemes } from '@/app/data/beginnerthemes';
import { intermediateThemes } from '@/app/data/intermediatethemes';
import { professionalThemes } from '@/app/data/professionalthemes';

// Rozhranie pre vlastnosti mistake detail view komponentu
interface MistakeDetailViewProps {
  mistake: MistakeExercise;
  level: 'beginner' | 'intermediate' | 'professional';
  theme: number;
  onBack: () => void;
}

// Komponent pre detailny pohlad na chybu
export default function MistakeDetailView(props: MistakeDetailViewProps) {
  // Funkcia pre ziskanie nazvu temy
  const getThemeName = (): string => {
    if (props.theme === 0) {
      const finalTestNames: Record<string, string> = {
        beginner: "Beginner Final Test",
        intermediate: "Intermediate Final Test",
        professional: "Professional Final Test"
      };
      return finalTestNames[props.level] || "Final Test";
    }
    
    // Ziskaj data temy na zaklade urovne
    const themeData = (() => {
      if (props.level === "beginner") {
        return beginnerThemes[props.theme - 1];
      } else if (props.level === "intermediate") {
        return intermediateThemes[props.theme - 1];
      } else if (props.level === "professional") {
        return professionalThemes[props.theme - 1];
      }
      return null;
    })();
    
    return themeData?.title || `Theme ${props.theme}`;
  };

  const themeName = getThemeName();

  // Funkcia pre renderovanie obsahu chyby podla typu cvicenia
  const renderMistakeContent = () => {
    switch (props.mistake.type) {
      case 'single-choice':
      case 'multiple-choice':
      case 'true-false':
        return renderChoiceQuestion();
      case 'sorting':
        return renderSortingQuestion();
      case 'matching':
        return renderMatchingQuestion();
      default:
        return renderGenericQuestion();
    }
  };

  // Funkcia pre renderovanie choice otazky
  const renderChoiceQuestion = () => {
    const userAnswers = Array.isArray(props.mistake.userAnswer) ? props.mistake.userAnswer : [props.mistake.userAnswer];
    const correctAnswers = Array.isArray(props.mistake.correctAnswer) ? props.mistake.correctAnswer : [props.mistake.correctAnswer];

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-medium text-white mb-6">Your Choice:</h3>
        <div className="space-y-3">
          {userAnswers.map((answer, index) => (
            <div key={index} className="bg-[#ff4444] bg-opacity-20 border-2 border-[#ff4444] rounded-2xl px-6 py-4">
              <p className="text-lg text-white">{answer}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-medium text-white mt-8 mb-6">Correct Choice:</h3>
        <div className="space-y-3">
          {correctAnswers.map((answer, index) => (
            <div key={index} className="bg-[#4cb025] bg-opacity-20 border-2 border-[#4cb025] rounded-2xl px-6 py-4">
              <p className="text-lg text-white">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Funkcia pre renderovanie otazky zoradovania
  const renderSortingQuestion = () => {
    return (
      <div className="space-y-6">
        {/* Zobraz kategorie (lavy panel) ak su dostupne */}
        {props.mistake.categories && props.mistake.categories.length > 0 && (
          <>
            <h3 className="text-2xl font-medium text-white mb-6">Left Panel Options:</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {props.mistake.categories.map((category: string, index: number) => (
                <div
                  key={index}
                  className="bg-[#3a3a3c] border-2 border-[#b6b6b6] rounded-2xl px-6 py-4 flex-1 min-w-[150px]"
                >
                  <p className="text-lg text-white font-medium text-center">{category}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <h3 className="text-2xl font-medium text-white mb-6">Your Order:</h3>
        <div className="space-y-3">
          {props.mistake.userAnswer.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-[#ff4444] bg-opacity-20 border-2 border-[#ff4444] rounded-2xl px-6 py-4 flex items-center gap-4"
            >
              <span className="text-white font-bold text-xl">{index + 1}.</span>
              <p className="text-lg text-white">{item}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-medium text-white mt-8 mb-6">Correct Order:</h3>
        <div className="space-y-3">
          {props.mistake.correctAnswer.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-[#4cb025] bg-opacity-20 border-2 border-[#4cb025] rounded-2xl px-6 py-4 flex items-center gap-4"
            >
              <span className="text-white font-bold text-xl">{index + 1}.</span>
              <p className="text-lg text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Funkcia pre renderovanie matching otazky
  const renderMatchingQuestion = () => {
    const userPairs = props.mistake.userAnswer;
    const correctPairs = props.mistake.correctAnswer;

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-medium text-white mb-6">Your Choice:</h3>
        <div className="space-y-3">
          {Object.entries(userPairs).map(([left, right]: [string, any], index: number) => {
            const isCorrect = correctPairs[left] === right;
            return (
              <div
                key={index}
                className={`${
                  isCorrect
                    ? 'bg-[#4cb025] border-[#4cb025]'
                    : 'bg-[#ff4444] border-[#ff4444]'
                } bg-opacity-20 border-2 rounded-2xl px-6 py-4`}
              >
                <p className="text-lg text-white font-medium text-center">{right}</p>
              </div>
            );
          })}
        </div>

        <h3 className="text-2xl font-medium text-white mt-8 mb-6">Correct Choice:</h3>
        <div className="space-y-3">
          {Object.entries(correctPairs).map(([, right]: [string, any], index: number) => (
            <div
              key={index}
              className="bg-[#4cb025] bg-opacity-20 border-2 border-[#4cb025] rounded-2xl px-6 py-4"
            >
              <p className="text-lg text-white font-medium text-center">{right}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Funkcia pre renderovanie generickeho typu otazky
  const renderGenericQuestion = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-medium text-white mb-6">Your Answer:</h3>
        <div className="bg-[#ff4444] bg-opacity-20 border-2 border-[#ff4444] rounded-2xl px-6 py-4">
          <p className="text-lg text-white">{JSON.stringify(props.mistake.userAnswer)}</p>
        </div>

        <h3 className="text-2xl font-medium text-white mt-8 mb-6">Correct Answer:</h3>
        <div className="bg-[#4cb025] bg-opacity-20 border-2 border-[#4cb025] rounded-2xl px-6 py-4">
          <p className="text-lg text-white">{JSON.stringify(props.mistake.correctAnswer)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[200] overflow-y-auto">
      <div className="min-h-screen py-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hlavicka s nazvom temy */}
          <div className="mb-8 text-center">
            <p className="text-[#b6b6b6] text-lg mb-2">{themeName}</p>
            <h1 className="text-4xl font-bold text-white mb-4">
              {props.mistake.question}
            </h1>
            <p className="text-[#ff9505] text-sm">
              {new Date(props.mistake.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Obsah chyby */}
          <div className="bg-[#212123] rounded-[50px] p-12 mb-8">
            {renderMistakeContent()}
          </div>

          {/* Tlacidlo back */}
          <div className="flex justify-center">
            <button
              onClick={props.onBack}
              className="bg-[#ec4545] hover:bg-[#d63939] text-white font-bold text-xl px-12 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
            >
              Back to Mistakes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}