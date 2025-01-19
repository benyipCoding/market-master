"use client";
import SignupForm from "@/components/auth/SignUpForm";
import { Vortex } from "@/components/ui/vortex";
import { AuthContext } from "@/context/Auth";
import React, { useContext, useEffect } from "react";
import { getMe } from "./getMe";
import { Status } from "@/utils/apis/response";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { setUserInfo } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    getMe().then((res) => {
      if (!res || res.status !== Status.OK) return;
      setUserInfo(res.data);
      router.push(process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH as string);
    });
  }, []);

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
