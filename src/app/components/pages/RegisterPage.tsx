import { useState } from "react";
import { useNavigate } from "react-router";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import svgPathsRegister from "@/imports/register_signin_checkmark";
import { validateEmail, validatePassword, validateName } from "@/app/utils/profileUtils";

// Vlastnosti pre RegisterPage komponent
interface RegisterPageProps {
  onSubmit: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
}

// Hlavny RegisterPage komponent pre registraciu noveho uzivatela
export default function RegisterPage(props: RegisterPageProps) {
  const navigate = useNavigate();

  const [nameInputValue, setNameInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");

  const handleFormSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    if (nameInputValue.trim() === "" || emailInputValue.trim() === "" || passwordInputValue.trim() === "") {
      alert("Please fill in all required fields");
      return;
    }

    const nameValue = nameInputValue.trim();
    const nameValidationResult = validateName(nameValue);

    if (!nameValidationResult.valid) {
      alert(nameValidationResult.error);
      return;
    }

    const emailLowercase = emailInputValue.trim().toLowerCase();
    const emailValidationResult = validateEmail(emailLowercase);

    if (!emailValidationResult.valid) {
      alert(emailValidationResult.error);
      return;
    }

    const passwordValidationResult = validatePassword(passwordInputValue);

    if (!passwordValidationResult.valid) {
      alert(passwordValidationResult.error);
      return;
    }

    props.onSubmit(nameValue, emailLowercase, passwordInputValue);
  };

  const isCurrentlyLoading = props.isLoading === true;

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-3 sm:p-4">
      {isCurrentlyLoading && (
        <LoadingSpinner className="z-50" />
      )}

      <div className="bg-[#222224] rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] w-[94vw] max-w-[500px] p-5 sm:p-8 lg:p-10 mx-auto">
        <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] leading-none text-center text-white mb-8 sm:mb-10">Register</h1>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 sm:gap-5">
          <input
            type="text"
            value={nameInputValue}
            onChange={(event) => setNameInputValue(event.target.value)}
            placeholder="name"
            autoComplete="name"
            className="h-[52px] sm:h-[60px] w-full rounded-[15px] sm:rounded-[21px] px-4 sm:px-5 bg-[#d9d9d9] text-[#222224] text-[16px] sm:text-[18px] outline-none placeholder:text-[#666]"
          />

          <input
            type="email"
            value={emailInputValue}
            onChange={(event) => setEmailInputValue(event.target.value.toLowerCase())}
            placeholder="email@example.com"
            autoComplete="email"
            className="h-[52px] sm:h-[60px] w-full rounded-[15px] sm:rounded-[21px] px-4 sm:px-5 bg-[#d9d9d9] text-[#222224] text-[16px] sm:text-[18px] outline-none placeholder:text-[#666]"
          />

          <input
            type="password"
            value={passwordInputValue}
            onChange={(event) => setPasswordInputValue(event.target.value.replace(/\s/g, ''))}
            placeholder="password (min. 8 characters)"
            autoComplete="new-password"
            className="h-[52px] sm:h-[60px] w-full rounded-[15px] sm:rounded-[21px] px-4 sm:px-5 bg-[#d9d9d9] text-[#222224] text-[16px] sm:text-[18px] outline-none placeholder:text-[#666]"
          />

          <button
            type="submit"
            disabled={isCurrentlyLoading}
            className="mt-2 sm:mt-3 h-[46px] sm:h-[50px] w-[140px] sm:w-[160px] self-center rounded-[12px] sm:rounded-[15px] bg-[#4cb025] hover:bg-[#3d9d1e] text-white text-[20px] sm:text-[24px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <span>Submit</span>
            <svg className="w-[23px] h-[18px] sm:w-[29px] sm:h-[23px]" fill="none" viewBox="0 0 28.998 23.1377">
              <path d={svgPathsRegister.p319dba00} fill="white" />
            </svg>
          </button>
        </form>

        <div className="mt-8 sm:mt-10 lg:mt-12 text-center text-white text-[14px] sm:text-[16px]">
          <span>Already have an account? </span>
          <button
            onClick={() => navigate('/signin')}
            className="underline hover:text-[#4cb025] transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}