import { cn } from "@/lib/utils";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  SidebarNavItemType,
  TechnicalIndexFormProps,
} from "./interfaces/TechnicalIndexForm";
import { SidebarNavItems } from "@/constants/technicalIndexList";
import { ScrollArea } from "./ui/scroll-area";

const TechnicalIndexForm: React.FC<TechnicalIndexFormProps> = ({
  setDialogVisible,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(
    SidebarNavItems[0].title
  );

  const onNavItemClick = (item: SidebarNavItemType) => {
    setCurrentTab(item.title);
  };

  return (
    <div className="flex gap-3">
      <aside className="flex flex-col gap-2 min-w-60 h-96">
        <Input />
        <ScrollArea>
          <div
            className={cn(
              "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
            )}
          >
            {SidebarNavItems.map((item, index) => {
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
                    <p className="text-gray-500 dark:text-gray-400">
                      {item.subTitle}
                    </p>
                    <IconComponent className="absolute left-0 top-1/2 -translate-y-1/2" />
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>
      <div className="flex-1 w-fit">
        <Card className="min-w-96">
          <CardHeader>
            <CardTitle>Moving average</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalIndexForm;
