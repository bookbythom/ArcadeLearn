import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { authAPI } from "@/app/utils/api";
import { PageLoader } from "@/app/components/app/PageLoader";

const RegisterPage = lazy(() => import("@/app/components/pages/RegisterPage"));

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Failed to create account. Please try again.";
};

export default function RegisterPageWrapper() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.signUp({ email, password, name });
      alert("Account created successfully! Please sign in with your credentials.");
      navigate("/signin");
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <RegisterPage onSubmit={handleSubmit} isLoading={isLoading} />
    </Suspense>
  );
}
