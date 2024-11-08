import { Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCategories, setCurrentCategory } from "@/store/fetchDataSlice";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
const SymbolSearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showCollects, setShowCollects] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { categories, currentCategory, symbols } = useSelector(
    (state: RootState) => state.fetchData
  );
  const parentCategories = useMemo(
    () => categories?.filter((c) => !c.parent_id),
    [categories]
  );

  const displaySymbols = useMemo(() => {
    const arr = symbols?.filter((s) =>
      s.label.includes(searchValue.trim().toUpperCase())
    );

    if (currentCategory?.id === 0) return arr;
    return arr?.filter((s) => s.category_id === currentCategory?.id);
  }, [currentCategory?.id, symbols, searchValue]);

  const onSelectSymbol = (symbol_id: number) => {
    console.log(symbol_id);
  };

  useEffect(() => {
    if (!categories) dispatch(fetchCategories());
  }, []);

  return (
    <div className="w-fit md:w-[500px] lg:w-[750px] flex flex-col gap-4">
      <div className="flex items-center">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Filter symbols..."
            className="max-w-sm pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-2 text-slate-400">
            <Search size={18} />
          </span>
        </div>
      </div>
      <div className="flex">
        <div className="flex gap-2 flex-wrap flex-1">
          {parentCategories?.map((c) => (
            <Button
              className={cn(
                "p-3 border rounded-lg cursor-pointer active:scale-100"
              )}
              variant={c === currentCategory ? "default" : "ghost"}
              key={c.id}
              size={"sm"}
              onClick={() => dispatch(setCurrentCategory(c))}
            >
              {c.name}
            </Button>
          ))}
        </div>
        <div
          className="flex justify-center items-center mx-2 cursor-pointer text-primary"
          onClick={() => setShowCollects((prev) => !prev)}
        >
          {showCollects ? (
            <TiStarFullOutline size={30} />
          ) : (
            <TiStarOutline size={30} />
          )}
        </div>
      </div>

      <ScrollArea className="h-96" thumbClass="dark:bg-primary-foreground">
        {displaySymbols?.map((s) => (
          <div
            className="h-12 flex items-center px-2 border-b-1 box-border cursor-pointer hover:bg-secondary rounded-md relative"
            key={s.id}
            onClick={() => onSelectSymbol(s.id)}
          >
            <span className="flex-1 text-primary">{s.label}</span>
            <span className="flex-1 text-slate-300 text-sm">
              {s.description}
            </span>
            <p className="flex-1 text-slate-300 text-sm flex justify-center items-center">
              <IoIosHeartEmpty size={24} />
            </p>
            <Separator className="absolute bottom-0 w-full" />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default SymbolSearch;
