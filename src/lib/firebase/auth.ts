import {
  GoogleAuthProvider,
  linkWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import { auth } from "./clientApp";

export async function signUpWithGoogle({
  signInIfAccountExists = false,
}: { signInIfAccountExists?: boolean } = {}) {
  const provider = new GoogleAuthProvider();

  const currentUser = auth.currentUser;
  try {
    if (currentUser == null || !currentUser?.isAnonymous) {
      throw new Error("User is not anonymous");
    }
    await linkWithPopup(currentUser, provider);
  } catch (error) {
    if (
      currentUser == null ||
      // @ts-expect-error does too have a code
      error?.code == "auth/credential-already-in-use"
    ) {
      if (signInIfAccountExists) {
        await signInWithRedirect(auth, provider);
        return;
      }
      console.error("Error signing in with Google: Credential already in use");
      alert("This Google account is already linked to another account");
      return;
    }
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
}
