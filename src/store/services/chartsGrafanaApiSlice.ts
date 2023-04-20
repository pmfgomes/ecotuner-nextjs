import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  parseGrafanaAlertsChartsData,
  parseGrafanaDashboardChartsData,
  parseGrafanaRecommendationsChartsData,
} from "@/utils/grafanaCharts";
import { handleHeaders } from "@/utils/headers";

type GrafanaChartType = "stat" | "timeseries" | "piechart" | "barchart" | "canvas";

export interface GrafanaChartsObj {
  id: string;
  iframe_url: string;
  title: string;
  type: GrafanaChartType;
}

export type GrafanaAlertsChartsName = "thresholdCharts" | "otherCharts";
export type GrafanaDashboardChartsName = "ucaCharts" | "currentRoomCharts" | "otherCharts";
export type GrafanaRecommendedChartsName =
  | "ucaRecommendationCharts"
  | "pueAverageCharts"
  | "otherCharts";
export type GrafanaHistoryRecommendedChartsName =
  | "vsCharts"
  | "ucaSetpointsCharts"
  | "otherTimeseriesCharts";
export type GrafanaRecommendationsChartsName =
  | GrafanaRecommendedChartsName
  | GrafanaHistoryRecommendedChartsName;

export type GrafanaDashboardCharts = Record<GrafanaDashboardChartsName, GrafanaChartsObj[]>;
export type GrafanaAlertsCharts = Record<GrafanaAlertsChartsName, GrafanaChartsObj[]>;
export type GrafanaRecommendationsCharts = Record<
  GrafanaRecommendationsChartsName,
  GrafanaChartsObj[]
>;

interface GrafanaChartsDashboardApiResponse {
  charts: GrafanaChartsObj[];
  facility_code: string;
}

const URL_PATH_CHARTS_GRAFANA = "charts/grafana/";

export const chartsGrafanaApi = createApi({
  reducerPath: "chartsGrafanaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_SERVER}/${URL_PATH_CHARTS_GRAFANA}`,
    prepareHeaders: handleHeaders,
  }),
  endpoints: (builder) => {
    return {
      getDashboardCharts: builder.query<GrafanaDashboardCharts, string>({
        query: (facilityCode) => `dashboards?facility=${facilityCode}`,
        transformResponse: (response: GrafanaChartsDashboardApiResponse) => {
          return parseGrafanaDashboardChartsData(response.charts);
        },
      }),
      getRecommendationsCharts: builder.query<GrafanaRecommendationsCharts, string>({
        query: (facilityCode) => `recommendations?facility=${facilityCode}`,
        transformResponse: (response: GrafanaChartsDashboardApiResponse) => {
          return parseGrafanaRecommendationsChartsData(response.charts);
        },
      }),
      getAlertsCharts: builder.query<GrafanaAlertsCharts, string>({
        query: (facilityCode) => `alerts?facility=${facilityCode}`,
        transformResponse: (response: GrafanaChartsDashboardApiResponse) => {
          return parseGrafanaAlertsChartsData(response.charts);
        },
      }),
    };
  },
});

export const {
  useLazyGetDashboardChartsQuery,
  useLazyGetRecommendationsChartsQuery,
  useLazyGetAlertsChartsQuery,
} = chartsGrafanaApi;
