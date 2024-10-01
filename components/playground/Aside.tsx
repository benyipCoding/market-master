import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { Button } from "../ui/button";
import { useAutomaticLineDrawing } from "@/hooks/useAutomaticLineDrawing";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, asideOpen, setDrawedLineList, tChartRef },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

  const width = useMemo<string>(
    () => (asideOpen ? "19rem" : "0rem"),
    [asideOpen]
  );

  const { performDrawing } = useAutomaticLineDrawing({
    setDrawedLineList,
    tChartRef,
  });

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  return (
    <div className={cn(className)} ref={asideRef} style={{ width }}>
      <Button onClick={performDrawing}>Test</Button>
    </div>
  );
};

export default forwardRef(Aside);
