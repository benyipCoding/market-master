import { DragControls } from "framer-motion";

export interface CustomDialogContentProps {
  dragConstraints: React.RefObject<HTMLDivElement>;
}

export interface ICustomDialogContentContext {
  dragControls?: DragControls;
}
