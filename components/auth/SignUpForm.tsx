"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/labelVer2";
import { Input } from "@/components/ui/inputVer2";
import { cn } from "@/lib/utils";
import { BackgroundGradient } from "../ui/background-gradient";
import { IAuthForm, register } from "@/app/(root)/auth/login/register";
import { Status } from "@/utils/apis/response";
import { toast } from "sonner";
import { loginAction } from "@/app/(root)/auth/login/login";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import { getMe } from "@/app/(root)/auth/login/getMe";
import { AuthContext } from "@/context/Auth";

const defaultValue: IAuthForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

export default function SignupForm() {
  const [authForm, setAuthForm] = useState<IAuthForm>(defaultValue);
  const [authAction, setAuthAction] = useState<"register" | "login">("login");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useContext(AuthContext);

  const [invalidateMsg, setInvalidateMsg] =
    useState<Partial<IAuthForm>>(defaultValue);

  const errorMapping: Record<keyof IAuthForm, () => void> = {
    first_name: () =>
      setInvalidateMsg((prev) => ({
        ...prev,
        first_name: "First Name is required",
      })),
    last_name: () =>
      setInvalidateMsg((prev) => ({
        ...prev,
        last_name: "Last Name is required",
      })),
    email: () =>
      setInvalidateMsg((prev) => ({ ...prev, email: "Email is required" })),
    password: () =>
      setInvalidateMsg((prev) => ({
        ...prev,
        password: "Password is required",
      })),
  };

  const findNoneField = useCallback(
    (obj: Record<string, any>): string[] => {
      const fields: string[] = [];
      for (const key in obj) {
        if (authAction === "login" && ["first_name", "last_name"].includes(key))
          continue;

        if (!obj[key]) fields.push(key);
      }
      return fields;
    },
    [authAction]
  );
  const validateForm = () => {
    setInvalidateMsg(defaultValue);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emptyFields = findNoneField(authForm);

        emptyFields.forEach((field: string) => {
          const invalidateAction = errorMapping[field as keyof IAuthForm];
          invalidateAction();
          reject();
        });

        resolve(1);
      }, 50);
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await validateForm();
        setLoading(true);

        const res =
          authAction === "register"
            ? await register(authForm)
            : await loginAction(authForm);
        if (res.status !== Status.OK) return toast.error(res.msg);

        if (authAction === "register") {
          await loginAction(authForm);
        }

        const userInfo = await getMe().then((res) => res.data);
        setUserInfo(userInfo);
        router.push(process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH as string);
      } catch (error) {
        console.log("Invalidated");
      } finally {
        setLoading(false);
      }
    },
    [authAction, authForm]
  );

  const toggleAuthAction = useCallback(() => {
    setInvalidateMsg(defaultValue);
    // setAuthForm(defaultValue);
    if (authAction === "register") setAuthAction("login");
    else setAuthAction("register");
  }, [authAction]);

  return (
    <BackgroundGradient className="max-w-md w-full mx-auto rounded-3xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to TradeCamp
      </h2>

      <form className="my-8 min-w-96" onSubmit={handleSubmit}>
        {authAction === "register" && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            {/* First Name */}
            <LabelInputContainer>
              <Label
                htmlFor="firstname"
                className={cn(
                  invalidateMsg.first_name &&
                    "dark:text-destructive text-destructive"
                )}
              >
                First name
              </Label>
              <Input
                id="firstname"
                placeholder="First name..."
                type="text"
                onInput={(e) =>
                  setAuthForm({
                    ...authForm,
                    first_name: (e.target as HTMLInputElement).value,
                  })
                }
                value={authForm.first_name}
                isShake={!!invalidateMsg.first_name}
              />
            </LabelInputContainer>

            {/* Last Name */}
            <LabelInputContainer>
              <Label
                htmlFor="lastname"
                className={cn(
                  invalidateMsg.last_name &&
                    "dark:text-destructive text-destructive"
                )}
              >
                Last name
              </Label>
              <Input
                id="lastname"
                placeholder="Last name..."
                type="text"
                onInput={(e) =>
                  setAuthForm({
                    ...authForm,
                    last_name: (e.target as HTMLInputElement).value,
                  })
                }
                value={authForm.last_name}
                isShake={!!invalidateMsg.last_name}
              />
            </LabelInputContainer>
          </div>
        )}

        {/* Email */}
        <LabelInputContainer className="mb-4">
          <Label
            htmlFor="email"
            className={cn(
              "flex items-center justify-between",
              invalidateMsg.email && "dark:text-destructive text-destructive"
            )}
          >
            Email Address
            <span className="">{invalidateMsg.email}</span>
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
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer className="mb-8">
          <Label
            htmlFor="password"
            className={cn(
              "flex items-center justify-between",
              invalidateMsg.password && "dark:text-destructive text-destructive"
            )}
          >
            Password
            <span>{invalidateMsg.password}</span>
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
        </LabelInputContainer>

        <button className="inline-flex w-full h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          {loading ? (
            <Loading />
          ) : authAction === "register" ? (
            "Sign up"
          ) : (
            "Sign in"
          )}
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
