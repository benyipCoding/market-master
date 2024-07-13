import {
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { produce } from "immer";

interface Props {
  dialogVisible: boolean;
  dragConstraints: React.RefObject<HTMLDivElement>;
}

const INITIAL_POSITION = { left: "", top: "" };

const CustomDialogContent: React.FC<PropsWithChildren<Props>> = ({
  children,
  dialogVisible,
  dragConstraints,
}) => {
  const [position, setPosition] = useState(INITIAL_POSITION);

  useEffect(() => {
    if (!dialogVisible) {
      setPosition(INITIAL_POSITION);
      return;
    }
    Promise.resolve().then(() => {
      const motionDiv = document.querySelector("#dialogContent");
      const { width, height } = motionDiv?.getBoundingClientRect()!;
      setPosition(
        produce(position, (position) => {
          const left = window.innerWidth / 2 - width / 2;
          const top = window.innerHeight / 2 - height / 2;
          position.left = `${left}px`;
          position.top = `${top}px`;
        })
      );
    });
  }, [dialogVisible]);

  return (
    <DialogPortal>
      <DialogOverlay className="bg-transparent" />

      <motion.div
        drag
        dragConstraints={dragConstraints}
        dragTransition={{ power: 0 }}
        className={cn(
          "fixed z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg opacity-100",
          (!position.left || !position.top) && "opacity-0 pointer-events-none"
        )}
        id="dialogContent"
        style={position}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </motion.div>
    </DialogPortal>
  );
};

export default CustomDialogContent;

// <motion.div
// className={cn(
//   "fixed z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
// )}
// drag
// >
// {children}

// </motion.div>
