import BeginnerIsland1 from "@/app/components/islands/beginner/BeginnerIsland1";
import BeginnerIsland2 from "@/app/components/islands/beginner/BeginnerIsland2";
import BeginnerIsland3 from "@/app/components/islands/beginner/BeginnerIsland3";
import BeginnerIsland4 from "@/app/components/islands/beginner/BeginnerIsland4";
import BeginnerIsland5 from "@/app/components/islands/beginner/BeginnerIsland5";
import BeginnerIsland6 from "@/app/components/islands/beginner/BeginnerIsland6";
import BeginnerIsland7 from "@/app/components/islands/beginner/BeginnerIsland7";
import BeginnerIsland8 from "@/app/components/islands/beginner/BeginnerIsland8";
import BeginnerIsland9 from "@/app/components/islands/beginner/BeginnerIsland9";
import BeginnerIsland10 from "@/app/components/islands/beginner/BeginnerIsland10";
import BeginnerIsland11 from "@/app/components/islands/beginner/BeginnerIsland11";
import BeginnerIsland12 from "@/app/components/islands/beginner/BeginnerIsland12";
import IntermediateIsland1 from "@/app/components/islands/intermediate/IntermediateIsland1";
import IntermediateIsland2 from "@/app/components/islands/intermediate/IntermediateIsland2";
import IntermediateIsland3 from "@/app/components/islands/intermediate/IntermediateIsland3";
import IntermediateIsland4 from "@/app/components/islands/intermediate/IntermediateIsland4";
import IntermediateIsland5 from "@/app/components/islands/intermediate/IntermediateIsland5";
import IntermediateIsland6 from "@/app/components/islands/intermediate/IntermediateIsland6";
import IntermediateIsland7 from "@/app/components/islands/intermediate/IntermediateIsland7";
import IntermediateIsland8 from "@/app/components/islands/intermediate/IntermediateIsland8";
import IntermediateIsland9 from "@/app/components/islands/intermediate/IntermediateIsland9";
import IntermediateIsland10 from "@/app/components/islands/intermediate/IntermediateIsland10";
import IntermediateIsland11 from "@/app/components/islands/intermediate/IntermediateIsland11";
import IntermediateIsland12 from "@/app/components/islands/intermediate/IntermediateIsland12";
import ProfessionalIsland1 from "@/app/components/islands/professional/ProfessionalIsland1";
import ProfessionalIsland2 from "@/app/components/islands/professional/ProfessionalIsland2";
import ProfessionalIsland3 from "@/app/components/islands/professional/ProfessionalIsland3";
import ProfessionalIsland4 from "@/app/components/islands/professional/ProfessionalIsland4";
import ProfessionalIsland5 from "@/app/components/islands/professional/ProfessionalIsland5";
import ProfessionalIsland6 from "@/app/components/islands/professional/ProfessionalIsland6";
import ProfessionalIsland7 from "@/app/components/islands/professional/ProfessionalIsland7";
import ProfessionalIsland8 from "@/app/components/islands/professional/ProfessionalIsland8";
import ProfessionalIsland9 from "@/app/components/islands/professional/ProfessionalIsland9";
import ProfessionalIsland10 from "@/app/components/islands/professional/ProfessionalIsland10";
import ProfessionalIsland11 from "@/app/components/islands/professional/ProfessionalIsland11";
import ProfessionalIsland12 from "@/app/components/islands/professional/ProfessionalIsland12";
import BeginnerTestIsland from "@/app/components/islands/beginner/BeginnerTestIsland";
import IntermediateTestIsland from "@/app/components/islands/intermediate/IntermediateTestIsland";
import ProfessionalTestIsland from "@/app/components/islands/professional/ProfessionalTestIsland";
import LockedIsland from "@/app/components/islands/states/LockedIsland";
import LockedTestIsland from "@/app/components/islands/states/LockedTestIsland";
import CompletedIslandGreen from "@/app/components/islands/states/CompletedIslandGreen";
import CompletedIslandGold from "@/app/components/islands/states/CompletedIslandGold";
import CompletedTestGreen from "@/app/components/islands/states/CompletedTestGreen";
import CompletedTestGold from "@/app/components/islands/states/CompletedTestGold";
import IslandProgressArcs from "@/app/components/islands/IslandProgressArcs";
import type { ComponentType } from "react";

// Typy pre stav ostrova
type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";

interface IslandRendererProps {
  level: "beginner" | "intermediate" | "professional";
  theme: number; // 0 je finalny test, 1-12 su normalne ostrovy
  status: IslandStatus;
  onClick: () => void;
  onHover?: () => void;
  isAdmin?: boolean;
  accessToken?: string;
  exercisesCorrect?: number; // Pocet spravne vykonanych cviceni (0-5 pre normalne ostrovy, 0-10 pre finalny test)
}

