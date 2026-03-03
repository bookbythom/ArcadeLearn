import { useState, useEffect } from 'react';
import { 
  getMistakesGroupedByTheme, 
  hasFixedAllMistakes,
  type ThemeMistakes,
  type MistakeExercise 
} from '@/app/utils/mistakesUtils';
import MistakeDetailView from '@/app/components/reusable/MistakeDetailView';

// Properties pre MistakesPage komponent
interface MistakesPageProps {
  userEmail: string;
  onBack?: () => void;
  refreshTrigger?: number; // Trigger pre refresh dat
}

// Interface pre vybranu chybu
interface SelectedMistakeData {
  theme: ThemeMistakes;
  mistake: MistakeExercise;
}

// Hlavny MistakesPage komponent pre zobrazenie chyb pouzivatela
export default function MistakesPage(props: MistakesPageProps) {
  // State pre mistakes
  const [mistakesGroupedByTheme, setMistakesGroupedByTheme] = useState<ThemeMistakes[]>([]);
  const [selectedMistake, setSelectedMistake] = useState<SelectedMistakeData | null>(null);
  const [allMistakesAreFixed, setAllMistakesAreFixed] = useState(false);
  
  // Nacitanie mistakes pri pripojeni komponentu
  useEffect(() => {
    const loadMistakes = () => {
      // Nacitame mistakes zoskupene podla temy
      const groupedMistakes = getMistakesGroupedByTheme(props.userEmail);
      setMistakesGroupedByTheme(groupedMistakes);
      
      // Skontrolujeme ci su vsetky chyby opravene
      const areAllFixed = hasFixedAllMistakes(props.userEmail);
      setAllMistakesAreFixed(areAllFixed);
    };
    
    loadMistakes();
  }, [props.refreshTrigger, props.userEmail]);

  // Ak je vybrate nejake chybne cvicenie, zobrazime detail
  const isMistakeSelected = selectedMistake !== null;
  
  if (isMistakeSelected === true) {
    return (
      <MistakeDetailView
        mistake={selectedMistake.mistake}
        level={selectedMistake.theme.level}
        theme={selectedMistake.theme.theme}
        onBack={() => {
          setSelectedMistake(null);
        }}
      />
    );
  }

  // Funkcia na formatovanie typu cvicenia do citelneho textu
  const formatExerciseTypeToReadableText = (exerciseType: string): string => {
    if (exerciseType === 'single-choice') {
      return 'Single Choice';
    } else if (exerciseType === 'multiple-choice') {
      return 'Multiple Choice';
    } else if (exerciseType === 'true-false') {
      return 'True or False';
    } else if (exerciseType === 'sorting') {
      return 'Sorting';
    } else if (exerciseType === 'matching') {
      return 'Choosing';
    } else {
      return exerciseType;
    }
  };

  // Skontrolujeme ci existuju nejake chyby
  const mistakesExist = mistakesGroupedByTheme.length > 0;

  return (
    <div className="bg-[#1c1c1e] min-h-screen w-full pb-20">
      {/* Hlavicka stranky s dekorativnymi ciarami */}
      <div className="pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-8">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-white to-white max-w-md" />
            <h1 className="text-5xl font-bold text-white whitespace-nowrap">
              Mistakes
            </h1>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-white via-white to-transparent max-w-md" />
          </div>
        </div>
      </div>

      {/* Obsah stranky s chybami */}
      <div className="max-w-7xl mx-auto px-8">
        {mistakesExist === false ? (
          // Prazdny stav - ziadne chyby
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {allMistakesAreFixed === true ? '⭐' : '🎉'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {allMistakesAreFixed === true ? 'You Fixed All Your Mistakes!' : 'No Mistakes Yet!'}
            </h2>
            <p className="text-lg text-[#b6b6b6] max-w-md mx-auto px-4">
              {allMistakesAreFixed === true
                ? 'Great job! You went back and corrected all your previous mistakes. Keep up the excellent work!'
                : 'You haven\'t made any mistakes so far. Keep up the great work!'}
            </p>
          </div>
        ) : (
          // Zoznam chyb zoskupenych podla tem
          <div className="space-y-8 pb-12">
            {/* Prejdeme vsetky temy pomocou manualneho loopu */}
            {mistakesGroupedByTheme.map((themeData) => {
              // Pre kazdu temu vytvorime karticky
              const themeKey = themeData.level + '-' + themeData.theme;
              
              return (
                <div
                  key={themeKey}
                  className="bg-[#212123] rounded-[50px] p-12"
                >
                  {/* Nazov temy */}
                  <h2 className="text-4xl font-medium text-white mb-12">
                    {themeData.themeName}
                  </h2>

                  {/* Zoznam chyb v tejto teme */}
                  <div className="space-y-6">
                    {themeData.mistakes.map((mistakeItem, mistakeIndex) => {
                      // Formatujeme typ cvicenia
                      const formattedType = formatExerciseTypeToReadableText(mistakeItem.type);
                      
                      return (
                        <button
                          key={'mistake-' + mistakeIndex}
                          onClick={() => {
                            // Pri kliknuti nastavime vybrate cvicenie
                            setSelectedMistake({ 
                              theme: themeData, 
                              mistake: mistakeItem 
                            });
                          }}
                          className="w-full bg-[#d9d9d9] hover:bg-[#e5e5e5] rounded-[35px] px-8 py-6 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <p className="text-2xl font-medium text-black">
                            {formattedType} - {mistakeItem.question}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}