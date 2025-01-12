"use client";
import { Vortex } from "@/components/ui/vortex";
import React from "react";

const LoginPage = () => {
  return (
    // <AuroraBackground>
    <Vortex
      // backgroundColor="primary"
      rangeY={800}
      particleCount={200}
      //   // baseHue={120}
      className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full relative"
    ></Vortex>
    // </AuroraBackground>
  );
};

export default LoginPage;
