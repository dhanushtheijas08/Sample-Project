"use clinet";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
type CourseAndGradeType = {
  courses: { id: string; name: string; image: string }[];
  gradeAndSections: { name: string; createdAt: string; id: string }[];
};
export const getCourseAndGrade = async (
  userId: string
): Promise<CourseAndGradeType | null | undefined> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as CourseAndGradeType;
      const response = {
        courses: data.courses,
        gradeAndSections: data.gradeAndSections,
      };
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    throw error;
  }
};
