import { BrowserRouter, Routes, Route } from "react-router";
import AppContent from "@/app/components/app/AppContent";
import SignInPageWrapper from "@/app/components/app/SignInPageWrapper";
import RegisterPageWrapper from "@/app/components/app/RegisterPageWrapper";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPageWrapper />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}