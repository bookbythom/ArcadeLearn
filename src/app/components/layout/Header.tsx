import { getLevelProgress } from "@/app/utils/progressionUtils";
import type { UserProgress } from "@/app/utils/progressionUtils";
import type { UserProfile } from "@/app/utils/profileUtils";
import { StreakIcon } from "@/app/components/ui/StreakIcon";

interface HeaderProps {
  activeTab: "home" | "mistakes" | "admin";
  onTabChange: (tab: "home" | "mistakes" | "admin") => void;
  onTabHover?: (tab: "home" | "mistakes" | "admin") => void;
  userProgress: UserProgress;
  streakCount: number;
  streakActiveToday: boolean;
  userProfile: UserProfile;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onProfileClick: () => void;
  onProfileHover?: () => void;
}

// Header komponent
export function Header(props: HeaderProps) {
  // Vypocet levelu
  let currentLevel = 0;
  if (props.userProgress && props.userProgress.level) {
    currentLevel = props.userProgress.level;
  }
  
  let nextLevel = currentLevel + 1;
  
  // Vypocet XP progressu
  let totalXP = 0;
  if (props.userProgress && props.userProgress.totalXP) {
    totalXP = props.userProgress.totalXP;
  }
  
  const levelProgressPercent = getLevelProgress(totalXP);
  const progressWidth = levelProgressPercent + '%';
  
  // Handler pre streak klik
  function handleStreakClick() {
    const dayLabel = props.streakCount === 1 ? 'day' : 'days';
    let message = 'Current streak: ' + props.streakCount + ' ' + dayLabel + '!';

    if (props.streakCount === 0) {
      message = 'Current streak: 0 days.\n\nComplete an island today to start your streak!';
      alert(message);
      return;
    }
    
    if (!props.streakActiveToday) {
      message = message + '\n\nComplete an island today to grow your streak!';
    }
    
    alert(message);
  }
  
  // Styling pre streak
  let streakIconClass = 'transition-all';
  if (!props.streakActiveToday) {
    streakIconClass = streakIconClass + ' grayscale opacity-50';
  }
  
  let streakTextColor = 'text-gray-500';
  if (props.streakActiveToday) {
    streakTextColor = 'text-[#ff9505]';
  }
  
  // Tab styling
  const homeTabColor = props.activeTab === "home" ? "text-white" : "text-[#b6b6b6] hover:text-white";
  const mistakesTabColor = props.activeTab === "mistakes" ? "text-white" : "text-[#b6b6b6] hover:text-white";
  const adminTabColor = props.activeTab === "admin" ? "text-white" : "text-[#b6b6b6] hover:text-white";
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] backdrop-blur-lg bg-[rgba(55,55,55,0.2)] border-b border-[rgba(255,255,255,0.1)]">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between min-h-16 py-2 sm:py-0 gap-2 sm:gap-4">
          {/* Lava strana: Level a Streak */}
          <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 order-1">
            <div className="flex items-center gap-2 w-[124px] sm:w-[140px]">
              <div className="relative flex items-center gap-2 flex-1">
                <div className="absolute right-2 text-[#7f7f7f] text-sm sm:text-base lg:text-lg font-medium z-10 pointer-events-none">
                  {nextLevel}
                </div>
                <div className="flex-1 h-6 sm:h-7 border-2 border-[#7f7f7f] rounded-full relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0.5 bottom-0.5 bg-[#4cb025] rounded-r-full" 
                    style={{ width: progressWidth }} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium z-10 pl-2">
                    LVL.{currentLevel}
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="flex items-center gap-1.5 sm:gap-2 hover:scale-110 transition-transform"
              onClick={handleStreakClick}
            >
              <div className={streakIconClass}>
                <StreakIcon />
              </div>
              <span className={streakTextColor + ' text-base sm:text-lg lg:text-xl font-medium'}>
                {props.streakCount}
              </span>
            </button>
          </div>

          {/* Stred: Navigacia */}
          <nav className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-12 w-full sm:w-auto order-3 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 pb-1 sm:pb-0">
            <button 
              onClick={() => {
                props.onTabChange("home");
              }}
              onMouseEnter={() => props.onTabHover?.("home")}
              className={'text-base sm:text-lg lg:text-xl transition-colors ' + homeTabColor}
            >
              Home
            </button>
            <button 
              onClick={() => {
                props.onTabChange("mistakes");
              }}
              onMouseEnter={() => props.onTabHover?.("mistakes")}
              className={'text-base sm:text-lg lg:text-xl transition-colors ' + mistakesTabColor}
            >
              Mistakes
            </button>
            {props.isAdmin ? (
              <button 
                onClick={() => {
                  props.onTabChange("admin");
                }}
                onMouseEnter={() => props.onTabHover?.("admin")}
                className={'text-base sm:text-lg lg:text-xl transition-colors ' + adminTabColor}
              >
                Admin
              </button>
            ) : null}
          </nav>

          {/* Prava strana: Profil */}
          <button 
            onClick={props.onProfileClick}
            onMouseEnter={props.onProfileHover}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity order-2 sm:order-3"
          >
            {props.isAdmin ? (
              <span className="text-[#FFD700] text-xs sm:text-sm font-bold bg-[#FFD700]/20 px-2 py-1 rounded">
                ADMIN
              </span>
            ) : null}
            <span className="text-[#b6b6b6] text-sm sm:text-base max-w-[90px] sm:max-w-none truncate">{props.userProfile.name}</span>
            {props.userProfile.profilePicture ? (
              <img 
                src={props.userProfile.profilePicture} 
                alt={props.userProfile.name} 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover flex-shrink-0" 
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#c4c4c4] rounded-full flex-shrink-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}