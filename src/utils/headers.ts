import type { BaseQueryApi } from "@reduxjs/toolkit/dist/query";
import i18n from "i18next";

type API = Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">;

export const handleHeaders = (headers: Headers, api: API) => {
  headers.set("Accept-Language", i18n.language);
};
