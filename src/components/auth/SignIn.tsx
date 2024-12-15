"use client";

import { signUpWithGoogle } from "@/lib/firebase/auth";

export function SignIn() {
  return (
    <div>
      <button onClick={() => signUpWithGoogle({ signInIfAccountExists: true })}>
        Sign in
      </button>
    </div>
  );
}
