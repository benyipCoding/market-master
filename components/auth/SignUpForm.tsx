"use client";
import React, { useCallback, useState } from "react";
import { Label } from "@/components/ui/labelVer2";
import { Input } from "@/components/ui/inputVer2";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BackgroundGradient } from "../ui/background-gradient";

interface IAuthForm {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

const defaultValue: IAuthForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function SignupForm() {
  const [authForm, setAuthForm] = useState<IAuthForm>(defaultValue);
  const [authAction, setAuthAction] = useState<"register" | "login">(
    "register"
  );

  const [invalidateMsg, setInvalidateMsg] =
    useState<Partial<IAuthForm>>(defaultValue);

  const validateForm = () => {
    setInvalidateMsg(defaultValue);
    return Promise.resolve().then(() => {
      !authForm.email &&
        setInvalidateMsg((prev) => ({ ...prev, email: "Email is required" }));
      !authForm.password &&
        setInvalidateMsg((prev) => ({
          ...prev,
          password: "Password is required",
        }));
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await validateForm();
  };

  const toggleAuthAction = useCallback(() => {
    setInvalidateMsg(defaultValue);
    if (authAction === "register") setAuthAction("login");
    else setAuthAction("register");
  }, [authAction]);
  return (
    <BackgroundGradient className="max-w-md w-full mx-auto rounded-3xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to TradingCamp
      </h2>

      <form className="my-8 min-w-96" onSubmit={handleSubmit}>
        {authAction === "register" && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="First name..."
                type="text"
                onInput={(e) =>
                  setAuthForm({
                    ...authForm,
                    firstName: (e.target as HTMLInputElement).value,
                  })
                }
                value={authForm.firstName}
                isShake={!!invalidateMsg.firstName}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Last name..."
                type="text"
                onInput={(e) =>
                  setAuthForm({
                    ...authForm,
                    lastName: (e.target as HTMLInputElement).value,
                  })
                }
                isShake={!!invalidateMsg.lastName}
              />
            </LabelInputContainer>
          </div>
        )}

        <LabelInputContainer className="mb-4">
          <Label
            htmlFor="email"
            className={cn(
              invalidateMsg.email && "dark:text-destructive text-destructive"
            )}
          >
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="Email..."
            type="email"
            onInput={(e) =>
              setAuthForm({
                ...authForm,
                email: (e.target as HTMLInputElement).value,
              })
            }
            isShake={!!invalidateMsg.email}
          />
          {invalidateMsg.email && (
            <p className="text-destructive text-sm px-2">
              {invalidateMsg.email}
            </p>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label
            htmlFor="password"
            className={cn(
              invalidateMsg.password && "dark:text-destructive text-destructive"
            )}
          >
            Password
          </Label>
          <Input
            id="password"
            placeholder="Password..."
            type="password"
            onInput={(e) =>
              setAuthForm({
                ...authForm,
                password: (e.target as HTMLInputElement).value,
              })
            }
            isShake={!!invalidateMsg.password}
          />
          {invalidateMsg.password && (
            <p className="text-destructive text-sm px-2">
              {invalidateMsg.password}
            </p>
          )}
        </LabelInputContainer>

        <button className="inline-flex w-full h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          {authAction === "register" ? "Sign up" : "Sign in"}
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-8 mb-4 h-[1px] w-full" />

        <p
          className="w-full text-md active:scale-100 flex justify-center cursor-pointer hover:underline select-none"
          onClick={toggleAuthAction}
        >
          {authAction === "register"
            ? "Already has account?"
            : "Create an account."}
        </p>
      </form>
    </BackgroundGradient>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
