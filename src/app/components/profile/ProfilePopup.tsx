import { useState, useRef, useEffect } from "react";
import {
  validateEmail,
  validatePassword,
  validateName,
  imageToBase64,
  type UserProfile
} from "@/app/utils/profileUtils";
import { profileAPI } from "@/app/utils/api";
import { Pencil } from "lucide-react";

// Rozhranie pre vlastnosti profile popup komponentu
interface ProfilePopupProps {
  onLogout: () => void;
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function hasStatusCode(error: unknown, status: number) {
  return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === status;
}

// Hlavny komponent pre profile popup
export default function ProfilePopup(props: ProfilePopupProps) {
  // State premenne pre profil
  const [profileData, setProfileData] = useState<UserProfile>(props.profile);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [temporaryName, setTemporaryName] = useState(profileData.name);
  const [temporaryEmail, setTemporaryEmail] = useState(profileData.email);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("********");
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState("");
  
  // Pole tipov pre uzivatelov
  const tips = [
    "Layer Mask v Photoshope používa 256 odtieňov šedej na presné zobrazovanie a skrývanie.",
    "Illustrator používa matematické Bézierove krivky, preto vektory zostávajú ostré aj pri 1000% zväčšení.",
    "Pen Tool v Illustratori bol pomenovaný podľa fyzických technických pier používaných dizajnérmi pred digitálnou érou.",
    "Smart Objects v Photoshope môžu obsahovať až 10 vrstiev v sebe a zachovávajú všetky transformácie nedeštruktívne.",
    "Content-Aware Fill analyzuje približne 200 000 pixelov okolia na inteligentné doplnenie.",
    "Pathfinder v Illustratori dokáže vytvoriť 8 rôznych typov kombinácie tvarov vrátane Unite, Minus Front a Intersect.",
    "Clipping Mask v Illustratori funguje tak, že spodný objekt definuje viditeľnú oblasť objektu nad ním.",
    "Photoshop používa RGB (Red Green Blue) pre web pretože monitory emitujú svetlo, a CMYK pre tlač pretože atrament odráža svetlo.",
    "Gradient Mesh v Illustratori môže mať až 200 bodov pre vytvorenie fotorealistických farebných prechodov.",
    "Artboards v Illustratori boli pridané vo verzии CS4 a umožňujú až 100 artboardov v jednom súbore.",
    "Curves v Photoshope poskytujú 16-bitovú presnosť, čo znamená až 65 536 úrovní jasu namiesto 256 úrovní.",
    "Appearance panel v Illustratori umožňuje aplikovať až 20 výplní a 20 obrysov na jeden objekt naraz.",
    "Healing Brush v Photoshope analyzuje textúru, osvetlenie a tieňovanie v okruhu približne 1000 pixelov.",
    "Live Paint Bucket v Illustratori konvertuje vektorové cesty na špeciálne Live Paint skupiny s inteligentným farbením.",
    "Alpha Channels v Photoshope sú v skutočnosti 8-bitové škálové obrázky, ktoré uchovávajú uložené výbery.",
    "Type on a Path v Illustratori umožňuje text obtekať po krivke a automaticky upravovať medzery medzi písmenami.",
    "Gradient Annotator v Illustratori bol predstavený vo verzии CS5 a poskytuje vizuálnu kontrolu s farebnou stopou.",
    "Camera RAW v Photoshope pracuje s 12 alebo 14-bitovými dátami, čo zachováva viac informácií ako štandardný 8-bitový JPEG.",
    "Offset Path v Illustratori vytvára paralelnú kópiu cesty s presnosťou na 0.001 pixela.",
    "Liquify filter v Photoshope používa mesh sieť s 128x128 bodmi na tekuté deformácie.",
    "Puppet Warp v Illustratori používa algoritmus ARAP (As-Rigid-As-Possible) na prirodzené deformácie vektorov.",
    "Frequency Separation v Photoshope oddeľuje textúru od farby pomocou Gaussian Blur a Apply Image kombinácií.",
    "Width Tool v Illustratori dokáže meniť hrúbku čiary v rozsahu 0.001 až 1000 bodov.",
    "Blend Modes v Photoshope fungujú na základe matematických algoritmov kde Multiply násobí hodnoty pixelov a delí ich 255.",
    "Adjustment Layers v Photoshope sú nedeštruktívne pretože pracujú s odkazmi namiesto priamej úpravy pixelov.",
    "Symboly v Illustratori môžu obsahovať až 9 typov symbolov vrátane statických a dynamických variant.",
    "Layer Groups v Photoshope podporujú až 8 úrovní vnorenia, čo umožňuje komplexnú organizáciu projektov.",
    "Photoshop obsahuje 3D funkcie s podporou pre OpenGL rendering a až 8 zdrojov svetla.",
    "Illustrator podporuje Pantone súradnice pre presné tlačové farby s vyše 2000 odtieňmi.",
    "History panel v Photoshope ukladá štandardne 50 krokov späť, ale dá sa nastaviť až na 1000 krokov.",
    "Gradient Tool v Illustratori podporuje 5 typov gradientov vrátane Linear, Radial a Freeform.",
    "Channels v Photoshope obsahujú Red, Green, Blue a voliteľné Alpha channel na transparentnosť.",
    "Stroke panel v Illustratori umožňuje nastaviť hrúbku čiary, cap style a join style s miter limit až 500.",
    "Photoshop dokáže pracovať s obrázkami až do rozlíšenia 300 000 x 300 000 pixelov.",
    "Color Picker v Illustratori pracuje s HSB hodnotami (Hue, Saturation, Brightness) pre presnú farebnosť.",
    "Brush Tool v Photoshope má viac ako 50 prednastavených štetcov a podporuje tlak s 2048 úrovňami.",
    "Transform panel v Illustratori zobrazuje hodnoty s presnosťou na 4 desatinné miesta.",
    "Smart Guides v Illustratori zobrazujú zelené čiary pri zarovnaní objektov s presnosťou 1 pixel.",
    "Blending Options v Photoshope ponúkajú 27 blend modes vrátane Hard Mix a Divide.",
    "Document Setup v Illustratori umožňuje nastaviť bleed až 72 palcov pre tlačové projekty.",
    "Shape Builder Tool v Illustratori kombinuje a delí tvary v reálnom čase s vizuálnym náhľadom.",
    "Filter Gallery v Photoshope obsahuje vyše 100 efektov organizovaných do 6 kategórií.",
    "Expand Appearance v Illustratori konvertuje efekty na živé cesty, čo zvyšuje kompatibilitu.",
    "Warp Tool v Photoshope má 15 preddefinovaných štýlov vrátane Arc, Fish a Inflate.",
    "Direct Selection Tool v Illustratori umožňuje editovať jednotlivé anchor pointy s Bézierovými handles.",
    "Photoshop používa LZW kompresiu pre TIFF súbory, čo zachováva 100% kvalitu pri menšej veľkosti.",
    "Pattern Options v Illustratori umožňujú vytvoriť 9 typov vzoriek vrátane Brick Row a Hex by Column.",
    "Quick Mask v Photoshope vizualizuje výber ako červený overlay s 50% priehľadnosťou.",
    "Pathfinder efekty v Illustratori zostávajú editovateľné až do použitia Expand príkazu.",
    "Photoshop podporuje až 56 farebných kanálov v jednom súbore v Multichannel režime.",
    "Illustrator dokáže exportovať SVG súbory s inline CSS štýlmi pre webové použitie."
  ];
  
  const [currentTip, setCurrentTip] = useState("");
  
  // Effect pre nahodny vyber tipu pri nacitani
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const randomTip = tips[randomIndex];
    setCurrentTip(randomTip);
  }, []);
  
  const isEditingRef = useRef(false);
  const lastProfileRef = useRef(JSON.stringify(props.profile));

  // Effect pre sledovanie stavu editacie
  useEffect(() => {
    isEditingRef.current = isEditingName || isEditingEmail || isEditingPassword;
  }, [isEditingName, isEditingEmail, isEditingPassword]);

  // Effect pre aktualizaciu profilu ked sa zmeni externy profil
  useEffect(() => {
    const currentProfileString = JSON.stringify(props.profile);
    const hasChanged = currentProfileString !== lastProfileRef.current;
    
    if (!isEditingRef.current && hasChanged) {
      setProfileData(props.profile);
      setTemporaryName(props.profile.name);
      setTemporaryEmail(props.profile.email);
      lastProfileRef.current = currentProfileString;
    }
  }, [props.profile]);

  // Funkcia pre zacatie editacie mena
  const handleNameEditClick = () => {
    setTemporaryName(profileData.name);
    setIsEditingName(true);
  };

  // Funkcia pre ulozenie mena
  const handleNameSaveClick = async () => {
    const validation = validateName(temporaryName);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Not authenticated');
      return;
    }
    
    try {
      const newProfile = { ...profileData, name: temporaryName };
      await profileAPI.updateProfile(accessToken, newProfile);
      setProfileData(newProfile);
      props.onProfileUpdate(newProfile);
      setIsEditingName(false);
      alert("Name changed successfully!");
    } catch (error: unknown) {
      alert(getErrorMessage(error, 'Failed to update name'));
    }
  };

  // Funkcia pre zacatie editacie emailu
  const handleEmailEditClick = () => {
    setTemporaryEmail(profileData.email);
    setIsEditingEmail(true);
  };

  // Funkcia pre ulozenie emailu
  const handleEmailSaveClick = async () => {
    const validation = validateEmail(temporaryEmail.toLowerCase());
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    if (temporaryEmail.toLowerCase() === profileData.email.toLowerCase()) {
      setIsEditingEmail(false);
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Not authenticated');
      return;
    }
    
    try {
      // Priama zmena emailu bez verifikacie
      await profileAPI.changeEmailDirect(accessToken, temporaryEmail.toLowerCase());
      const newProfile = { ...profileData, email: temporaryEmail.toLowerCase() };
      setProfileData(newProfile);
      props.onProfileUpdate(newProfile);
      
      alert(`Email changed successfully to ${temporaryEmail.toLowerCase()}!`);
      setIsEditingEmail(false);
    } catch (error: unknown) {
      if (hasStatusCode(error, 409)) {
        alert("This email address is already in use");
      } else {
        alert(getErrorMessage(error, 'Failed to change email'));
      }
    }
  };

  // Funkcia pre zacatie editacie hesla
  const handlePasswordEditClick = () => {
    setIsEditingPassword(true);
    setCurrentPasswordForChange("");
    setTemporaryPassword("");
  };

  // Funkcia pre ulozenie hesla
  const handlePasswordSaveClick = async () => {
    if (!currentPasswordForChange) {
      alert("Please enter your current password");
      return;
    }

    const validation = validatePassword(temporaryPassword);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Not authenticated');
      return;
    }
    
    try {
      // Priama zmena hesla bez verifikacie
      await profileAPI.changePasswordDirect(accessToken, currentPasswordForChange, temporaryPassword);
      setDisplayPassword('•'.repeat(temporaryPassword.length));
      
      alert("Password changed successfully!");
      setIsEditingPassword(false);
      setCurrentPasswordForChange("");
      setTemporaryPassword("");
    } catch (error: unknown) {
      if (hasStatusCode(error, 401)) {
        alert("Current password is incorrect");
      } else {
        alert(getErrorMessage(error, 'Failed to change password'));
      }
    }
  };

  // Funkcia pre kliknutie na profilovy obrazok
  const handleProfilePictureClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.type === 'image/avif') {
          alert('AVIF format is not supported. Please use PNG, JPEG, WebP, or GIF instead.');
          return;
        }

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          alert('Unsupported image format. Please use PNG, JPEG, WebP, or GIF.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Image must be smaller than 5MB');
          return;
        }

        try {
          const base64 = await imageToBase64(file);
          const newProfile = { ...profileData, profilePicture: base64 };
          
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            alert('Not authenticated');
            return;
          }
          
          await profileAPI.updateProfile(accessToken, newProfile);
          setProfileData(newProfile);
          props.onProfileUpdate(newProfile);
        } catch (error) {
          alert('Failed to upload image');
        }
      }
    };
    input.click();
  };

  return (
    <div className="bg-[#222224] max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] w-[95vw] max-w-[800px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-[560px] mx-auto flex flex-col gap-4 sm:gap-5 lg:gap-6">
        <button
          onClick={handleProfilePictureClick}
          className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] self-center cursor-pointer hover:opacity-80 transition-opacity group relative"
        >
          {profileData.profilePicture ? (
            <img
              src={profileData.profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#D9D9D9]" />
          )}
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Pencil className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
          </div>
        </button>

        <div className="flex items-center justify-center gap-3">
          <h2 className="text-[30px] sm:text-[38px] lg:text-[44px] leading-none text-white text-center break-words">{profileData.name}</h2>
          <button
            onClick={handleNameEditClick}
            className="relative top-[3px] sm:top-[4px] text-[#d9d9d9] hover:text-white transition-colors inline-flex items-center justify-center text-sm font-semibold px-2 py-1 rounded"
            aria-label="Edit name"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="bg-[#d9d9d9] h-[50px] sm:h-[56px] rounded-[14px] sm:rounded-[18px] px-3 sm:px-4 flex items-center justify-between">
            <span className="text-[14px] sm:text-[18px] text-black truncate">{profileData.email}</span>
            <button
              onClick={handleEmailEditClick}
              className="text-[#3a3a3c] hover:text-black transition-colors text-sm font-semibold px-2 py-1"
              aria-label="Edit email"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#d9d9d9] h-[50px] sm:h-[56px] rounded-[14px] sm:rounded-[18px] px-3 sm:px-4 flex items-center justify-between">
            <span className="text-[14px] sm:text-[18px] text-black">{displayPassword}</span>
            <button
              onClick={handlePasswordEditClick}
              className="text-[#3a3a3c] hover:text-black transition-colors text-sm font-semibold px-2 py-1"
              aria-label="Edit password"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-[#323235] min-h-[100px] sm:min-h-[110px] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 flex items-center justify-center">
          <p className="italic text-center text-white leading-snug text-[14px] sm:text-[16px]">"{currentTip}"</p>
        </div>

        <button
          onClick={props.onLogout}
          className="bg-[#ec4545] hover:bg-[#d63939] h-[48px] sm:h-[56px] rounded-[16px] sm:rounded-[20px] text-[18px] sm:text-[22px] text-white font-bold transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Modal pre zmenu mena */}
      {isEditingName && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2c] rounded-[20px] p-5 sm:p-8 w-full max-w-[500px] max-h-[90%] overflow-y-auto flex flex-col gap-5 sm:gap-6 shadow-2xl border border-[#3a3a3c]">
            <h3 className="font-bold text-[24px] sm:text-[30px] text-white text-center">
              Change Name
            </h3>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] sm:text-[16px] text-[#b6b6b6] pl-2">
                Your Name
              </label>
              <input
                type="text"
                value={temporaryName}
                onChange={(e) => {
                  if (e.target.value.length <= 25) {
                    setTemporaryName(e.target.value);
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSaveClick()}
                maxLength={25}
                placeholder="Enter your name"
                autoFocus
                className="bg-[#d9d9d9] rounded-[15px] px-4 py-3 h-[48px] sm:h-[52px] w-full outline-none font-medium text-[15px] sm:text-[17px] text-[#222224] placeholder:text-[#777]"
              />
              <p className="text-[12px] text-[#888] pl-2">
                Maximum 25 characters
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setTemporaryName(profileData.name);
                }}
                className="bg-[#ec4545] hover:bg-[#d63939] rounded-[15px] px-5 sm:px-6 py-2.5 font-bold text-[16px] sm:text-[18px] text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleNameSaveClick}
                className="bg-[#4cb025] hover:bg-[#3d9d1e] rounded-[15px] px-5 sm:px-6 py-2.5 font-bold text-[16px] sm:text-[18px] text-white transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pre zmenu emailu */}
      {isEditingEmail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2c] rounded-[20px] p-5 sm:p-8 w-full max-w-[500px] max-h-[90%] overflow-y-auto flex flex-col gap-5 sm:gap-6 shadow-2xl border border-[#3a3a3c]">
            <h3 className="font-bold text-[24px] sm:text-[30px] text-white text-center">
              Change Email
            </h3>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] sm:text-[16px] text-[#b6b6b6] pl-2">
                New Email
              </label>
              <input
                type="email"
                value={temporaryEmail}
                onChange={(e) => setTemporaryEmail(e.target.value.toLowerCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSaveClick()}
                placeholder="email@example.com"
                autoFocus
                className="bg-[#d9d9d9] rounded-[15px] px-4 py-3 h-[48px] sm:h-[52px] w-full outline-none font-medium text-[15px] sm:text-[17px] text-[#222224] placeholder:text-[#777]"
              />
              <p className="text-[12px] text-[#888] pl-2">
                Enter a valid email address
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setIsEditingEmail(false);
                  setTemporaryEmail(profileData.email);
                }}
                className="bg-[#ec4545] hover:bg-[#d63939] rounded-[15px] px-5 sm:px-6 py-2.5 font-bold text-[16px] sm:text-[18px] text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSaveClick}
                className="bg-[#4cb025] hover:bg-[#3d9d1e] rounded-[15px] px-5 sm:px-6 py-2.5 font-bold text-[16px] sm:text-[18px] text-white transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pre zmenu hesla */}
      {isEditingPassword && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2c] rounded-[20px] p-5 sm:p-8 w-full max-w-[500px] max-h-[90%] overflow-y-auto flex flex-col gap-5 sm:gap-6 shadow-2xl border border-[#3a3a3c]">
            <h3 className="font-bold text-[24px] sm:text-[30px] text-white text-center">
              Change Password
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[14px] sm:text-[16px] text-[#b6b6b6] pl-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPasswordForChange}
                  onChange={(e) => setCurrentPasswordForChange(e.target.value.replace(/\s/g, ''))}
                  placeholder="Enter current password"
                  autoFocus
                  className="bg-[#d9d9d9] rounded-[15px] px-4 py-3 h-[48px] sm:h-[52px] w-full outline-none font-medium text-[15px] sm:text-[17px] text-[#222224] placeholder:text-[#777]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-[14px] sm:text-[16px] text-[#b6b6b6] pl-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value.replace(/\s/g, ''))}
                  placeholder="Enter new password"
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSaveClick()}
                  className="bg-[#d9d9d9] rounded-[15px] px-4 py-3 h-[48px] sm:h-[52px] w-full outline-none font-medium text-[15px] sm:text-[17px] text-[#222224] placeholder:text-[#777]"
                />
                <p className="text-[12px] text-[#888] pl-2">
                  Password must be at least 6 characters long
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setIsEditingPassword(false);
                  setCurrentPasswordForChange("");
                  setTemporaryPassword("");
                }}
                className="bg-[#ec4545] hover:bg-[#d63939] rounded-[15px] px-5 sm:px-6 py-2.5 font-bold text-[16px] sm:text-[18px] text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSaveClick}
                className="bg-[#4cb025] hover:bg-[#3d9d1e] rounded-[15px] px-5 sm:px-6 py-2.5 font-bold text-[16px] sm:text-[18px] text-white transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}