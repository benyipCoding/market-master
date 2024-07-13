import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

const SeriesSettings = () => {
  return (
    <DialogContent hideOverlay={true} className="bg-blue-300 duration-0">
      <DialogHeader className="">
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

            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of the series" />
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
          </Card>
        </TabsContent>
        <TabsContent value="seriesData">
          <div className="bg-rose-500">series data</div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default SeriesSettings;
