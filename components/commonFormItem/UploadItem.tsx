import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

const UploadItem = () => {
  return (
    <div className="form-item">
      <Label htmlFor="fileData">File</Label>
      <Input id="fileData" type="file" className="cursor-pointer" />
    </div>
  );
};

export default UploadItem;
