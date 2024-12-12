/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}
type Level = {
  id: string;
  name: string;
  unlockAt: string;
  dueDate: string;
  image: string;
  gameFiles: any;
  type: string;
  url: string;
};

type Theme = {
  id: string;
  name: string;
  description: string;
  levels: Level[];
};
export const fetchThemes = async (courseId: string): Promise<Theme[]> => {
  try {
    const docRef = doc(db, "courses", courseId);
    const querySnapshot = await getDoc(docRef);
    if (!querySnapshot.exists()) {
      throw new FetchError("No courses found in the collection.");
    }

    const data = querySnapshot.data();
    const themesData = data.themes;

    const transformedThemes = themesData.map((theme: any) => {
      return {
        name: theme.name,
        id: theme.id,
        description: theme.description,
        levels: theme.levels.map(
          (level: {
            id: string;
            name: string;
            image: string;
            gameFiles: any;
            type: string;
            url: string | undefined;
          }) => ({
            name: level.name,
            id: level.id,
            image: level.image,
            gameFiles: level.gameFiles,
            type: level.type,
            url: level.url || "",
          })
        ),
      };
    });

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching themes:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch themes.");
    } else {
      throw new FetchError("Failed to fetch themes.");
    }
  }
};
