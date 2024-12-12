"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getTeachers = async (userId: string) => {
  try {
    const teachersCollection = collection(db, "users");

    const teacherQuery = query(
      teachersCollection,
      where("role", "==", "teacher"),
      where("adminId", "==", userId)
    );

    const teacherSnapshot = await getDocs(teacherQuery);

    if (teacherSnapshot.empty) {
      throw new FetchError("No teachers found in the collection.");
    }

    const teacherList = teacherSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        teacherName: data.name,
        teacherId: data.teacherId || data.id,
        teacherProfileImg: data.image || "",
        teacherEmail: data.email,
        teacherPhoneNumber: data.phone,
        createdAt: data.createdAt,
        id: doc.id,
      };
    });

    return teacherList;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch teachers.");
    } else {
      throw new FetchError("Failed to fetch teachers.");
    }
  }
};
