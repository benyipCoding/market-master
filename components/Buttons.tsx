import { AppDispatch, RootState } from "@/store";
import { setSelectedSeries, toggleDrawing } from "@/store/commonSlice";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonsProps } from "./interfaces/Buttons";
import hotkeys from "hotkeys-js";
import { Button } from "./ui/button";
import { DialogContentType, setDialogContent } from "@/store/dialogSlice";

const Buttons: React.FC<ButtonsProps> = ({
  tChartRef,
  setDrawedLineList,
  setDialogVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDrawing, selectedSeries } = useSelector(
    (state: RootState) => state.common
  );

  const onDeleteSeries = useCallback(() => {
    if (!tChartRef.current) return;
    const { chart } = tChartRef.current;
    if (!selectedSeries) return;
    chart.removeSeries(selectedSeries);
    const { id } = selectedSeries.options();
    setDrawedLineList((prev) =>
      prev.filter((lineOptions) => lineOptions.id !== id)
    );
    dispatch(setSelectedSeries(null));
  }, [selectedSeries]);

  const toggleDrawingState = useCallback(() => {
    dispatch(setSelectedSeries(null));
    dispatch(toggleDrawing(!isDrawing));
  }, [isDrawing]);

  const contextmenuHandler = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(setSelectedSeries(null));
    dispatch(toggleDrawing(false));

    setTimeout(() => {
      document.removeEventListener("contextmenu", contextmenuHandler);
    }, 500);
  };

  const openTechnicalIndexDialog = () => {
    dispatch(setDialogContent(DialogContentType.TechnicalIndex));
    Promise.resolve().then(() => setDialogVisible(true));
  };

  // hotkeys
  useEffect(() => {
    hotkeys("l", toggleDrawingState);
    hotkeys("i", openTechnicalIndexDialog);

    return () => {
      hotkeys.unbind("l");
      hotkeys.unbind("i");
    };
  }, []);

  // Delete hotkeys
  useEffect(() => {
    if (selectedSeries) {
      hotkeys("Delete", onDeleteSeries);

      document.addEventListener("contextmenu", contextmenuHandler);
    } else {
      hotkeys.unbind("Delete");
    }
  }, [selectedSeries]);

  useEffect(() => {
    if (!isDrawing) return;

    document.addEventListener("contextmenu", contextmenuHandler);
  }, [isDrawing]);

  return (
    <>
      <Button
        className="absolute left-2 top-2 z-10"
        variant="default"
        onClick={toggleDrawingState}
      >
        {isDrawing && !selectedSeries ? "Finish Draw" : "Start Draw"}
      </Button>
      <Button
        className="absolute left-32 top-2 z-10"
        variant="destructive"
        onClick={onDeleteSeries}
      >
        Delete
      </Button>
    </>
  );
};

export default Buttons;
