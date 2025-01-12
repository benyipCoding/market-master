"use client";
import SignupForm from "@/components/auth/SignUpForm";
import { Vortex } from "@/components/ui/vortex";
import React from "react";

const LoginPage = () => {
  return (
    <Vortex
      // backgroundColor="black"
      rangeY={800}
      particleCount={200}
      //   // baseHue={120}
      className="flex items-center flex-col justify-center h-full"
    >
      <SignupForm />
    </Vortex>
  );
};

export default LoginPage;
