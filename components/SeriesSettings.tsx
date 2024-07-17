import { DialogTitle } from "@/components/ui/dialog";
import React, { useContext, useEffect, useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CustomDialogContentContext } from "./CustomDialogContent";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toggleMousePressing } from "@/store/commonSlice";
import { cn } from "@/lib/utils";
import PropertySettingsForm from "./PropertySettingsForm";
import SeriesDataForm from "./SeriesDataForm";
import { SeriesSettingsProps } from "./interfaces/SeriesSettings";

interface CommonFooterProps {
  onCancel: () => void;
  onApply: () => void;
  onSetDefault: () => void;
  formValueHasChanged: boolean;
}

export const CommonFooter: React.FC<CommonFooterProps> = ({
  formValueHasChanged,
  onCancel,
  onApply,
  onSetDefault,
}) => {
  return (
    <>
      <div className="absolute left-6 flex gap-2">
        <Button
          type="button"
          variant={"ghost"}
          size="sm"
          disabled={!formValueHasChanged}
          onClick={onSetDefault}
        >
          Set Default
        </Button>
      </div>
      <Button
        type="button"
        variant={"secondary"}
        size="sm"
        disabled={!formValueHasChanged}
        onClick={onApply}
      >
        Apply
      </Button>
      <Button type="button" variant={"outline"} size="sm" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm">Confirm</Button>
    </>
  );
};

const TABS = [
  {
    tabLabel: "Property",
    title: "Property settings",
    id: "property",
    // com: PropertySettingsForm,
  },
  {
    tabLabel: "Series Data",
    title: "Data settings",
    id: "seriesData",
    // com: SeriesDataForm ,
  },
];

const SeriesSettings: React.FC<SeriesSettingsProps> = ({
  setDialogVisible,
}) => {
  const [currentTab, setCurrentTab] = useState("property");
  const { dragControls } = useContext(CustomDialogContentContext);
  const { mousePressing } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls?.start(event);
    dispatch(toggleMousePressing(true));
  };
  const endDrag = () => dispatch(toggleMousePressing(false));

  useEffect(() => {
    document.addEventListener("pointerup", endDrag);
    return () => {
      document.removeEventListener("pointerup", endDrag);
    };
  }, []);

  return (
    <>
      <DialogHeader
        className={cn("py-6 cursor-grab", mousePressing && "cursor-grabbing")}
        onPointerDown={startDrag}
      >
        <DialogTitle className="select-none">Series Settings</DialogTitle>
      </DialogHeader>
      <Tabs
        className="cursor-auto"
        value={currentTab}
        onValueChange={setCurrentTab}
      >
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
              {tab.id === "property" ? (
                <PropertySettingsForm setDialogVisible={setDialogVisible} />
              ) : (
                <SeriesDataForm setDialogVisible={setDialogVisible} />
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      {/* <DialogFooter className="mt-2">
        <CommonFooter onConfirm={onConfirm} />
      </DialogFooter> */}
    </>
  );
};

export default SeriesSettings;
