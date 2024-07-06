import { AppDispatch, RootState } from "@/store";
import { setSelectedSeries, toggleDrawing } from "@/store/commonSlice";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonsProps } from "./interfaces/Buttons";
import hotkeys from "hotkeys-js";

const Buttons: React.FC<ButtonsProps> = ({ tChartRef, setDrawedLineList }) => {
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
  }, [dispatch, isDrawing]);

  const contextmenuHandler = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(setSelectedSeries(null));
    dispatch(toggleDrawing(false));

    setTimeout(() => {
      document.removeEventListener("contextmenu", contextmenuHandler);
    }, 500);
  };

  // l hotkeys
  useEffect(() => {
    hotkeys("l", toggleDrawingState);

    return () => {
      hotkeys.unbind("l");
    };
  }, []);

  // Delete hotkeys
  useEffect(() => {
    if (selectedSeries) {
      hotkeys("Delete", onDeleteSeries);
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
      <div
        className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleDrawingState}
      >
        {isDrawing && !selectedSeries ? "Finish Draw" : "Start Draw"}
      </div>

      <div
        className="absolute left-40 top-0 p-2 bg-red-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={onDeleteSeries}
      >
        Delete
      </div>
    </>
  );
};

export default Buttons;
