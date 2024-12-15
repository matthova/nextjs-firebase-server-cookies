"use client";

import { usePrevious } from "@uidotdev/usehooks";
import { useUser } from "@/components/auth/useUser";
import { signUpWithGoogle, signOut } from "@/lib/firebase/auth";
import React from "react";

export function CtaButton() {
  const { user } = useUser();

  async function handleSignOut() {
    try {
      await signOut();
    } catch (ex) {
      console.error("Sign out failure", ex);
    }
  }

  async function handleSignUp() {
    try {
      await signUpWithGoogle();
    } catch (ex) {
      console.error("Google Sign up failure", ex);
    }
  }

  async function handleSignIn() {
    // TODO - consider warning user existing content will be lost if they sign in
    try {
      await signUpWithGoogle({
        signInIfAccountExists: true,
      });
    } catch (ex) {
      console.error("Google Sign in failure", ex);
    }
  }

  if (user.isAnonymous) {
    return (
      <div className="flex gap-3">
        <button
          className="p-1 border-solid border border-foreground"
          onClick={handleSignUp}
        >
          Sign up with Google
        </button>
        <button
          className="p-1 border-solid border border-foreground"
          onClick={handleSignIn}
        >
          Sign in with Google
        </button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}

export function UserInfo() {
  const { user } = useUser();
  const displayName =
    user.displayName ??
    user.providerData.find((p) => p.displayName)?.displayName;
  const photoUrl =
    user.photoURL ?? user.providerData.find((p) => p.photoURL)?.photoURL;
  return (
    <>
      <h1>
        <b>User</b>
      </h1>
      <div>
        <div>Is Anonymous: {user.isAnonymous ? "true" : "false"}</div>
        {displayName == null || displayName === "" ? null : (
          <div>{displayName}</div>
        )}
        {photoUrl == null || photoUrl === "" ? null : (
          <img src={photoUrl} alt="User profile" />
        )}
        {/* {Object.entries(user)
          .filter(
            ([key]) =>
              !key.toLowerCase().includes("token") &&
              !["proactiveRefresh", "auth"].includes(key)
          )
          .map(([key, value]) => (
            <div key={key}>
              {key}: {JSON.stringify(value)}
            </div>
          ))} */}
      </div>
    </>
  );
}

export function UserCounter({
  count: countProp,
  increment: incrementProp,
}: {
  count: number;
  increment: () => void;
}) {
  const previousCountProp = usePrevious(countProp);
  const [count, setCount] = React.useState(countProp);

  function increment() {
    incrementProp();
    setCount((count) => {
      return count + 1;
    });
  }

  React.useEffect(() => {
    if (previousCountProp != countProp) {
      setCount(countProp);
    }
  }, [countProp, previousCountProp]);

  return (
    <div>
      <h1>
        <b>Counter</b>
      </h1>
      <div className="flex gap-4 items-center">
        <div>Count: {count}</div>
        <button className="border border-foreground p-2" onClick={increment}>
          Increment
        </button>
      </div>
    </div>
  );
}
