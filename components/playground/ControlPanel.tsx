import { motion, useDragControls } from "framer-motion";
import { SkipForward } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaPlay } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import { GoGrabber } from "react-icons/go";
import { controlPanelSlideIn } from "@/utils/motion";
import { EmitteryContext, OnContronPanel } from "@/providers/EmitteryProvider";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { IoMdPause } from "react-icons/io";
import hotkeys from "hotkeys-js";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ControlPanelProps {
  dragConstraints: React.RefObject<HTMLDivElement> | undefined;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ dragConstraints }) => {
  const dragControls = useDragControls();
  const { emittery } = useContext(EmitteryContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const { openingOrders } = useSelector((state: RootState) => state.fetchData);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls?.start(event);
  };

  const stopPlaying = (isExit: boolean = false) => {
    setIsPlaying(false);
    isExit && emittery?.emit(OnContronPanel.exit);
  };

  const playAction = (interval: number = 1000) => {
    const timeId = setInterval(() => {
      emittery?.emit(OnContronPanel.nextTick);
    }, interval);

    setTimer(timeId);
  };

  const togglePlayingState = () => setIsPlaying((prev) => !prev);

  const handleExitBackTest = () => {
    if (openingOrders.length) {
      setAlertDialogOpen(true);
    }
    stopPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && !timer) {
      playAction();
    } else if (!isPlaying && timer) {
      clearInterval(timer);
      setTimer(null);
    }

    return () => {
      timer && clearInterval(timer);
    };
  }, [isPlaying, timer]);

  useEffect(() => {
    emittery?.on(OnContronPanel.stopPlaying, stopPlaying);

    return () => {
      emittery?.off(OnContronPanel.stopPlaying, stopPlaying);
    };
  }, [emittery]);

  useEffect(() => {
    hotkeys("p", togglePlayingState);

    return () => {
      hotkeys.unbind("p");
    };
  }, []);

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <motion.div
          variants={controlPanelSlideIn()}
          initial="hidden"
          whileInView="show"
          drag
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={dragConstraints}
          dragTransition={{ power: 0 }}
          className="bg-background border absolute left-1/2 top-0 z-50 flex p-1 rounded-lg items-center"
        >
          {/* Previous tick */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="px-2 active:scale-100"
                variant={"ghost"}
                size={"sm"}
                onClick={() => emittery?.emit(OnContronPanel.prevTick)}
              >
                <SkipForward size={22} className="rotate-180 text-[#f0ce5d]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex" side="bottom">
              <p className="nav-item-divider">Previous tick</p>
              <span className="short-cut">B</span>
            </TooltipContent>
          </Tooltip>

          {/* Play & Pause*/}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="px-2 active:scale-100"
                variant={"ghost"}
                size={"sm"}
                onClick={togglePlayingState}
              >
                {isPlaying ? (
                  <IoMdPause size={20} className="text-[#00a6ed]" />
                ) : (
                  <FaPlay size={16} className="text-[#16d36b]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex" side="bottom">
              <p className="nav-item-divider">Play</p>
              <span className="short-cut">P</span>
            </TooltipContent>
          </Tooltip>

          {/* Next tick */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="px-2 active:scale-100"
                variant={"ghost"}
                size={"sm"}
                onClick={() => emittery?.emit(OnContronPanel.nextTick)}
              >
                <SkipForward size={22} className="text-[#f0ce5d]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex" side="bottom">
              <p className="nav-item-divider">Next tick</p>
              <span className="short-cut">N</span>
            </TooltipContent>
          </Tooltip>

          {/* Exit */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="px-2 active:scale-100"
                variant={"ghost"}
                size={"sm"}
                onClick={handleExitBackTest}
              >
                <FaSquare size={18} className="text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex" side="bottom">
              <p className="nav-item-divider">Exit</p>
              <span className="short-cut">T</span>
            </TooltipContent>
          </Tooltip>

          {/* Grabber */}
          <div onPointerDown={startDrag} className="z-50 select-none ml-1">
            <GoGrabber size={34} className="cursor-move" />
          </div>
        </motion.div>
      </TooltipProvider>

      <AlertDialog open={alertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue BackTest ?</AlertDialogTitle>
            <AlertDialogDescription>
              Your last BackTest has not finished yet, do you need to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ControlPanel;
