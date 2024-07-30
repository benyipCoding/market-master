import { AppDispatch, RootState } from "@/store";
import {
  setHoveringIndicator,
  setHoveringSeries,
  setSelectedIndicator,
  setSelectedSeries,
  toggleDrawing,
} from "@/store/commonSlice";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonsProps } from "./interfaces/Buttons";
import hotkeys from "hotkeys-js";
import { Button } from "./ui/button";
import { DialogContentType, setDialogContent } from "@/store/dialogSlice";

const Buttons: React.FC<ButtonsProps> = ({
  tChartRef,
  setDrawedLineList,
  setDialogVisible,
  setTechnicalIndicatorLines,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDrawing, selectedSeries, selectedIndicator } = useSelector(
    (state: RootState) => state.common
  );

  const onDeleteSeries = useCallback(() => {
    if (!tChartRef.current) return;
    const { chart, dialogVisible } = tChartRef.current;
    if (dialogVisible) return;
    if (selectedSeries) {
      chart.removeSeries(selectedSeries);
      const { id } = selectedSeries.options();
      setDrawedLineList((prev) =>
        prev.filter((lineOptions) => lineOptions.id !== id)
      );
      dispatch(setSelectedSeries(null));
    }

    if (selectedIndicator) {
      chart.removeSeries(selectedIndicator);
      const { id } = selectedIndicator.options();
      setTechnicalIndicatorLines((prev) =>
        prev.filter((item) => item.options.id !== id)
      );
      dispatch(setSelectedIndicator(null));
    }
  }, [selectedSeries, selectedIndicator]);

  const toggleDrawingState = useCallback(() => {
    if (!tChartRef.current) return;
    const { dialogVisible } = tChartRef.current;
    if (dialogVisible) return;
    dispatch(setSelectedSeries(null));
    dispatch(setHoveringSeries(null));
    dispatch(toggleDrawing(!isDrawing));
  }, [isDrawing]);

  const contextmenuHandler = (e: MouseEvent) => {
    e.preventDefault();
    if (!tChartRef.current) return;
    const { dialogVisible } = tChartRef.current;
    if (dialogVisible) return;
    dispatch(setSelectedSeries(null));
    dispatch(toggleDrawing(false));
  };

  const openTechnicalIndexDialog = () => {
    dispatch(setSelectedIndicator(null));
    dispatch(setDialogContent(DialogContentType.TechnicalIndex));
    Promise.resolve().then(() => setDialogVisible((prev) => !prev));
  };

  const closeDialogByESC = (e: KeyboardEvent) => {
    e.preventDefault();
    setDialogVisible(false);
  };

  // hotkeys
  useEffect(() => {
    hotkeys("l", toggleDrawingState);
    hotkeys("i", openTechnicalIndexDialog);
    hotkeys("Esc", closeDialogByESC);
    document.addEventListener("contextmenu", contextmenuHandler);

    return () => {
      hotkeys.unbind("l");
      hotkeys.unbind("i");
      hotkeys.unbind("Esc");
      document.removeEventListener("contextmenu", contextmenuHandler);
    };
  }, []);

  // Delete hotkeys
  useEffect(() => {
    if (selectedSeries || selectedIndicator) {
      hotkeys("Delete", onDeleteSeries);
    } else {
      hotkeys.unbind("Delete");
    }
  }, [selectedSeries, selectedIndicator]);

  return (
    <>
      <Button
        className="absolute left-2 top-2 z-10 hidden"
        variant="default"
        onClick={toggleDrawingState}
      >
        {isDrawing && !selectedSeries ? "Finish Draw" : "Start Draw"}
      </Button>
      <Button
        className="absolute left-32 top-2 z-10 hidden"
        variant="destructive"
        onClick={onDeleteSeries}
      >
        Delete
      </Button>
    </>
  );
};

export default Buttons;
