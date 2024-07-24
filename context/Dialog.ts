import { createContext } from "react";

interface IDialogContext {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogContext = createContext<IDialogContext>({
  setDialogVisible: () => {},
});
