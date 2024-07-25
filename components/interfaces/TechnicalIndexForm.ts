import { SeriesColorType } from "@/constants/seriesOptions";
import { TechnicalIndexItemTitleType } from "@/constants/technicalIndexList";
import { LucideProps } from "lucide-react";
import { CalculatePriceType } from "../commonFormItem/PeriodItem";

export interface TechnicalIndexFormProps {}

export type SidebarNavItemType = {
  title: string;
  subTitle: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export interface CommonHeaderProps {
  title: string;
  titleClass?: string;
  description: string;
}

export interface BaseFormValue {
  id: string;
  indicator: TechnicalIndexItemTitleType;
  name: string;
}

export interface EMAFormValue extends BaseFormValue {
  lineWidth: string;
  lineStyle: string;
  period: string;
  calculatePrice: CalculatePriceType;
  seriesColor: SeriesColorType;
}
