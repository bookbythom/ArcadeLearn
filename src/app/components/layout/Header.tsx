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
      <div className="w-full px-[clamp(6px,2.4vw,10px)] sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="flex flex-nowrap items-center justify-between min-h-14 sm:min-h-16 py-2 sm:py-0 gap-[clamp(6px,2.5vw,12px)]"
          style={{
            transform: 'scale(clamp(0.42, calc((100vw - 8px) / 980), 1))',
            transformOrigin: 'top center',
          }}
        >
          {/* Lava strana: Level a Streak */}
          <div className="flex items-center gap-[clamp(6px,2.5vw,10px)] sm:gap-8 lg:gap-12 order-1 flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 w-[clamp(98px,31vw,124px)] sm:w-[140px]">
              <div className="relative flex items-center gap-2 flex-1">
                <div className="absolute right-1.5 sm:right-2 text-[#7f7f7f] text-[clamp(10px,3vw,14px)] sm:text-base lg:text-lg font-medium z-10 pointer-events-none">
                  {nextLevel}
                </div>
                <div className="flex-1 h-[clamp(18px,5.2vw,24px)] sm:h-7 border-2 border-[#7f7f7f] rounded-full relative overflow-hidden">
                  <div className="absolute inset-0.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4cb025] rounded-r-full" 
                      style={{ width: progressWidth }} 
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-[clamp(9px,2.7vw,12px)] font-medium z-10 pl-1.5 sm:pl-2">
                    LVL.{currentLevel}
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="flex items-center gap-1 sm:gap-2 hover:scale-110 transition-transform"
              onClick={handleStreakClick}
            >
              <div className={streakIconClass}>
                <StreakIcon />
              </div>
              <span className={streakTextColor + ' text-[clamp(12px,3.8vw,16px)] sm:text-lg lg:text-xl font-medium'}>
                {props.streakCount}
              </span>
            </button>
          </div>

          {/* Stred: Navigacia */}
          <nav className="flex items-center justify-center gap-[clamp(6px,2.5vw,24px)] sm:gap-10 lg:gap-12 flex-1 min-w-0 order-2 pb-0">
            <button 
              onClick={() => {
                props.onTabChange("home");
              }}
              onMouseEnter={() => props.onTabHover?.("home")}
              className={'text-[clamp(9px,2.9vw,16px)] sm:text-lg lg:text-xl transition-colors whitespace-nowrap ' + homeTabColor}
            >
              Home
            </button>
            <button 
              onClick={() => {
                props.onTabChange("mistakes");
              }}
              onMouseEnter={() => props.onTabHover?.("mistakes")}
              className={'text-[clamp(9px,2.9vw,16px)] sm:text-lg lg:text-xl transition-colors whitespace-nowrap ' + mistakesTabColor}
            >
              Mistakes
            </button>
            {props.isAdmin ? (
              <button 
                onClick={() => {
                  props.onTabChange("admin");
                }}
                onMouseEnter={() => props.onTabHover?.("admin")}
                className={'text-[clamp(9px,2.9vw,16px)] sm:text-lg lg:text-xl transition-colors whitespace-nowrap ' + adminTabColor}
              >
                Admin
              </button>
            ) : null}
          </nav>

          {/* Prava strana: Profil */}
          <button 
            onClick={props.onProfileClick}
            onMouseEnter={props.onProfileHover}
            className="flex items-center gap-[clamp(5px,2vw,8px)] sm:gap-3 hover:opacity-80 transition-opacity order-3 flex-shrink-0 min-w-0"
          >
            {props.isAdmin ? (
              <span className="text-[#FFD700] text-[clamp(8px,2.4vw,12px)] sm:text-sm font-bold bg-[#FFD700]/20 px-[clamp(3px,1.2vw,8px)] py-1 rounded whitespace-nowrap">
                ADMIN
              </span>
            ) : null}
            <span className="text-[#b6b6b6] text-[clamp(10px,2.9vw,14px)] sm:text-base max-w-[clamp(44px,16vw,90px)] sm:max-w-none truncate">{props.userProfile.name}</span>
            {props.userProfile.profilePicture ? (
              <img 
                src={props.userProfile.profilePicture} 
                alt={props.userProfile.name} 
                className="w-[clamp(24px,7.5vw,32px)] h-[clamp(24px,7.5vw,32px)] sm:w-9 sm:h-9 rounded-full object-cover flex-shrink-0" 
              />
            ) : (
              <div className="w-[clamp(24px,7.5vw,32px)] h-[clamp(24px,7.5vw,32px)] sm:w-9 sm:h-9 bg-[#c4c4c4] rounded-full flex-shrink-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}