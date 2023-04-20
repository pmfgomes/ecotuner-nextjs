import type { DropdownDataObj } from "@/components/client/Dropdown/Dropdown";

export const FREQUENCY: DropdownDataObj[] = [
  { id: "15m", label: "15 minutos", value: "15m" },
  { id: "30m", label: "30 minutos", value: "30m" },
  { id: "45m", label: "45 minutos", value: "45m" },
];

export const TIMESERIES_REGEX = new RegExp(/timeseries/gi);

export const DEFAULT_CHART_HEIGHT = "400px";
export const DEFAULT_CHART_SPAN = 12;
