import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { authAPI } from "@/app/utils/api";
import { PageLoader } from "@/app/components/app/PageLoader";

const RegisterPage = lazy(() => import("@/app/components/pages/RegisterPage"));

export default function RegisterPageWrapper() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.signUp({ email, password, name });
      alert("Account created successfully! Please sign in with your credentials.");
      navigate("/signin");
    } catch (error: any) {
      alert(error.message || "Failed to create account. Please try again.");
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
