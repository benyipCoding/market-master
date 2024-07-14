import { DialogTitle } from "@/components/ui/dialog";
import React, { useContext } from "react";
import { DialogHeader } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Card, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { CustomDialogContentContext } from "./CustomDialogContent";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleMousePressing } from "@/store/commonSlice";
import { cn } from "@/lib/utils";

import PropertySettingsForm from "./PropertySettingsForm";
import SeriesDataForm from "./SeriesDataForm";

export const CommonFooter = () => {
  return (
    <CardFooter className="flex justify-end gap-2 relative">
      <Button
        type="button"
        variant={"ghost"}
        className="absolute left-6"
        size="sm"
      >
        Reset
      </Button>

      <Button type="button" variant={"secondary"} size="sm">
        Apply
      </Button>
      <Button type="button" variant={"outline"} size="sm">
        Cancel
      </Button>
      <Button size="sm">Confirm</Button>
    </CardFooter>
  );
};

const SeriesSettings = () => {
  const { dragControls } = useContext(CustomDialogContentContext);
  const { mousePressing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls?.start(event);
    dispatch(toggleMousePressing(true));
  };
  const endDrag = () => dispatch(toggleMousePressing(false));

  return (
    <>
      <DialogHeader
        className={cn("py-6 cursor-grab", mousePressing && "cursor-grabbing")}
        onPointerDown={startDrag}
        onPointerUp={endDrag}
      >
        <DialogTitle className="select-none">Series Settings</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="property" className="cursor-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="seriesData">Series Data</TabsTrigger>
        </TabsList>
        <TabsContent value="property">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="select-none">Property settings</CardTitle>
            </CardHeader>
            <PropertySettingsForm />
          </Card>
        </TabsContent>
        <TabsContent value="seriesData">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="select-none">Data settings</CardTitle>
            </CardHeader>
            <SeriesDataForm />
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SeriesSettings;
