"use client";

import { useUser } from "@/components/auth/useUser";
import {
  signInWithGoogle,
  signOut,
  signUpWithGoogle,
} from "@/lib/firebase/auth";

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
    try {
      await signInWithGoogle();
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
  return (
    <>
      <h1>
        <b>User</b>
      </h1>
      {Object.entries(user)
        .filter(
          ([key]) =>
            !key.toLowerCase().includes("token") &&
            !["proactiveRefresh", "auth"].includes(key)
        )
        .map(([key, value]) => (
          <div key={key}>
            {key}: {JSON.stringify(value)}
          </div>
        ))}
    </>
  );
}

export function UserCounter({
  count,
  increment,
}: {
  count: number;
  increment: () => void;
}) {
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
