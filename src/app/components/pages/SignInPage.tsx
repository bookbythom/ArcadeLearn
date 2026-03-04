import { useState } from "react";
import { useNavigate } from "react-router";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
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

  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");

  const handleFormSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    if (emailInputValue.trim() === "" || passwordInputValue.trim() === "") {
      alert("Please fill in all required fields");
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

    props.onSubmit(emailLowercase, passwordInputValue);
  };

  const isCurrentlyLoading = props.isLoading === true;

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4">
      {isCurrentlyLoading && (
        <LoadingSpinner className="z-50" />
      )}

      <div className="bg-[#222224] rounded-[40px] w-[90vw] max-w-[500px] p-10">
        <h1 className="text-[56px] leading-none text-center text-white mb-12">Sign in</h1>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            value={emailInputValue}
            onChange={(event) => setEmailInputValue(event.target.value.toLowerCase())}
            placeholder="email@example.com"
            autoComplete="email"
            className="h-[60px] w-full rounded-[21px] px-5 bg-[#d9d9d9] text-[#222224] text-[18px] outline-none placeholder:text-[#666]"
          />

          <input
            type="password"
            value={passwordInputValue}
            onChange={(event) => setPasswordInputValue(event.target.value.replace(/\s/g, ''))}
            placeholder="password"
            autoComplete="current-password"
            className="h-[60px] w-full rounded-[21px] px-5 bg-[#d9d9d9] text-[#222224] text-[18px] outline-none placeholder:text-[#666]"
          />

          <button
            type="submit"
            disabled={isCurrentlyLoading}
            className="mt-3 h-[50px] w-[160px] self-center rounded-[15px] bg-[#4cb025] hover:bg-[#3d9d1e] text-white text-[24px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <span>Submit</span>
            <svg className="w-[29px] h-[23px]" fill="none" viewBox="0 0 28.998 23.1377">
              <path d={svgPathsSignIn.p319dba00} fill="white" />
            </svg>
          </button>
        </form>

        <div className="mt-14 text-center text-white text-[16px]">
          <span>You're New? </span>
          <button
            onClick={() => navigate('/register')}
            className="underline hover:text-[#4cb025] transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}