import type {
  GrafanaChartsObj,
  GrafanaDashboardChartsName,
  GrafanaAlertsChartsName,
  GrafanaRecommendationsChartsName,
} from "@/store/services/chartsGrafanaApiSlice";
import { DEFAULT_CHART_HEIGHT, DEFAULT_CHART_SPAN } from "./constants";

export interface ChartSettingsForChartType {
  width: string | undefined;
  height: string | undefined;
  span: number | undefined;
}

interface SelectChartSettingsForChartTypeArgs {
  chartType:
    | GrafanaAlertsChartsName
    | GrafanaDashboardChartsName
    | GrafanaRecommendationsChartsName;
  index: number;
  dataLength: number;
}

export const selectChartSettingsForChartType = (args: SelectChartSettingsForChartTypeArgs) => {
  const { chartType, dataLength = 0, index = 0 } = args;
  const newIndex = index + 1;
  const settings: ChartSettingsForChartType = {
    width: undefined,
    height: "200px",
    span: undefined,
  };
  const ignoreRegex = new RegExp(/(pie|timeseries|barchart)/gi);

  switch (chartType) {
    case "ucaCharts":
      settings.width = "800px";
      settings.span = 6;
      break;
    case "ucaRecommendationCharts":
      settings.width = "800px";
      settings.span = 6;
      break;
    case "currentRoomCharts":
      settings.width = "600px";
      settings.span = 6;
      break;
    case "otherCharts":
      settings.width = "800px";
      settings.height = "400px";
      settings.span = 6;
      break;
    case "thresholdCharts":
      settings.height = "400px";
      settings.span = 6;
      break;
    case "ucaSetpointsCharts":
      settings.height = "400px";
      settings.span = 6;
      break;
    case "vsCharts":
      settings.height = "400px";
      settings.span = 6;
      break;
    case "pueAverageCharts":
      settings.height = "400px";
      settings.span = 6;
      break;
    default:
      settings.height = DEFAULT_CHART_HEIGHT;
      settings.span = DEFAULT_CHART_SPAN;
      break;
  }

  if (!chartType.match(ignoreRegex) && dataLength === newIndex && newIndex % 2 !== 0) {
    settings.span = 12;
  }

  return settings;
};

export const DEFAULT_AUTO_REFRESH_VALUE = "15m";
export const DEFAULT_RANGE_DATE_FROM = "now-24h";
export const DEFAULT_RANGE_DATE_TO = "now";

export const parseGrafanaDashboardChartsData = (data: GrafanaChartsObj[]) => {
  const parametersToAddInGrafanaUrls = `&refresh=${DEFAULT_AUTO_REFRESH_VALUE}&from=${DEFAULT_RANGE_DATE_FROM}&to=${DEFAULT_RANGE_DATE_TO}`;
  const ucaChartsRegex = new RegExp(/.*uca\d+.*/gi);

  const newResponse: Record<GrafanaDashboardChartsName, GrafanaChartsObj[]> = {
    ucaCharts: [],
    currentRoomCharts: [],
    otherCharts: [],
  };

  data.forEach((dataObj) => {
    const newDataObj: GrafanaChartsObj = structuredClone(dataObj);
    newDataObj.iframe_url = `${dataObj.iframe_url}${parametersToAddInGrafanaUrls}`;

    if (dataObj.type === "stat" && dataObj.id.match(ucaChartsRegex)) {
      newResponse["ucaCharts"].push(newDataObj);
    } else if (dataObj.type === "stat" && !dataObj.id.match(ucaChartsRegex)) {
      newResponse["currentRoomCharts"].push(newDataObj);
    } else {
      newResponse["otherCharts"].push(newDataObj);
    }
  });
  newResponse["ucaCharts"]?.sort((a, b) => a.id.localeCompare(b.id));

  return newResponse;
};

