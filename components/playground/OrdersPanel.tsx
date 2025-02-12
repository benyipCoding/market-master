"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
const OrderTabs = ["Opening", "Total", "Limit", "Closed"];
const OrdersPanel = () => {
  const [currentTab, setcurrentTab] = useState(0);

  return (
    <>
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
      <div className="flex-1"></div>
    </>
  );
};

export default OrdersPanel;
