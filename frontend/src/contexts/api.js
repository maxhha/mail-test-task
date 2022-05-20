import axios from "axios";
import React from "react";

/** @type {import("react").Context<{ api: import("axios").AxiosInstance }>|undefined} */
// @ts-ignore
export const APIContext = React.createContext();

export function createAPIContextValue() {
  return {
    api: axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      responseType: "json",
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken",
      withCredentials: true,
    }),
  };
}
