"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { toast } from "sonner";
import { getMe } from "@/app/(root)/auth/login/getMe";
import { cleanData } from "@/app/playground/actions/cleanData";
import { Status } from "@/utils/apis/response";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

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
    <div className={cn(className)} ref={asideRef}>
      <div className="flex flex-col gap-4">
        {/* <Button variant={"outline"} onClick={login}>
            登录测试按钮
          </Button> */}

        {/* <Button variant={"destructive"} onClick={cleanDataAction}>
            Clean data
          </Button> */}
      </div>
    </div>
  );
};

export default forwardRef(Aside);
