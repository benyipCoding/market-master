"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { toast } from "sonner";
import { getMe } from "@/app/(root)/auth/login/getMe";
import { cleanData } from "@/app/playground/actions/cleanData";
import { Status } from "@/utils/apis/response";
import { Button } from "../ui/button";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

  // const createMarketOrder = () => {};

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  return (
    <div className={cn(className)} ref={asideRef}>
      <div className="flex flex-col gap-4">
        {/* <Button
          variant={"default"}
          className="active:scale-100"
          onClick={createMarketOrder}
        >
          Market Order
        </Button>

        <Button variant={"default"} className="active:scale-100">
          Pending Order
        </Button> */}
      </div>
    </div>
  );
};

export default forwardRef(Aside);
