import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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
    com: PropertySettingsForm,
  },
  {
    tabLabel: "Series Data",
    title: "Data settings",
    id: "seriesData",
    com: SeriesDataForm,
  },
];

const SeriesSettings: React.FC<SeriesSettingsProps> = ({
  setDialogVisible,
}) => {
  const [currentTab, setCurrentTab] = useState("property");

  return (
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
      {TABS.map((tab) => {
        const DynamicCom = tab.com;
        return (
          <TabsContent value={tab.id} key={`content_${tab.id}`}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="select-none">{tab.title}</CardTitle>
              </CardHeader>
              <DynamicCom setDialogVisible={setDialogVisible} />
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default SeriesSettings;
