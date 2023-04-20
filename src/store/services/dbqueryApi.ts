import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleHeaders } from "@/utils/headers";

interface GetPueValueObj {
  facility_code: string;
  value: string;
  last_update: string;
  condition: string;
  next_update: number;
  frequency_minutes: number;
}

interface PaginationObj {
  total: number;
  page: number;
  limit: number;
  pages: number;
  next_page: number | null;
  previous_page: number | null;
  next_update: number | null;
}

interface GetAlertsHistoryItemObj {
  time: string;
  level: string;
  value: string;
  variable_name: string;
  rule_id: string;
  rule_name: string;
  message: string;
  active: boolean;
}

interface GetAlertsHistoryObj extends PaginationObj {
  items: GetAlertsHistoryItemObj[];
}

interface GetAlertsHistoryParams {
  facility: string;
  page: number;
  limit: number;
}

type RoomsStrings = "dc01" | "dc02" | "dc03" | "sbst" | "viseu" | "porto";

type GetAlertCountObjRooms = {
  [k in RoomsStrings]: number;
};

interface GetAlertCountObj {
  facility: string;
  alerts: number;
  rooms: GetAlertCountObjRooms;
}

export interface AlertMessageObj {
  time: string;
  rule_id: string;
  rule_name: string;
  message: string;
}

interface GetActiveAlertsParams {
  facility: string;
}

type GetPueValueApiResponse = GetPueValueObj;
type GetAlertsHistoryApiResponse = GetAlertsHistoryObj;
type GetAlertCountApiResponse = GetAlertCountObj[];
type GetActiveAlertsApiResponse = {
  items: AlertMessageObj[];
  next_update: number;
};

const URL_PATH_DBQUERY = "dbquery/";

export const dbqueryApi = createApi({
  reducerPath: "dbqueryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_SERVER}/${URL_PATH_DBQUERY}`,
    prepareHeaders: handleHeaders,
  }),
  endpoints: (builder) => {
    return {
      getPueValue: builder.query<GetPueValueApiResponse, string>({
        query: (facilityCode) => `puevalue?facility=${facilityCode}`,
      }),
      getAlertsHistory: builder.query<GetAlertsHistoryApiResponse, GetAlertsHistoryParams>({
        query: ({ facility, limit, page }) =>
          `alerthistory?facility=${facility}&page=${page}&limit=${limit}`,
      }),
      getAlertCount: builder.query<GetAlertCountApiResponse, void>({
        query: () => `alertcount`,
      }),
      getActiveAlerts: builder.query<GetActiveAlertsApiResponse, GetActiveAlertsParams>({
        query: ({ facility }) => `activealerts?facility=${facility}`,
      }),
    };
  },
});

export const {
  useLazyGetPueValueQuery,
  useLazyGetAlertsHistoryQuery,
  useLazyGetAlertCountQuery,
  useLazyGetActiveAlertsQuery,
} = dbqueryApi;
