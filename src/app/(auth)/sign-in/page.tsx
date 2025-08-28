"use client";

import { useState, useEffect } from "react";
import { SendOtp } from "./components/send-otp";
import VerifyOtp from "./components/verify-otp";
import SetupProfile from "./components/setup-profile";
import { useRouter } from "next/navigation";

type AuthStep = "send-otp" | "verify-otp" | "setup-profile";

export default function SignInPage() {
  const router = useRouter();

  // Add debugging for sign-in page
  useEffect(() => {
    console.log('[SIGN-IN] Page loaded');
    
    return () => {
      console.log('[SIGN-IN] Page cleanup');
    };
  }, []);

  const [currentStep, setCurrentStep] = useState<AuthStep>("send-otp");
  const [email, setEmail] = useState("");

  const handleOtpSent = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep("verify-otp");
  };

  const handleOtpVerified = () => {
    setCurrentStep("setup-profile");
  };

  const handleBackToEmail = () => {
    setCurrentStep("send-otp");
  };

  const handleProfileComplete = () => {
    console.log('[SIGN-IN] Profile completed, navigating to home');
    router.push("/");
  };

  return (
    <div>
      {currentStep === "send-otp" && <SendOtp onOtpSent={handleOtpSent} />}

      {currentStep === "verify-otp" && (
        <VerifyOtp
          email={email}
          onVerified={handleOtpVerified}
          onBack={handleBackToEmail}
        />
      )}

      {currentStep === "setup-profile" && (
        <SetupProfile onComplete={handleProfileComplete} />
      )}
    </div>
  );
}
