"use client";
import SignupForm from "@/components/auth/SignUpForm";
import { Vortex } from "@/components/ui/vortex";
import { AuthContext } from "@/context/Auth";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) return;
    router.push(process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH as string);
  }, [router, userInfo]);

  return (
    <Vortex
      rangeY={800}
      particleCount={200}
      className="flex items-center flex-col justify-center h-full"
    >
      <SignupForm />
    </Vortex>
  );
};

export default LoginPage;
