import { UploadFormValue } from "./UploadForm";

export interface UploadItemProps {
  accept: string;
  id: string;
  label: string;
  className?: string;
  onFileChange: (files: FileList | null) => void | Promise<void>;
  errorMessage: string;
  clearFiles: (e?: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  hasFile: boolean;
  formValue: UploadFormValue;
}
