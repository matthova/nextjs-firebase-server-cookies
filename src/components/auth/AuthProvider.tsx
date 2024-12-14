"use client";

import {
  beforeAuthStateChanged,
  getAuth,
  onIdTokenChanged,
  type User,
} from "firebase/auth";
import * as React from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { AuthContext } from "./AuthContext";

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = React.useState<User | null>(initialUser);

  React.useEffect(() => {
    const unsubscribeItTokenChange = onIdTokenChanged(
      getAuth(),
      async (user) => {
        if (user) {
          setUser(user);
          const idToken = await user.getIdToken();
          setCookie("__session", idToken);
        } else {
          deleteCookie("__session");
        }
      }
    );

    let priorCookieValue: string | undefined;
    const unsubscribeBeforeAuthStateChanged = beforeAuthStateChanged(
      getAuth(),
      async (user) => {
        priorCookieValue = await getCookie("__session");
        const idToken = await user?.getIdToken();
        if (idToken) {
          setCookie("__session", idToken);
        } else {
          deleteCookie("__session");
        }
      },
      async () => {
        // If another beforeAuthStateChanged rejects, revert the cookie (best-effort)
        if (priorCookieValue) {
          setCookie("__session", priorCookieValue);
        } else {
          deleteCookie("__session");
        }
      }
    );

    return () => {
      unsubscribeItTokenChange();
      unsubscribeBeforeAuthStateChanged();
    };
  }, []);

  if (user == null) {
    console.log("momentarily no user");
    return <div>Loading...</div>;
  }

  const contextValue = { user };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
