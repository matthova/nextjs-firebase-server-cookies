"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { getFirebaseAdminApp } from "@/lib/firebase/firebase";

export async function incrementCounter() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (currentUser == null) {
    throw new Error("Cannot update counter of unauthenticated user");
  }

  const snapshot = await getFirebaseAdminApp()
    .firestore()
    .collection("user-counters")
    .doc(currentUser.uid)
    .get();

  const currentUserCounter = snapshot.data();

  if (!snapshot.exists || !currentUserCounter) {
    const userCounter = {
      id: currentUser.uid,
      count: 1,
    };

    await snapshot.ref.create(userCounter);
  }

  const newUserCounter = {
    ...currentUserCounter,
    count: (currentUserCounter?.count ?? 0) + 1,
  };
  await snapshot.ref.update(newUserCounter);

  revalidatePath("/");
}

export async function getUserCounter(): Promise<number> {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (currentUser == null) {
    return 0;
  }

  const snapshot = await getFirebaseAdminApp()
    .firestore()
    .collection("user-counters")
    .doc(currentUser.uid)
    .get();

  const currentUserCounter = await snapshot.data();

  if (!currentUserCounter) {
    return 0;
  }

  return currentUserCounter.count;
}
