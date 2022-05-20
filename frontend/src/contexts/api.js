import axios from "axios";
import React from "react";

export const APIContext = React.createContext({ axios });

export function createAPIContextValue() {
  return {
    axios: axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      responseType: "json",
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken",
      withCredentials: true,
    }),
  };
}
