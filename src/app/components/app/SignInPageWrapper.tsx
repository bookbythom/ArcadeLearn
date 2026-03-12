import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { authAPI } from "@/app/utils/api";
import { PageLoader } from "@/app/components/app/PageLoader";

const SignInPage = lazy(() => import("@/app/components/pages/SignInPage"));

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const maybeDataError = (error as { data?: { error?: string } }).data?.error;
    if (maybeDataError) {
      return maybeDataError;
    }
    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return (error as { message: string }).message;
    }
  }
  return "Please check your credentials.";
};

export default function SignInPageWrapper() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      localStorage.removeItem("accessToken");
      const response = await authAPI.signIn({ email, password });
      if (!response?.accessToken || !response?.user) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("accessToken", response.accessToken);
      navigate("/");
      window.location.reload();
    } catch (error: unknown) {
      let errorMessage = "Sign-in failed.\n\n";
      errorMessage += getErrorMessage(error);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <SignInPage onSubmit={handleSubmit} isLoading={isLoading} />
    </Suspense>
  );
}
