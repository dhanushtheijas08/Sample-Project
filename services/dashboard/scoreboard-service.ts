"use client";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export async function getSubmissionByLevelStudentClass(
  levelId: string,
  studentId: string,
  classId: string
) {
  if (!levelId || !studentId || !classId) return [];

  try {
    const submissionsRef = collection(db, "submissions");

    const q = query(
      submissionsRef,
      where("levelId", "==", levelId),
      where("studentId", "==", studentId),
      where("classId", "==", classId),
      orderBy("submittedAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log({ levelId, studentId, classId });

    return submissions;
  } catch (error) {
    console.error("Error getting submissions:", error);
    throw new Error("Failed to fetch submissions");
  }
}
