export interface PropertySettingsFormValueType {
  seriesLabel: string;
  showLabel: boolean;
  seriesColor: string;
  lineWidth: string;
  lineStyle: string;
}

export interface SeriesDataFormValueType extends Record<string, any> {
  startPointValue: string;
  startPointTime: Date | string;
  endPointValue: string;
  endPointTime: Date | string;
}

export interface CommonProps {
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SeriesSettingsProps extends CommonProps {}

export interface PropertySettingsFormProps extends CommonProps {}

export interface SeriesDataFormProps extends CommonProps {}
