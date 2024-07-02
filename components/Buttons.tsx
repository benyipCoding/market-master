import { AppDispatch, RootState } from "@/store";
import { toggleDrawing } from "@/store/commonSlice";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonsProps } from "./interfaces/Buttons";

const Buttons: React.FC<ButtonsProps> = ({ tChartRef, setDrawedLineList }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDrawing } = useSelector((state: RootState) => state.common);

  const onDeleteSeries = () => {
    if (!tChartRef.current) return;
    const { selectedSeries, chart, setSelectedSeries } = tChartRef.current;
    chart.removeSeries(selectedSeries);
    const { id } = selectedSeries.options();

    setDrawedLineList((prev) =>
      prev.filter((lineOptions) => lineOptions.id !== id)
    );

    setSelectedSeries(null);
  };

  const toggleDrawingState = useCallback(
    () => dispatch(toggleDrawing(!isDrawing)),
    [dispatch, isDrawing]
  );

  return (
    <>
      <div
        className="absolute left-0 top-0 p-2 bg-blue-500 z-10 flex justify-center items-center cursor-pointer"
        onClick={toggleDrawingState}
      >
        {isDrawing ? "Finish Draw" : "Start Draw"}
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