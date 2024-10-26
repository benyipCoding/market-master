"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { Button } from "../ui/button";
import { useAutomaticLineDrawing } from "@/hooks/useAutomaticLineDrawing";
import Loading from "../Loading";
import { LoginTest, Tokens } from "./actions/login";
import { toast } from "sonner";
import { getMe } from "./actions/getMe";
import { saveRefreshToken } from "@/utils/storage";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, asideOpen, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

  const width = useMemo<string>(
    () => (asideOpen ? "19rem" : "0rem"),
    [asideOpen]
  );

  const { performDrawing, autoDrawing, deleteBaseLine } =
    useAutomaticLineDrawing({
      setDrawedLineList,
      tChartRef,
    });

  const login = async () => {
    const payload = {
      email: "ben_yip@126.com",
      password: "5207logiNN",
    };

    const res = await LoginTest<Tokens>(payload);
    if (res?.status !== 200) return toast.error(res.msg);
    saveRefreshToken(res.data.refreshToken);
  };

  const getMeAction = async () => {
    const res = await getMe();
    if (res?.status !== 200) return toast.error(res.msg);
    console.log(res);
  };

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  return (
    <div className={cn(className)} ref={asideRef} style={{ width }}>
      {asideOpen && (
        <div className="flex flex-col gap-4">
          <Button onClick={performDrawing} disabled={autoDrawing}>
            {autoDrawing ? <Loading /> : "Automatic Line"}
          </Button>
          <Button
            onClick={deleteBaseLine}
            disabled={autoDrawing}
            variant={"destructive"}
          >
            Delete Base Line
          </Button>
          <Button variant={"outline"} onClick={login}>
            登录测试按钮
          </Button>
          <Button variant={"outline"} onClick={getMeAction}>
            Get Me
          </Button>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Aside);
