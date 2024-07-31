import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface AsideProps {
  className?: string;
}

const Aside: React.FC<AsideProps> = ({ className }) => {
  const asideRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<string>("19rem");

  useEffect(() => {
    console.log("asideRef:", asideRef.current?.offsetWidth);
  }, []);

  return (
    <div
      className={cn(className)}
      style={{ width, resize: "horizontal" }}
      ref={asideRef}
    >
      Aside
    </div>
  );
};

export default Aside;
