import { AppDispatch, RootState } from "@/store";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AddPriceLinePayload,
  OrderSide,
  OrderType,
  PriceLineType,
  UpdatePriceLinePayload,
} from "../interfaces/CandlestickSeries";
import { generatePriceLineId, TitleCase } from "@/utils/helpers";
import OrderSideBtn from "./OrderSideBtn";
import { Input } from "../ui/input";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import MiniCalculator from "./MiniCalculator";
import LossAndProfit, { LossAndProfitRef } from "./LossAndProfit";
import Big from "big.js";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  createOrder,
  CreateOrderDto,
} from "@/app/playground/actions/createOrder";
import { OperationMode } from "../interfaces/Playground";
import { Status } from "@/utils/apis/response";
import { toast } from "sonner";
import { EmitteryContext, OnPriceLine } from "@/providers/EmitteryProvider";
import { fetchLimitOrders, fetchOpeningOrders } from "@/store/fetchDataSlice";
import { setCurrentOrderType } from "@/store/asideSlice";

const TradingAside: React.FC = () => {
  const { currentSymbol, backTestRecordKey } = useSelector(
    (state: RootState) => state.fetchData
  );
  const [currentSide, setCurrentSide] = useState<OrderSide>(OrderSide.SELL);
  const { currentOrderType } = useSelector((state: RootState) => state.aside);
  const [showCalculator, setShowCalculator] = useState(false);
  const unintInputRef = useRef<HTMLInputElement>(null);
  const [unitValue, setUnitValue] = useState<string>("100");
  const [preOrderPrice, setPreOrderPrice] = useState<undefined | string>(); // 预选的开仓价
  const { currentCandle, isBackTestMode } = useSelector(
    (state: RootState) => state.fetchData
  );

  const onClickCalculator = () => {
    unintInputRef.current?.focus();
    setShowCalculator((prev) => !prev);
  };
  const lossAndProfitRef = useRef<LossAndProfitRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { emittery } = useContext(EmitteryContext);

  const orderPrice = useMemo(() => {
    if (currentOrderType === OrderType.MARKET) return currentCandle?.close;
    else return preOrderPrice;
  }, [currentCandle?.close, currentOrderType, preOrderPrice]);

  const [limitOrderPriceLineId, setLimitOrderPriceLineId] = useState<
    string | undefined
  >(undefined);

  const unitFilterInput = (e: React.FormEvent<HTMLInputElement>) => {
    const isNum = !isNaN(Number((e.nativeEvent as any).data));
    if (!isNum) return;
    const value = String(Number((e.target as HTMLInputElement).value));
    setUnitValue(value);
  };

  const priceFilterInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = (e.target as any).value;
    if (isNaN(value)) return;
    setPreOrderPrice(value);
  };

  const formatPriceValue = () => {
    setPreOrderPrice((prev) => Number(prev).toFixed(currentSymbol?.precision));
  };

  const changePreOrderPrice = (type: "increase" | "decrease") => {
    switch (type) {
      case "increase":
        setPreOrderPrice((prev) =>
          new Big(Number(prev!))
            .add(new Big(currentSymbol?.minMove!).times(10))
            .toFixed(currentSymbol?.precision)
        );
        break;

      case "decrease":
        setPreOrderPrice((prev) =>
          new Big(Number(prev!))
            .minus(new Big(currentSymbol?.minMove!).times(10))
            .toFixed(currentSymbol?.precision)
        );
        break;
    }
  };

  const changePreOrderPriceByKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        changePreOrderPrice("increase");
        break;

      case "ArrowDown":
        e.preventDefault();
        changePreOrderPrice("decrease");
        break;

      default:
        break;
    }
  };

  const createOrderAction = useCallback(async () => {
    if (!isBackTestMode) {
      return toast.warning("Orders can be created only in BACK TEST mode");
    }
    if (!backTestRecordKey) throw new Error("Back test key is Null");

    const payload: CreateOrderDto = {
      symbol_id: currentSymbol?.id!,
      order_type: currentOrderType,
      side: currentSide,
      quantity: Number(unitValue),
      opening_price:
        currentOrderType === OrderType.MARKET
          ? Number(orderPrice)
          : Number(preOrderPrice),
      operation_mode: OperationMode.PRACTISE,
      time: currentCandle?.time!,
      stop_price: lossAndProfitRef.current?.activeStop
        ? lossAndProfitRef.current?.stopPrice
        : undefined,
      limit_price: lossAndProfitRef.current?.activeProfit
        ? lossAndProfitRef.current?.limitPrice
        : undefined,
      backtest_id: backTestRecordKey,
    };

    const res = await createOrder(payload);

    if (res.status !== Status.OK) return toast.error(res.msg);

    // 止损止盈的激活状态设置为false
    lossAndProfitRef.current?.setActiveProfit(false);
    lossAndProfitRef.current?.setActiveStop(false);

    // 查询订单表
    currentOrderType === OrderType.MARKET &&
      dispatch(fetchOpeningOrders(backTestRecordKey));
    currentOrderType === OrderType.LIMIT &&
      dispatch(fetchLimitOrders(backTestRecordKey));
  }, [
    backTestRecordKey,
    currentCandle?.time,
    currentOrderType,
    currentSide,
    currentSymbol?.id,
    dispatch,
    isBackTestMode,
    orderPrice,
    preOrderPrice,
    unitValue,
  ]);

  const updatePreOrderPriceByDrag = (payload: UpdatePriceLinePayload) => {
    if (payload.id.includes(PriceLineType.LimitOrderPrice)) {
      setPreOrderPrice(String(payload.options.price));
    }
  };

  const [subCanSubmit, setSubCanSubmit] = useState(false);
  const canSubmit = useMemo(
    () => isBackTestMode && subCanSubmit,
    [isBackTestMode, subCanSubmit]
  );

  const canSubmitChange = useCallback((canSubmit: boolean) => {
    setSubCanSubmit(canSubmit);
  }, []);

  useEffect(() => {
    if (currentOrderType === OrderType.LIMIT && !preOrderPrice)
      setPreOrderPrice(String(currentCandle?.close));

    return () => {
      if (currentOrderType === OrderType.LIMIT)
        setPreOrderPrice(String(currentCandle?.close));
    };
  }, [currentOrderType]);

  useEffect(() => {
    if (
      currentOrderType === OrderType.LIMIT &&
      isBackTestMode &&
      !limitOrderPriceLineId &&
      orderPrice
    ) {
      // 创建limitOrderPriceLine
      const id = generatePriceLineId(
        Number(orderPrice),
        PriceLineType.LimitOrderPrice
      );

      setLimitOrderPriceLineId(id);
      const payload: AddPriceLinePayload = {
        id,
        type: PriceLineType.LimitOrderPrice,
        price: Number(orderPrice),
      };
      emittery?.emit(OnPriceLine.add, payload);
    } else if (currentOrderType === OrderType.MARKET || !isBackTestMode) {
      if (limitOrderPriceLineId) {
        // 移除limitOrderPriceLine
        emittery?.emit(OnPriceLine.remove, limitOrderPriceLineId);
        setLimitOrderPriceLineId(undefined);
      }
    }
  }, [
    currentOrderType,
    emittery,
    isBackTestMode,
    limitOrderPriceLineId,
    orderPrice,
  ]);

  useEffect(() => {
    emittery?.on(OnPriceLine.updatePanel, updatePreOrderPriceByDrag);

    return () => {
      emittery?.off(OnPriceLine.updatePanel, updatePreOrderPriceByDrag);
    };
  }, [emittery]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="select-none">{currentSymbol?.label}, trading panel</h2>
      {/* Market or Limit */}
      <Tabs
        defaultValue={currentOrderType}
        className="flex flex-col gap-4"
        onValueChange={(value) =>
          dispatch(setCurrentOrderType(value as OrderType))
        }
      >
        <TabsList className="w-full flex">
          <TabsTrigger value={OrderType.MARKET} className="flex-1 select-none">
            {TitleCase(OrderType.MARKET)}
          </TabsTrigger>
          <TabsTrigger value={OrderType.LIMIT} className="flex-1 select-none">
            {TitleCase(OrderType.LIMIT)}
          </TabsTrigger>
        </TabsList>

        <div className="border-b-[1px]"></div>
      </Tabs>

      {/* Order side button */}
      <OrderSideBtn
        className={
          "flex-1 bg-secondary px-3 py-1 hover:text-[#c9c9c8] text-lg text-gray-400 transition-all duration-300 cursor-pointer flex-col justify-between"
        }
        currentSide={currentSide}
        setCurrentSide={setCurrentSide}
      />

      {/* Price when limit order */}
      {currentOrderType === OrderType.LIMIT && (
        <div className="relative">
          <p className="text-secondary-foreground mb-2 select-none">Price</p>
          <Input
            className="h-9 select-text"
            value={preOrderPrice}
            onInput={priceFilterInput}
            onBlur={formatPriceValue}
            onKeyDown={changePreOrderPriceByKeyDown}
          />
          <div className="w-7 h-8 absolute bottom-[2px] right-1 z-20 flex flex-col gap-[2px]">
            <ChevronUp
              className="cursor-pointer flex-1 rounded-sm hover:bg-secondary transition-all duration-200 active:scale-90"
              onClick={() => changePreOrderPrice("increase")}
            />
            <ChevronDown
              className="cursor-pointer flex-1 rounded-sm hover:bg-secondary transition-all duration-200 active:scale-90"
              onClick={() => changePreOrderPrice("decrease")}
            />
          </div>
        </div>
      )}

      {/* Units */}
      <div className="relative">
        <p className="text-secondary-foreground mb-2 select-none">Units</p>
        <Input
          className="h-9 select-text"
          ref={unintInputRef}
          value={unitValue}
          onInput={unitFilterInput}
        />
        <Calculator
          className="w-7 h-7 absolute bottom-1 right-1 z-20 cursor-pointer bg-background"
          onClick={onClickCalculator}
        />
        <MiniCalculator
          showCalculator={showCalculator}
          setShowCalculator={setShowCalculator}
          element={unintInputRef.current}
          setUnitValue={setUnitValue}
        />
      </div>

      <div className="border-b-[1px] mt-2"></div>

      {/* Stop Loss & Take Profit */}
      <LossAndProfit
        currentSide={currentSide}
        orderPrice={orderPrice}
        unitValue={Number(unitValue)}
        canSubmitChange={canSubmitChange}
        ref={lossAndProfitRef}
      />

      <div className="border-b-[1px] mt-2"></div>

      <Button
        className={cn(
          "flex flex-col h-fit py-1 active:scale-100 cursor-pointer",
          currentSide === OrderSide.BUY && "bg-primary hover:bg-primary",
          currentSide === OrderSide.SELL && "bg-red-600 hover:bg-red-600"
        )}
        onClick={createOrderAction}
        disabled={!canSubmit}
      >
        <p className="text-lg">{TitleCase(currentSide)}</p>
        <p className="text-xs">
          {unitValue} {currentSymbol?.label} @
          {currentOrderType === OrderType.LIMIT && preOrderPrice}{" "}
          {currentOrderType === OrderType.MARKET ? "MKT" : "LMT"}
        </p>
      </Button>
    </div>
  );
};

export default TradingAside;