export const parseGrafanaRecommendationsChartsData = (data: GrafanaChartsObj[]) => {
  const ucaSetpointsChartsRegex = new RegExp(/.*(?=.*uca)(?=.*setpoints).*/gi);
  const ucaRecommendationsChartsRegex = new RegExp(/.*(?=.*uca\d*)(?=.*recommendations).*/gi);
  const barChartsAverageRegex = new RegExp(/.*(?=.*pue)(?=.*(average)).*/gi);
  const barChartsMonthlyAverageRegex = new RegExp(/.*(?=.*pue)(?=.*monthly).*/gi);
  const barChartsWeeklyAverageRegex = new RegExp(/.*(?=.*pue)(?=.*weekly).*/gi);
  const vsChartsRegex = new RegExp(/.*(?=.*pue)(?=.*vs).*/gi);

  const newResponse: Record<GrafanaRecommendationsChartsName, GrafanaChartsObj[]> = {
    ucaRecommendationCharts: [],
    pueAverageCharts: [],
    vsCharts: [],
    ucaSetpointsCharts: [],
    otherCharts: [],
    otherTimeseriesCharts: [],
  };

  data.forEach((item) => {
    const newItem = structuredClone(item);
    let newDataRangeFrom = DEFAULT_RANGE_DATE_FROM;

    if (item.type === "barchart") {
      if (item.id.match(barChartsWeeklyAverageRegex)) {
        newDataRangeFrom = "now-7d";
      }

      if (item.id.match(barChartsMonthlyAverageRegex)) {
        newDataRangeFrom = "now-30d";
      }
    }

    const parametersToAddInGrafanaUrls = parseGrafanaUrlsParameters({
      from: newDataRangeFrom,
      to: DEFAULT_RANGE_DATE_TO,
      refresh: DEFAULT_AUTO_REFRESH_VALUE,
    });
    newItem["iframe_url"] = `${item.iframe_url}${parametersToAddInGrafanaUrls}`;

    if (item.type === "barchart" && item.id.match(barChartsAverageRegex)) {
      newResponse["pueAverageCharts"].push(newItem);
    } else if (item.type === "stat" && item.id.match(ucaRecommendationsChartsRegex)) {
      newResponse["ucaRecommendationCharts"].push(newItem);
    } else if (item.type === "timeseries" && item.id.match(ucaSetpointsChartsRegex)) {
      newResponse["ucaSetpointsCharts"].push(newItem);
    } else if (item.type === "timeseries" && item.id.match(vsChartsRegex)) {
      newResponse["vsCharts"].push(newItem);
    } else if (item.type === "timeseries") {
      newResponse["otherTimeseriesCharts"].push(newItem);
    } else {
      newResponse["otherCharts"].push(newItem);
    }
  });
  newResponse["ucaSetpointsCharts"].sort((a, b) => a.id.localeCompare(b.id));

  return newResponse;
};

export const parseGrafanaAlertsChartsData = (data: GrafanaChartsObj[]) => {
  const newResponse: Record<GrafanaAlertsChartsName, GrafanaChartsObj[]> = {
    thresholdCharts: [],
    otherCharts: [],
  };

  data.forEach((item) => {
    const newItem = structuredClone(item);
    const parametersToAddInGrafanaUrls = parseGrafanaUrlsParameters({
      from: DEFAULT_RANGE_DATE_FROM,
      refresh: DEFAULT_AUTO_REFRESH_VALUE,
      to: DEFAULT_RANGE_DATE_TO,
    });
    newItem["iframe_url"] = `${item.iframe_url}${parametersToAddInGrafanaUrls}`;

    if (item.type === "timeseries") {
      newResponse["thresholdCharts"].push(newItem);
    } else {
      newResponse["otherCharts"].push(newItem);
    }
  });
  newResponse["thresholdCharts"].sort((a, b) => a.id.localeCompare(b.id));

  return newResponse;
};

interface GrafanaUrlsParameters {
  refresh: string;
  from: string;
  to: string;
}

type GrafanaUrlsParametersArgs = GrafanaUrlsParameters;

export const parseGrafanaUrlsParameters = (args: GrafanaUrlsParametersArgs) => {
  const {
    from = DEFAULT_RANGE_DATE_FROM,
    refresh = DEFAULT_AUTO_REFRESH_VALUE,
    to = DEFAULT_RANGE_DATE_TO,
  } = args;

  return `&refresh=${refresh}&from=${from}&to=${to}`;
};
