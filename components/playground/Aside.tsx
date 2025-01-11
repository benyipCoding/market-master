"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { Button } from "../ui/button";
import { useAutomaticLineDrawing } from "@/hooks/useAutomaticLineDrawing";
import { toast } from "sonner";
import { LoginTest } from "@/app/auth/login/login";
import { getMe } from "@/app/auth/login/getMe";
import { Tokens } from "@/utils/cookieHelper";
import { cleanData } from "@/app/playground/actions/cleanData";
import { Status } from "@/utils/apis/response";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, asideOpen, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

  const width = useMemo<string>(
    () => (asideOpen ? "19rem" : "0rem"),
    [asideOpen]
  );

  // const { deletePens } = useAutomaticLineDrawing({
  //   setDrawedLineList,
  //   tChartRef,
  // });

  // const login = async () => {
  //   const payload = {
  //     email: "benyip5207@gmail.com",
  //     password: "5207logiNN",
  //   };

  //   const res = await LoginTest<Tokens>(payload);
  //   if (res?.status !== 200) return toast.error(res.msg);
  //   console.log(res.data);
  // };

  const getMeAction = async () => {
    const res = await getMe();
    if (res.status !== Status.OK) return toast.error(res.msg);
    console.log(res.data);
  };

  const cleanDataAction = async () => {
    const res = await cleanData();
    console.log(res);
  };

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  return (
    <div className={cn(className)} ref={asideRef} style={{ width }}>
      {asideOpen && (
        <div className="flex flex-col gap-4">
          {/* <Button variant={"outline"} onClick={login}>
            登录测试按钮
          </Button> */}

          {/* <Button variant={"destructive"} onClick={cleanDataAction}>
            Clean data
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default forwardRef(Aside);
