"use client";

import { useUser } from "@/components/auth/useUser";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { getAuth, signOut } from "firebase/auth";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      <CtaButton />
      <br />
      <h1>User</h1>
      <br />
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
    </div>
  );
}

function CtaButton() {
  const { user } = useUser();

  async function handleSignOut() {
    try {
      await signOut(getAuth());
    } catch (ex) {
      console.error("Sign out failure", ex);
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
      <div>
        <button onClick={handleSignIn}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
