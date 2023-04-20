import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleHeaders } from "@/utils/headers";

interface FacilitiesRooms {
  name: string;
  code: string;
}

interface FacilitiesApiResponseObj {
  facilityLocation: string;
  facilityRooms: FacilitiesRooms[];
}

type FacilitiesApiResponse = FacilitiesApiResponseObj[];

const URL_PATH_FACILITIES = "floorplans/locations/";

export const facilitiesApi = createApi({
  reducerPath: "facilitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_SERVER}/${URL_PATH_FACILITIES}`,
    prepareHeaders: handleHeaders,
  }),
  endpoints: (builder) => {
    return {
      getFacilities: builder.query<FacilitiesApiResponse, void>({
        query: () => "",
        transformResponse: (response: FacilitiesApiResponse) => {
          return response.sort((a, b) => a.facilityLocation.localeCompare(b.facilityLocation));
        },
      }),
    };
  },
});

export const { useGetFacilitiesQuery } = facilitiesApi;
