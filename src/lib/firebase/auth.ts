import {
  GoogleAuthProvider,
  linkWithPopup,
  updateProfile,
  signInWithRedirect,
} from "firebase/auth";

import { auth } from "./clientApp";

export async function signUpWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    if (auth.currentUser?.isAnonymous) {
      const result = await linkWithPopup(auth.currentUser, provider);
      await updateProfile(auth.currentUser, {
        displayName:
          auth.currentUser.displayName ??
          result.user.providerData.find((p) => p.displayName)?.displayName,
        photoURL:
          auth.currentUser.photoURL ??
          result.user.providerData.find((p) => p.photoURL)?.photoURL,
      });
    } else {
      console.error("Error signing in with Google: User is not anonymous");
    }
  } catch (error) {
    // @ts-expect-error does too have a code
    if (error?.code == "auth/credential-already-in-use") {
      console.error("Error signing in with Google: Credential already in use");
    }
    console.error("Error signing in with Google", error);
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
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
