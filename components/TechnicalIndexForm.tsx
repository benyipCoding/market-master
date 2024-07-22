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
import { Search } from "lucide-react";

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
    <div className="flex gap-3 max-h-[60vh] min-h-[50vh]">
      <aside className="flex flex-col gap-2 min-w-72">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search index..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>

        <ScrollArea
          thumbClass="dark:bg-primary-foreground"
          className="border rounded-md"
        >
          <div className={cn("flex flex-col space-x-0 space-y-1")}>
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
  );
};

export default TechnicalIndexForm;
