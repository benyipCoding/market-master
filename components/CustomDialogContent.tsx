import {
  DialogClose,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { PropsWithChildren, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { customDialogContentPopIn } from "@/utils/motion";
import { CustomDialogContentProps } from "./interfaces/CustomDialogContent";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleMousePressing } from "@/store/commonSlice";

const CustomDialogContent: React.FC<
  PropsWithChildren<CustomDialogContentProps>
> = ({ children, dragConstraints, overlayClass, motionDivClass }) => {
  const dragControls = useDragControls();
  const { mousePressing } = useSelector((state: RootState) => state.common);
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch<AppDispatch>();

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls?.start(event);
    dispatch(toggleMousePressing(true));
  };

  const endDrag = () => {
    dispatch(toggleMousePressing(false));
  };

  useEffect(() => {
    document.addEventListener("pointerup", endDrag);

    return () => {
      document.removeEventListener("pointerup", endDrag);
    };
  }, []);

  return (
    <DialogPortal>
      <DialogOverlay className={cn("bg-transparent", overlayClass)} />
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
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg border bg-background p-6 shadow-lg sm:rounded-lg opacity-100 pt-0",
          motionDivClass
        )}
      >
        <DialogHeader
          className={cn("py-6 cursor-grab", mousePressing && "cursor-grabbing")}
          onPointerDown={startDrag}
        >
          <DialogTitle className="select-none">{dialogContent}</DialogTitle>
        </DialogHeader>

        {children}

        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </motion.div>
    </DialogPortal>
  );
};

export default CustomDialogContent;
