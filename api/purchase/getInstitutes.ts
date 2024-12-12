"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getInstitutes = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    if (usersSnapshot.empty) {
      throw new FetchError("No institutes found in the collection.");
    }
    const institutionList = usersSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (data.role === "admin") {
          return {
            instituteName: data.name,
            instituteProfileImg: data.image,
            userCreatedAt: data.createdAt,
            id: doc.id,
          };
        }
        return undefined;
      })
      .filter((institution) => institution !== undefined);

    return institutionList;
  } catch (error) {
    console.error("Error fetching institutes:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch institutes.");
    } else {
      throw new FetchError("Failed to fetch institutes.");
    }
  }
};
