import {
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import React, { createContext, PropsWithChildren } from "react";
import { motion, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

import { customDialogContentPopIn } from "@/utils/motion";
import {
  ICustomDialogContentContext,
  CustomDialogContentProps,
} from "./interfaces/CustomDialogContent";

export const CustomDialogContentContext =
  createContext<ICustomDialogContentContext>({});

const CustomDialogContent: React.FC<
  PropsWithChildren<CustomDialogContentProps>
> = ({ children, dragConstraints }) => {
  const dragControls = useDragControls();

  return (
    <DialogPortal>
      <DialogOverlay className="bg-transparent" />
      <motion.div
        variants={customDialogContentPopIn()}
        initial="hidden"
        whileInView="show"
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={dragConstraints}
        dragTransition={{ power: 0 }}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg border bg-background p-6 shadow-lg sm:rounded-lg opacity-100 pt-0"
        )}
      >
        <CustomDialogContentContext.Provider value={{ dragControls }}>
          {children}
        </CustomDialogContentContext.Provider>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </motion.div>
    </DialogPortal>
  );
};

export default CustomDialogContent;
