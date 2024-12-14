import { User } from "firebase/auth";
import React from "react";

interface AuthContextState {
  user: User;
}

export const AuthContext = React.createContext<AuthContextState>({
  // @ts-expect-error Enforce there is always a user by only rendering the context provider with a user
  user: null,
});
