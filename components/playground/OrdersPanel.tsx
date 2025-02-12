"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
const OrderTabs = ["Opening", "Total", "Limit", "Closed"];
const OrdersPanel = () => {
  const [currentTab, setcurrentTab] = useState(0);

  return (
    <>
      <nav className="flex gap-2">
        {OrderTabs.map((tab, index) => (
          <Button
            size={"sm"}
            className="active:scale-100"
            variant={currentTab === index ? "default" : "ghost"}
            key={tab}
            onClick={() => setcurrentTab(index)}
          >
            {tab}
          </Button>
        ))}
      </nav>
      <div className="flex-1 bg-pink-300"></div>
    </>
  );
};

export default OrdersPanel;
