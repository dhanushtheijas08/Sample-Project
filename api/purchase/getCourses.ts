"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getCourses = async () => {
  try {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    if (coursesSnapshot.empty) {
      throw new FetchError("No courses found in the collection.");
    }
    const courseList = coursesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        courseTitle: data.title,
        courseDescription: data.description,
        courseProfileImg: data.image,
        id: doc.id,
      };
    });
    return courseList;
  } catch (error) {
    console.error("Error fetching courses:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch courses.");
    } else {
      throw new FetchError("Failed to fetch courses.");
    }
  }
};