type IslandComponent = ComponentType<{ onClick?: () => void }>;

const regularIslandsByLevel: Record<"beginner" | "intermediate" | "professional", IslandComponent[]> = {
  beginner: [
    BeginnerIsland1,
    BeginnerIsland2,
    BeginnerIsland3,
    BeginnerIsland4,
    BeginnerIsland5,
    BeginnerIsland6,
    BeginnerIsland7,
    BeginnerIsland8,
    BeginnerIsland9,
    BeginnerIsland10,
    BeginnerIsland11,
    BeginnerIsland12,
  ],
  intermediate: [
    IntermediateIsland1,
    IntermediateIsland2,
    IntermediateIsland3,
    IntermediateIsland4,
    IntermediateIsland5,
    IntermediateIsland6,
    IntermediateIsland7,
    IntermediateIsland8,
    IntermediateIsland9,
    IntermediateIsland10,
    IntermediateIsland11,
    IntermediateIsland12,
  ],
  professional: [
    ProfessionalIsland1,
    ProfessionalIsland2,
    ProfessionalIsland3,
    ProfessionalIsland4,
    ProfessionalIsland5,
    ProfessionalIsland6,
    ProfessionalIsland7,
    ProfessionalIsland8,
    ProfessionalIsland9,
    ProfessionalIsland10,
    ProfessionalIsland11,
    ProfessionalIsland12,
  ],
};

const testIslandByLevel: Record<"beginner" | "intermediate" | "professional", IslandComponent> = {
  beginner: BeginnerTestIsland,
  intermediate: IntermediateTestIsland,
  professional: ProfessionalTestIsland,
};

// Hlavny IslandRenderer komponent
export default function IslandRenderer(props: IslandRendererProps) {
  // Nastavime default hodnotu pre exercisesCorrect
  let exercisesCorrectCount = 0;
  if (props.exercisesCorrect !== undefined) {
    exercisesCorrectCount = props.exercisesCorrect;
  }

  // Render funkcia
  function renderIsland() {
    // Ak je ostrov locked, zobrazime locked verziu
    if (props.status === "locked") {
      // Locked test island alebo locked regular island
      if (props.theme === 0) {
        return <LockedTestIsland onClick={props.onClick} />;
      }
      return <LockedIsland onClick={props.onClick} />;
    }
    
    // Ak je completed, zobrazime completed verziu
    if (props.status === "completed-perfect" || props.status === "completed-mistakes") {
      let isPerfectStatus = false;
      if (props.status === "completed-perfect") {
        isPerfectStatus = true;
      }
      
      // Test island alebo regular island
      if (props.theme === 0) {
        if (isPerfectStatus) {
          return <CompletedTestGold onClick={props.onClick} />;
        } else {
          return <CompletedTestGreen onClick={props.onClick} />;
        }
      } else {
        if (isPerfectStatus) {
          return <CompletedIslandGold onClick={props.onClick} />;
        } else {
          return <CompletedIslandGreen onClick={props.onClick} />;
        }
      }
    }
    
    // Default - zobrazime normalne unlocked ostrovy
    if (props.theme === 0) {
      const TestIsland = testIslandByLevel[props.level];
      return <TestIsland onClick={props.onClick} />;
    }

    const islandIndex = props.theme - 1;
    const islandsForLevel = regularIslandsByLevel[props.level];
    const IslandComponentForTheme = islandsForLevel[islandIndex];

    if (IslandComponentForTheme) {
      return <IslandComponentForTheme onClick={props.onClick} />;
    }

    // Fallback ak nenajdeme spravny ostrov
    return <LockedIsland onClick={props.onClick} />;
  }

  // Urcime ci zobrazit progress arcs (kruzky s progressom)
  const shouldShowProgressArcs = (
    props.status === "completed-perfect" || 
    props.status === "completed-mistakes" || 
    props.status === "unlocked"
  );
  
  // Celkovy pocet cviceni - finalny test ma 10, normalne ostrovy maju 5
  let totalExercisesCount = 5;
  if (props.theme === 0) {
    totalExercisesCount = 10;
  }

  // Render ostrova s pripadnymi progress arcs
  return (
    <div
      className="relative group transition-transform max-[380px]:scale-[0.34] max-[360px]:scale-[0.30] max-[340px]:scale-[0.27] scale-[0.42] sm:scale-[0.56] md:scale-[0.78] lg:scale-100 lg:hover:scale-110 lg:active:scale-95"
      onMouseEnter={props.onHover}
    >
      {shouldShowProgressArcs && (
        <IslandProgressArcs 
          correctCount={exercisesCorrectCount} 
          totalCount={totalExercisesCount} 
          level={props.level}
          status={props.status}
        />
      )}
      <div className="relative z-10">
        {renderIsland()}
      </div>
    </div>
  );
}