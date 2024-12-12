"use client";

import { db } from "@/lib/firebase";
import { studentSchema } from "@/schema";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "sonner";
import { z } from "zod";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getStudents = async (userId: string) => {
  if (!userId) throw new Error("Try to login");
  try {
    const studentsCollection = collection(db, "users");

    const studentQuery = query(
      studentsCollection,
      // where("isDeleted", "==", ""),
      where("role", "==", "student"),
      where("adminId", "==", userId)
    );

    const studentSnapshot = await getDocs(studentQuery);

    if (studentSnapshot.empty) {
      throw new FetchError("No students found in the collection.");
    }

    const studentList = studentSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        studentName: data.name,
        studentId: data.studentId || data.id,
        studentProfileImg: data.image,
        studentEmail: data.email,
        studentPhoneNumber: data.phone,
        createdAt: data.createdAt,
        gradeAndSection: data.gradeAndSection,
        isDeleted: data.isDeleted,
        id: doc.id,
      };
    });

    return studentList;
  } catch (error) {
    console.error("Error fetching students:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch students.");
    } else {
      throw new FetchError("Failed to fetch students.");
    }
  }
};
export const getStudentsByGradeAndSection = async ({
  gradeAndSection,
  userId,
}: {
  gradeAndSection: string;
  userId: string;
}) => {
  try {
    const studentsCollection = collection(db, "users");

    const studentQuery = query(
      studentsCollection,
      where("role", "==", "student"),
      where("adminId", "==", userId),
      where("gradeAndSection.id", "==", gradeAndSection)
    );

    const studentSnapshot = await getDocs(studentQuery);

    if (studentSnapshot.empty) {
      throw new FetchError("No students found in the collection.");
    }

    const studentList = studentSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        studentName: data.name,
        studentId: data.studentId || data.id,
        studentProfileImg: data.image,
        studentEmail: data.email,
        studentPhoneNumber: data.phone,
        createdAt: data.createdAt,
        gradeAndSection: data.gradeAndSection,
        isDeleted: data.isDeleted,
        id: doc.id,
      };
    });

    return studentList;
  } catch (error) {
    console.error("Error fetching students:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch students.");
    } else {
      throw new FetchError("Failed to fetch students.");
    }
  }
};

export const createStudent = async (
  data: z.infer<typeof studentSchema>,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_CREATESTUDENT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        phone: data.phone,
        id: data.studentId,
        password: data.password,
        gradeAndSection: data.gradeAndSection,
      }),
    });

    if (!res.ok && res.status == 400) {
      return res.json();
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const deleteStudentById = async (
  studentId: string,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DELETESTUDENT!, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentId,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const updateStudent = async (
  docId: string,
  token: string | null | undefined,
  data: object
) => {
  try {
    console.log({
      docId: docId,
      updateData: data,
    });

    const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATESTUDENT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        docId: docId,
        updateData: data,
      }),
    });
    const resData = await res.json();

    if (res.status == 400 || res.status == 500) {
      toast.error(resData.message);
    }

    if (res.status == 200) {
      toast.success(resData.message);
    }
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};
