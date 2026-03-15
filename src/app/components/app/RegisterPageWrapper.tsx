import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { authAPI } from "@/app/utils/api";
import { PageLoader } from "@/app/components/app/PageLoader";

// Lazy load register stranky
const RegisterPage = lazy(() => import("@/app/components/pages/RegisterPage"));

// Pomocny parser chybovej hlasky
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Failed to create account. Please try again.";
};

export default function RegisterPageWrapper() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Submit handler pre registraciu
  const handleSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      await authAPI.signUp({ email, password, name });

      // Po uspesnej registracii posleme usera na sign-in
      alert("Account created successfully! Please sign in with your credentials.");
      navigate("/signin");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fallback spinner pocas lazy loadu komponentu
    <Suspense fallback={<PageLoader />}>
      <RegisterPage onSubmit={handleSubmit} isLoading={isLoading} />
    </Suspense>
  );
}
