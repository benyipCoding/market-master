import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CircleX, Plus, Sheet } from "lucide-react";
import { UploadItemProps } from "../interfaces/UploadItem";
import { motion } from "framer-motion";
import { popIn, textVariant } from "@/utils/motion";

const descriptionList = [
  { label: "Interval", prop: "interval" },
  { label: "Precision", prop: "toFixedNum" },
  { label: "Total", prop: "total" },
];

const UploadItem: React.ForwardRefRenderFunction<
  HTMLInputElement,
  UploadItemProps
> = (
  {
    accept,
    id,
    label,
    className,
    onFileChange,
    errorMessage,
    clearFiles,
    hasFile,
    formValue,
  },
  ref
) => {
  return (
    <div className="form-item ">
      <Label className={cn(errorMessage && "text-destructive")}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="file"
          className={cn("cursor-pointer hidden", className)}
          accept={accept}
          onChange={(e) => onFileChange(e.target.files)}
          ref={ref}
        />
        <div
          className={cn(
            "h-28 flex items-center transition-all pl-[50%] duration-500 ease-in-out",
            hasFile && "px-8 gap-4"
          )}
        >
          <Label
            htmlFor={hasFile ? "" : id}
            className={cn(
              "border border-input h-28 w-28 rounded-md -translate-x-1/2 cursor-pointer flex justify-center items-center relative transition-all duration-500 ease-in-out",
              hasFile && "translate-x-0"
            )}
          >
            {hasFile ? (
              <Sheet size={70} />
            ) : (
              <Plus size={40} className="text-gray-400 dark:text-gray-500" />
            )}

            {hasFile && (
              <motion.div
                variants={popIn()}
                initial="hidden"
                whileInView="show"
                className="absolute -right-2 -top-2 bg-background cursor-pointer"
              >
                <CircleX
                  size={24}
                  className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white"
                  onClick={(e) => clearFiles(e)}
                />
              </motion.div>
            )}
          </Label>

          {hasFile && (
            <div className="flex-1 h-full px-2 flex flex-col justify-evenly">
              {descriptionList.map((item, index) => (
                <motion.div
                  variants={textVariant(0.2 + index / 10)}
                  className="flex"
                  initial="hidden"
                  whileInView="show"
                  key={index}
                >
                  <span className="flex-1">{item.label}</span>
                  <span className="flex-1">{formValue[item.prop]}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
