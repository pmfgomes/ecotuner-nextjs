import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import { facilitySlice } from "./reducers/facilitySlice";
import { pueSlice } from "./reducers/pueSlice";
import { facilitiesApi } from "./services/facilitiesApi";
import { chartsGrafanaApi } from "./services/chartsGrafanaApiSlice";
import { floorPlansApi } from "./services/floorPlansApi";
import { dbqueryApi } from "./services/dbqueryApi";

export const store = configureStore({
  reducer: {
    [facilitySlice.name]: facilitySlice.reducer,
    [pueSlice.name]: pueSlice.reducer,
    [facilitiesApi.reducerPath]: facilitiesApi.reducer,
    [chartsGrafanaApi.reducerPath]: chartsGrafanaApi.reducer,
    [floorPlansApi.reducerPath]: floorPlansApi.reducer,
    [dbqueryApi.reducerPath]: dbqueryApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    facilitiesApi.middleware,
    floorPlansApi.middleware,
    chartsGrafanaApi.middleware,
    dbqueryApi.middleware,
  ],
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
