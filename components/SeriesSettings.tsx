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

  const TABS = [
    {
      tabLabel: "Property",
      title: "Property settings",
      id: "property",
      com: <PropertySettingsForm />,
    },
    {
      tabLabel: "Series Data",
      title: "Data settings",
      id: "seriesData",
      com: <SeriesDataForm />,
    },
  ];

  return (
    <>
      <DialogHeader
        className={cn("py-6 cursor-grab", mousePressing && "cursor-grabbing")}
        onPointerDown={startDrag}
        onPointerUp={endDrag}
      >
        <DialogTitle className="select-none">Series Settings</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue={TABS[0].id} className="cursor-auto">
        <TabsList className="grid w-full grid-cols-2">
          {TABS.map((tab) => (
            <TabsTrigger value={tab.id} key={`tab_${tab.id}`}>
              {tab.tabLabel}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent value={tab.id} key={`content_${tab.id}`}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="select-none">{tab.title}</CardTitle>
              </CardHeader>
              {tab.com}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default SeriesSettings;
