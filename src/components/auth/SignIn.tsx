"use client";

import { signInWithGoogle } from "@/lib/firebase/auth";

export function SignIn() {
  return (
    <div>
      <button onClick={() => signInWithGoogle()}>Sign in</button>
    </div>
  );
}
