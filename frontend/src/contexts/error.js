import React from "react";
import { noop } from "utils/noop";

/** @type {import("react").Context<{ onError: (error: any) => void}>} */
export const ErrorContext = React.createContext({ onError: noop });
