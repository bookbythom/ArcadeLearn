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

// Typy pre stav ostrova
type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";

// Properties pre IslandRenderer komponent
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

// Hlavny IslandRenderer komponent
export default function IslandRenderer(props: IslandRendererProps) {
  // Nastavime default hodnotu pre exercisesCorrect
  const exercisesCorrectCount = props.exercisesCorrect || 0;

  // Render funkcia
  const renderIsland = () => {
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
      // Final test islands
      if (props.level === "beginner") {
        return <BeginnerTestIsland onClick={props.onClick} />;
      } else if (props.level === "intermediate") {
        return <IntermediateTestIsland onClick={props.onClick} />;
      } else if (props.level === "professional") {
        return <ProfessionalTestIsland onClick={props.onClick} />;
      }
    }

    // Normalne ostrovy pre beginner uroven
    if (props.level === "beginner") {
      if (props.theme === 1) {
        return <BeginnerIsland1 onClick={props.onClick} />;
      } else if (props.theme === 2) {
        return <BeginnerIsland2 onClick={props.onClick} />;
      } else if (props.theme === 3) {
        return <BeginnerIsland3 onClick={props.onClick} />;
      } else if (props.theme === 4) {
        return <BeginnerIsland4 onClick={props.onClick} />;
      } else if (props.theme === 5) {
        return <BeginnerIsland5 onClick={props.onClick} />;
      } else if (props.theme === 6) {
        return <BeginnerIsland6 onClick={props.onClick} />;
      } else if (props.theme === 7) {
        return <BeginnerIsland7 onClick={props.onClick} />;
      } else if (props.theme === 8) {
        return <BeginnerIsland8 onClick={props.onClick} />;
      } else if (props.theme === 9) {
        return <BeginnerIsland9 onClick={props.onClick} />;
      } else if (props.theme === 10) {
        return <BeginnerIsland10 onClick={props.onClick} />;
      } else if (props.theme === 11) {
        return <BeginnerIsland11 onClick={props.onClick} />;
      } else if (props.theme === 12) {
        return <BeginnerIsland12 onClick={props.onClick} />;
      }
    }

    // Normalne ostrovy pre intermediate uroven
    if (props.level === "intermediate") {
      if (props.theme === 1) {
        return <IntermediateIsland1 onClick={props.onClick} />;
      } else if (props.theme === 2) {
        return <IntermediateIsland2 onClick={props.onClick} />;
      } else if (props.theme === 3) {
        return <IntermediateIsland3 onClick={props.onClick} />;
      } else if (props.theme === 4) {
        return <IntermediateIsland4 onClick={props.onClick} />;
      } else if (props.theme === 5) {
        return <IntermediateIsland5 onClick={props.onClick} />;
      } else if (props.theme === 6) {
        return <IntermediateIsland6 onClick={props.onClick} />;
      } else if (props.theme === 7) {
        return <IntermediateIsland7 onClick={props.onClick} />;
      } else if (props.theme === 8) {
        return <IntermediateIsland8 onClick={props.onClick} />;
      } else if (props.theme === 9) {
        return <IntermediateIsland9 onClick={props.onClick} />;
      } else if (props.theme === 10) {
        return <IntermediateIsland10 onClick={props.onClick} />;
      } else if (props.theme === 11) {
        return <IntermediateIsland11 onClick={props.onClick} />;
      } else if (props.theme === 12) {
        return <IntermediateIsland12 onClick={props.onClick} />;
      }
    }

    // Normalne ostrovy pre professional uroven
    if (props.level === "professional") {
      if (props.theme === 1) {
        return <ProfessionalIsland1 onClick={props.onClick} />;
      } else if (props.theme === 2) {
        return <ProfessionalIsland2 onClick={props.onClick} />;
      } else if (props.theme === 3) {
        return <ProfessionalIsland3 onClick={props.onClick} />;
      } else if (props.theme === 4) {
        return <ProfessionalIsland4 onClick={props.onClick} />;
      } else if (props.theme === 5) {
        return <ProfessionalIsland5 onClick={props.onClick} />;
      } else if (props.theme === 6) {
        return <ProfessionalIsland6 onClick={props.onClick} />;
      } else if (props.theme === 7) {
        return <ProfessionalIsland7 onClick={props.onClick} />;
      } else if (props.theme === 8) {
        return <ProfessionalIsland8 onClick={props.onClick} />;
      } else if (props.theme === 9) {
        return <ProfessionalIsland9 onClick={props.onClick} />;
      } else if (props.theme === 10) {
        return <ProfessionalIsland10 onClick={props.onClick} />;
      } else if (props.theme === 11) {
        return <ProfessionalIsland11 onClick={props.onClick} />;
      } else if (props.theme === 12) {
        return <ProfessionalIsland12 onClick={props.onClick} />;
      }
    }

    // Fallback ak nenajdeme spravny ostrov
    return <LockedIsland onClick={props.onClick} />;
  };

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
      className="relative group transition-transform hover:scale-110 active:scale-95"
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