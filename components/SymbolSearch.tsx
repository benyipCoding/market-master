import { Search } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCategories, setCurrentCategory } from "@/store/fetchDataSlice";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const SymbolSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, currentCategory } = useSelector(
    (state: RootState) => state.fetchData
  );
  const parentCategories = useMemo(
    () => categories?.filter((c) => !c.parent_id),
    [categories]
  );

  useEffect(() => {
    if (!categories) dispatch(fetchCategories());
  }, []);

  return (
    <div className="w-fit md:w-[500px] lg:w-[750px] flex flex-col gap-4">
      <div className="flex items-center">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Filter emails..."
            className="max-w-sm pl-8"
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-2 text-slate-400">
            <Search size={18} />
          </span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {parentCategories?.map((c) => (
          <Button
            className={cn(
              "p-3 border rounded-lg cursor-pointer active:scale-100"
            )}
            variant={c === currentCategory ? "default" : "ghost"}
            key={c.id}
            onClick={() => dispatch(setCurrentCategory(c))}
          >
            {c.name}
          </Button>
        ))}
      </div>
      <ScrollArea className="h-96" thumbClass="dark:bg-primary-foreground">
        <div>123</div>
      </ScrollArea>
    </div>
  );
};

export default SymbolSearch;
