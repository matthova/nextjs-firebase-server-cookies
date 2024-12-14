"use client";

import React from "react";
import { AuthContext } from "./AuthContext";

export function useUser() {
  return React.useContext(AuthContext);
}
