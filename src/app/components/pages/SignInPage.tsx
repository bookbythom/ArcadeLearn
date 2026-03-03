import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import svgPathsSignIn from "@/imports/register_signin_checkmark";
import { validateEmail, validatePassword } from "@/app/utils/profileUtils";

// Properties pre SignInPage komponent
interface SignInPageProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

// Hlavny SignInPage komponent pre prihlasenie
export default function SignInPage(props: SignInPageProps) {
  const navigate = useNavigate();
  
  // State pre formularove polia
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");

  // Funkcia na spracovanie odoslania formulara
  const handleFormSubmit = () => {
    // Kontrola ci su vsetky polia vyplnene
    const emailIsEmpty = emailInputValue === "";
    const passwordIsEmpty = passwordInputValue === "";
    
    if (emailIsEmpty === true || passwordIsEmpty === true) {
      alert("Please fill in all required fields");
      return;
    }

    // Validacia emailu
    const emailLowercase = emailInputValue.toLowerCase();
    const emailValidationResult = validateEmail(emailLowercase);
    
    if (emailValidationResult.valid === false) {
      alert(emailValidationResult.error);
      return;
    }

    // Validacia hesla
    const passwordValidationResult = validatePassword(passwordInputValue);
    
    if (passwordValidationResult.valid === false) {
      alert(passwordValidationResult.error);
      return;
    }

    // Zavolame callback funkciu s validnymi datami
    props.onSubmit(emailLowercase, passwordInputValue);
  };

  // Effect pre handling Enter key
  useEffect(() => {
    // Funkcia ktora sa zavola pri stlaceni klavesy
    const handleKeyPressEvent = (keyboardEvent: KeyboardEvent) => {
      const pressedKey = keyboardEvent.key;
      
      if (pressedKey === 'Enter') {
        handleFormSubmit();
      }
    };

    // Pridame listener
    window.addEventListener('keydown', handleKeyPressEvent);
    
    // Cleanup funkcia
    return () => {
      window.removeEventListener('keydown', handleKeyPressEvent);
    };
  }, [emailInputValue, passwordInputValue]);

  // Pomocna premenna pre loading state
  const isCurrentlyLoading = props.isLoading === true;

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4">
      {/* Loading overlay - zobrazuje sa ked je isLoading true */}
      {isCurrentlyLoading && (
        <div 
          className="fixed inset-0 bg-[#1c1c1e] z-50 flex items-center justify-center"
        >
          <div className="relative">
            {/* Zeleny rotujuci kruh */}
            <svg 
              className="animate-spin" 
              width="80" 
              height="80" 
              viewBox="0 0 80 80"
              style={{
                animation: 'spin 1s linear infinite'
              }}
            >
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="#4cb025"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="160"
                strokeDashoffset="40"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Hlavny kontajner formulara */}
      <div className="bg-[#222224] h-[600px] overflow-clip relative rounded-[40px] w-[90vw] max-w-[500px]" data-name="component-profile-popup/sign-in">
        
        {/* Email input pole */}
        <div className="absolute bg-[#d9d9d9] content-stretch flex h-[60px] items-center left-[50%] translate-x-[-50%] px-[20px] py-[19px] rounded-[21px] top-[185px] w-[85%]">
          <input
            type="email"
            value={emailInputValue}
            onChange={(event) => {
              const newValue = event.target.value;
              const newValueLowercase = newValue.toLowerCase();
              setEmailInputValue(newValueLowercase);
            }}
            placeholder="email@example.com"
            className="bg-transparent w-full outline-none font-['Roboto:Medium',sans-serif] font-medium text-[18px] text-[#222224] tracking-[0.15px] placeholder:text-[#666]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
        </div>
        
        {/* Password input pole */}
        <div className="absolute bg-[#d9d9d9] content-stretch flex h-[60px] items-center left-[50%] translate-x-[-50%] px-[20px] py-[19px] rounded-[21px] top-[265px] w-[85%]">
          <input
            type="password"
            value={passwordInputValue}
            onChange={(event) => {
              const newValue = event.target.value;
              // Odstranime vsetky medzery z hesla
              const newValueNoSpaces = newValue.replace(/\s/g, '');
              setPasswordInputValue(newValueNoSpaces);
            }}
            placeholder="password"
            className="bg-transparent w-full outline-none font-['Roboto:Medium',sans-serif] font-medium text-[18px] text-[#222224] tracking-[0.15px] placeholder:text-[#666]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
        </div>
        
        {/* Link na registraciu */}
        <div className="absolute content-stretch flex gap-[11px] items-center justify-center leading-[0] left-1/2 -translate-x-1/2 text-[16px] text-white top-[495px] tracking-[0.15px]" data-name="Create Account Link">
          <div className="css-g0mm18 flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="css-ew64yg leading-[24px]">You're New?</p>
          </div>
          <button 
            onClick={() => {
              navigate('/register');
            }}
            className="css-g0mm18 flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center relative shrink-0 hover:text-[#4cb025] transition-colors cursor-pointer" 
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="css-ew64yg decoration-solid leading-[24px] underline">Create Account</p>
          </button>
        </div>
        
        {/* Nadpis Sign in */}
        <div className="absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] left-[50%] text-[56px] text-center text-white top-[85px] tracking-[0.15px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="css-4hzbpn leading-[24px]">Sign in</p>
        </div>
        
        {/* Submit button */}
        <button 
          onClick={handleFormSubmit}
          disabled={isCurrentlyLoading}
          className="absolute content-stretch flex gap-[6px] h-[50px] items-center justify-center left-[50%] translate-x-[-50%] px-[19px] py-[13px] top-[375px] w-[160px] hover:scale-105 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          data-name="submit-button"
        >
          <div className="absolute bg-[#4cb025] hover:bg-[#3d9d1e] inset-0 rounded-[15px] transition-colors" />
          <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold h-[28px] leading-[normal] not-italic relative shrink-0 text-[24px] text-white w-[90px] z-10">Submit</p>
          <div className="h-[23.138px] relative shrink-0 w-[28.998px] z-10" data-name="Union">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.998 23.1377">
              <path d={svgPathsSignIn.p319dba00} fill="white" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}