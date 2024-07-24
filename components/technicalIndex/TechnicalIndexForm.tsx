import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TechnicalIndexFormProps } from "@/components/interfaces/TechnicalIndexForm";
import {
  TechnicalIndexItemTitleType,
  TechnicalIndexItemType,
  TechnicalIndexList,
} from "@/constants/technicalIndexList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import {
  MASettings,
  EMASettings,
  MACDSettings,
} from "@/components/technicalIndex";

const EmptyState = () => {
  return (
    <div className="h-full flex justify-center items-center text-gray-400 dark:text-gray-500 text-xl font-semibold">
      Select a technical indicator
    </div>
  );
};

const TechnicalIndexForm: React.FC<TechnicalIndexFormProps> = () => {
  const [searchInput, setSearchInput] = useState("");

  const displayIndexList = useMemo(
    () =>
      TechnicalIndexList.filter(
        (item) =>
          item.title.includes(searchInput.toUpperCase()) ||
          item.subTitle.includes(searchInput.toUpperCase()) ||
          item.title.includes(searchInput.toLowerCase()) ||
          item.subTitle.includes(searchInput.toLowerCase())
      ),
    [searchInput]
  );

  const [currentTab, setCurrentTab] = useState<
    TechnicalIndexItemTitleType | ""
  >(displayIndexList[0].title);

  const onIndicatorItemClick = (item: TechnicalIndexItemType) => {
    setCurrentTab(item.title);
  };

  return (
    <div className="flex gap-3 h-[30rem] w-[50rem]">
      <aside className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search indicator..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <ScrollArea thumbClass="dark:bg-primary-foreground">
          <div className={cn("flex flex-col space-x-0 space-y-1")}>
            {displayIndexList.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Button
                  variant={"ghost"}
                  key={index}
                  className={cn(
                    "h-fit justify-start active:scale-100",
                    currentTab === item.title && "bg-muted hover:bg-muted"
                  )}
                  onClick={() => onIndicatorItemClick(item)}
                >
                  <div className="text-start flex flex-col pl-8 relative">
                    {item.title}
                    <p className="text-gray-500 dark:text-gray-400 w-60 text-ellipsis overflow-hidden">
                      {item.subTitle}
                    </p>
                    <IconComponent className="absolute left-0 top-1/2 -translate-y-1/2" />
                    <span className="sr-only">{item.subTitle}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        {!displayIndexList.length && (
          <div className="flex-1 flex justify-center items-center text-gray-400 dark:text-gray-500">
            No index found...
          </div>
        )}
      </aside>
      <Card className="w-full">
        {!currentTab && <EmptyState />}
        {currentTab === "MA" && <MASettings />}
        {currentTab === "EMA" && <EMASettings />}
        {currentTab === "MACD" && <MACDSettings />}
      </Card>
    </div>
  );
};

export default TechnicalIndexForm;
