"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
const OrderTabs = ["Opening", "Total", "Limit", "Closed"];
const OrdersPanel = () => {
  const [currentTab, setcurrentTab] = useState(0);

  return (
    <div className="h-full flex flex-col gap-2">
      <nav className="flex gap-2">
        {OrderTabs.map((tab, index) => (
          <Button
            size={"sm"}
            className={cn(
              "active:scale-100",
              currentTab === index && "bg-secondary"
            )}
            variant={"ghost"}
            key={tab}
            onClick={() => setcurrentTab(index)}
          >
            {tab}
          </Button>
        ))}
      </nav>
      <div className="flex-1 bg-secondary"></div>
    </div>
  );
};

export default OrdersPanel;
