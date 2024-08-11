import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";

interface UploadItemProps {
  accept: string;
  id: string;
  label: string;
  className?: string;
  onFileChange: (files: FileList | null) => void | Promise<void>;
  errorMessage: string;
  clearFiles: () => void;
}

const UploadItem: React.ForwardRefRenderFunction<
  HTMLInputElement,
  UploadItemProps
> = (
  { accept, id, label, className, onFileChange, errorMessage, clearFiles },
  ref
) => {
  return (
    <div className="form-item ">
      <Label htmlFor={id} className={cn(errorMessage && "text-destructive")}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="file"
          className={cn("cursor-pointer", className)}
          accept={accept}
          onChange={(e) => onFileChange(e.target.files)}
          ref={ref}
        />
        <CircleX
          size={18}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white"
          onClick={clearFiles}
        />
      </div>
      {errorMessage && (
        <p className="text-sm font-medium text-destructive select-none">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default forwardRef(UploadItem);
