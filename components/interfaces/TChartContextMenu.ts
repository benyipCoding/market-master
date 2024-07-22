export interface TChartContextMenuRef {
  setSeriesSettingsDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TChartContextMenuProps {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dialogVisible: boolean;
}
