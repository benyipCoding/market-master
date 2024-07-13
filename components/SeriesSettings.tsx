import { DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { DialogHeader } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";

const SeriesSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      seriesLabel: "",
      showLabel: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Series Settings</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="property" className="cursor-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="seriesData">Series Data</TabsTrigger>
        </TabsList>
        <TabsContent value="property">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Property settings</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  {/* Series label */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="seriesLabel"
                      className="py-1 flex justify-between"
                    >
                      Series Label
                      <Label
                        className="flex items-center gap-2 cursor-pointer"
                        htmlFor="showLabel"
                      >
                        Show Label
                        <Checkbox id="showLabel" {...register("showLabel")} />
                      </Label>
                    </Label>
                    <Input
                      id="seriesLabel"
                      placeholder="Name of the series"
                      {...register("seriesLabel")}
                    />
                  </div>

                  {/* Color picker */}
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
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant={"secondary"} className="">
                  Apply
                </Button>
                <Button variant={"outline"}>Cancel</Button>
                <Button type="submit">Confirm</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="seriesData">
          <div className="bg-rose-500">series data</div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SeriesSettings;
