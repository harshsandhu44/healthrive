"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/db/client";

const formSchema = z.object({
  token: z.string().min(6, { message: "OTP must be 6 characters." }),
});

interface VerifyOtpProps {
  email: string;
  onVerified?: () => void;
  onBack?: () => void;
}

export default function VerifyOtp({
  email,
  onVerified,
  onBack,
}: VerifyOtpProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: values.token,
        type: "email",
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      // Check if user already has profile data
      const { data: { user } } = await supabase.auth.getUser();
      const hasExistingProfile = user?.user_metadata?.first_name && user?.user_metadata?.last_name;

      setMessage({ type: "success", text: "OTP verified successfully!" });
      
      if (hasExistingProfile) {
        // User already has profile data, redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // New user, proceed to profile setup
        onVerified?.();
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to verify OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Verify your email</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium">{email}</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onBack}
              >
                Back to email
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
