import { LucideProps } from "lucide-react";

export interface TechnicalIndexFormProps {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

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
