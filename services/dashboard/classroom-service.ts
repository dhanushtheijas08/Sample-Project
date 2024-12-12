/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getClassroom = async ({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) => {
  try {
    const classroomCollection = collection(db, "classes");

    const instutionQuery =
      role === "admin"
        ? query(classroomCollection, where("adminId", "==", userId))
        : query(classroomCollection, where("teacherId", "==", userId));

    const classroomnapshot = await getDocs(instutionQuery);

    if (classroomnapshot.empty) {
      throw new FetchError("No classroom found in the collection.");
    }

    const classroomList = classroomnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        isArchived: data.isArchived,
        name: data.name,
        grade: data.grade.name,
        startsAt: data.startsAt,
        studentsCount: data.studentIds.length,
        teacherName: data.teacher.name,
        teacherId: data.teacher.id,
        teacherProfileImg: data.teacher.image,
        image: data.image,
        adminId: data.adminId,
        id: doc.id,
      };
    });

    return classroomList;
  } catch (error) {
    console.error("Error fetching classroom:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch classroom.");
    } else {
      throw new FetchError("Failed to fetch classroom.");
    }
  }
};

export const createClassroom = async (
  data: any,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(
      "https://us-central1-wefaa-robotics.cloudfunctions.net/createClassroom",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

type ClassData = {
  licenceUsed: string | null;
  teacherId: string;
  startsAt: string;
  image: string;
  course: {
    id: string;
    name: string;
    image: string;
  };
  coTeacher: {
    id: string;
    name: string;
    image: string;
    uid: string;
  };
  gradeId: string;
  studentIds: string[];
  isArchived: boolean;
  grade: {
    id: string;
    name: string;
  };
  duration: string;
  adminId: string;
  themes: {
    id: string;
    name: string;
    description: string;
    levels: {
      id: string;
      name: string;
      image: string;
      unlockAt: string;
      gameFiles: {
        data: string;
        wasm: string;
        json: string;
        js: string;
      };
    }[];
  }[];
  teacher: {
    id: string;
    name: string;
    image: string;
    uid: string;
  };
  unlockType: string;
  students: {
    studentId: string;
    name: string;
    plan: string;
    image: string;
    id: string;
    uid: string;
    grade: {
      id: string;
      name: string;
    };
    email: string;
    isDeleted: boolean;
    // --
    // uid: string;
    // image: string;
    // plan: string;
    // name: string;
    // studentId: string;
  }[];
  coTeacherId: string;
  name: string;
  courseId: string;
};

export const getClassroomById = async ({
  classroomId,
}: {
  classroomId: string | undefined;
}): Promise<ClassData> => {
  if (!classroomId) throw new Error("Classroom ID is required.");
  try {
    const classroomRef = doc(db, "classes", classroomId);
    const classroomSnapshot = await getDoc(classroomRef);

    if (classroomSnapshot.exists()) {
      const classroomData = classroomSnapshot.data() as ClassData;

      return classroomData;
    } else {
      throw new FetchError("Classroom not found.");
    }
  } catch (error) {
    console.error("Error fetching classroom:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch classroom.");
    } else {
      throw new FetchError("Failed to fetch classroom.");
    }
  }
};

export const transferStudent = async (
  studentId: string,
  oldClassroomId: string,
  newClassroomId: string,
  token: string | null | undefined
) => {
  if (!studentId || !oldClassroomId || !newClassroomId || !token) {
    return;
  }

  try {
    const res = await fetch(
      "https://us-central1-wefaa-robotics.cloudfunctions.net/transferStudent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, oldClassroomId, newClassroomId }),
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const updateClassroom = async (
  classroomId: string,
  data: any,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(
      `https://us-central1-wefaa-robotics.cloudfunctions.net/updateClassroom`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data, classroomId }),
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating classroom:", error);
    throw error;
  }
};

export const getClassroomByRole = async ({ userUid }: { userUid: string }) => {
  if (!userUid) return;
  const docRef = doc(db, "users", userUid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const userData = docSnap.data();

  const classCollection = collection(db, "classes");
  const q =
    userData.role === "teacher"
      ? query(classCollection, where("teacherId", "==", userUid))
      : query(classCollection, where("adminId", "==", userUid));

  const querySnapshot = await getDocs(q);
  const classList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    students: [],
    ...doc.data(),
  }));
  return classList;
};
