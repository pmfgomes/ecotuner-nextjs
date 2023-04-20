import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleHeaders } from "@/utils/headers";

export type FloonPlanTooltipPosition = "top" | "bottom" | "left" | "right";

interface FacilitySettings {
  name: string;
  tooltipPosition: FloonPlanTooltipPosition;
  temperature: number;
  humidity: number;
}

interface FacilitiesSettingsApiResponseObj {
  facilityRoom: string;
  floorplanSettings: FacilitySettings[];
}

type FacilitiesSettingsApiResponse = FacilitiesSettingsApiResponseObj;

const URL_PATH_FLOORPLANS = "floorplans/";

export const floorPlansApi = createApi({
  reducerPath: "floorPlansApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_SERVER}/${URL_PATH_FLOORPLANS}`,
    prepareHeaders: handleHeaders,
  }),
  endpoints: (builder) => {
    return {
      getFloorPlanSettings: builder.query<FacilitySettings[], string>({
        query: (floorPlanCode) => `settings?floorplan=${floorPlanCode}`,
        transformResponse: (response: FacilitiesSettingsApiResponse) => {
          return response.floorplanSettings;
        },
      }),
    };
  },
});

export const { useGetFloorPlanSettingsQuery, useLazyGetFloorPlanSettingsQuery } = floorPlansApi;
