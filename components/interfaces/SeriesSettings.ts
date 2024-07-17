export interface PropertySettingsFormValueType {
  seriesLabel: string;
  showLabel: boolean;
  seriesColor: string;
  lineWidth: string;
  lineStyle: string;
}

export interface SeriesDataFormValueType extends Record<string, any> {
  startPointValue: string;
  startPointTime: Date | undefined;
  endPointValue: string;
  endPointTime: Date | undefined;
}
