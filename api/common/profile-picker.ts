"use clinet";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchProfiles = async (): Promise<string[]> => {
  const docRef = doc(db, "master", "class_badge");
  const docSnap = await getDoc(docRef);

  console.log("Document data:", docSnap.data());

  if (docSnap.exists()) {
    const data = docSnap.data();
    const badgeImages = data?.badge_image as string[] | undefined;

    if (badgeImages) {
      return badgeImages;
    } else {
      throw new Error("No badge images found");
    }
  } else {
    throw new Error("Document does not exist");
  }
};
