"use client";

import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

auth.authStateReady().then(() => {
  getRedirectResult(auth)
    .then((result) => {
      console.log("Redirect result", result);
      if (result == null) {
        throw new Error("No result");
      }
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential == null) {
        throw new Error("No credential");
      }
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log("handle signin now", token, user);
    })
    .catch((error) => {
      console.log("redirect result error", error);
      // Handle Errors here.
    });
});
