import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
import {
  SidebarNavItemType,
  TechnicalIndexFormProps,
} from "../interfaces/TechnicalIndexForm";
import { SidebarNavItems } from "@/constants/technicalIndexList";
import { ScrollArea } from "../ui/scroll-area";
import { Search } from "lucide-react";
import MASettings from "./MASettings";
import EMASettings from "./EMASettings";
import MACDSettings from "./MACDSettings";

const TechnicalIndexForm: React.FC<TechnicalIndexFormProps> = ({
  setDialogVisible,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(
    SidebarNavItems[0].title
  );
  const [searchInput, setSearchInput] = useState("");

  const displayIndexList = useMemo(
    () =>
      SidebarNavItems.filter(
        (item) =>
          item.title.includes(searchInput.toUpperCase()) ||
          item.subTitle.includes(searchInput.toUpperCase()) ||
          item.title.includes(searchInput.toLowerCase()) ||
          item.subTitle.includes(searchInput.toLowerCase())
      ),
    [searchInput]
  );

  const onNavItemClick = (item: SidebarNavItemType) => {
    setCurrentTab(item.title);
  };

  return (
    <div className="flex gap-3 max-h-[60vh] min-h-[50vh]">
      <aside className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search index..."
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
                  onClick={() => onNavItemClick(item)}
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
      <Card className="min-w-[25vw]">
        {currentTab === "MA" && <MASettings />}
        {currentTab === "EMA" && <EMASettings />}
        {currentTab === "MACD" && <MACDSettings />}
      </Card>
    </div>
  );
};

export default TechnicalIndexForm;
