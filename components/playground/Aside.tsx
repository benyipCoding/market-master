import { cn } from "@/lib/utils";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { AsideRef, AsideProps } from "../interfaces/Playground";
import { Button } from "../ui/button";

const Aside: React.ForwardRefRenderFunction<AsideRef, AsideProps> = (
  { className, asideOpen, handleProcessedData },
  ref
) => {
  const asideRef = useRef<HTMLDivElement>(null);

  const width = useMemo<string>(
    () => (asideOpen ? "19rem" : "0rem"),
    [asideOpen]
  );

  useImperativeHandle(ref, () => ({
    container: asideRef.current,
  }));

  return (
    <div className={cn(className)} ref={asideRef} style={{ width }}>
      <Button onClick={handleProcessedData}>Test</Button>
    </div>
  );
};

export default forwardRef(Aside);
