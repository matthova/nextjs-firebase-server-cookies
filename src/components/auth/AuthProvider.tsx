"use client";

import {
  beforeAuthStateChanged,
  getAuth,
  onIdTokenChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import * as React from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { AuthContext } from "./AuthContext";
import { auth } from "@/lib/firebase/clientApp";
import { useRouter } from "next/navigation";

export function AuthProvider({
  children,
  initialUser,
  isSignInPage = false,
}: {
  children: React.ReactNode;
  initialUser: User | null;
  isSignInPage?: boolean;
}) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(initialUser);
  const userRef = React.useRef<User | null>(user);
  React.useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [onIdTokenChangedInitialized, setOnIdTokenChangedInitialized] =
    React.useState(false);

  React.useEffect(() => {
    const unsubscribeIdTokenChange = onIdTokenChanged(auth, async (newUser) => {
      if (newUser) {
        // Have to destructure in order to trigger a re-render
        setUser({
          ...newUser,
        });
        const idToken = await newUser.getIdToken();
        setCookie("__session", idToken);
        if (isSignInPage) {
          router.push("/");
        } else {
          router.refresh();
        }
      } else {
        // On initial load there may be no user. Only set to null if there was a user before
        if (userRef.current != null) {
          setUser(null);
          router.push("/sign-in");
        }
        deleteCookie("__session");
      }
      if (!onIdTokenChangedInitialized) {
        setOnIdTokenChangedInitialized(true);
      }
    });

    let priorCookieValue: string | undefined;
    const unsubscribeBeforeAuthStateChanged = beforeAuthStateChanged(
      auth,
      async (newUser) => {
        priorCookieValue = await getCookie("__session");
        const idToken = await newUser?.getIdToken();
        if (idToken) {
          setCookie("__session", idToken);
        } else {
          deleteCookie("__session");
          if (userRef.current != null) {
            setUser(null);
            router.push("/sign-in");
          }
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
      unsubscribeIdTokenChange();
      unsubscribeBeforeAuthStateChanged();
    };
  }, [isSignInPage, onIdTokenChangedInitialized, router]);

  React.useEffect(() => {
    if (
      initialUser == null &&
      user == null &&
      !onIdTokenChangedInitialized &&
      !isSignInPage
    ) {
      signInAnonymously(getAuth());
    }
  }, [initialUser, isSignInPage, onIdTokenChangedInitialized, user]);

  if (user == null && isSignInPage) {
    return <>{children}</>;
  }
  if (user == null) {
    return <div>Loading...</div>;
  }

  const contextValue = { user };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
