import { db } from "@/lib/firebase";
import { teacherSchema } from "@/schema";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "sonner";
import { z } from "zod";

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
        isDeleted: data.isDeleted,
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

export const createTeacher = async (
  data: z.infer<typeof teacherSchema>,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_CREATETEACHERS!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        phone: data.phone,
        id: data.id,
        password: data.password,
      }),
    });

    if (!res.ok && res.status == 400) {
      return res.json();
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const deleteTeacherById = async (
  teacherId: string,
  token: string | null | undefined
) => {
  console.log(process.env.NEXT_PUBLIC_API_DELETETEACHERS);

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DELETETEACHER!, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        teacherId,
      }),
    });

    if (res.status == 400) {
      const result = await res.json();

      toast.error(`${result.error}.\n ${result.message}`, { duration: 15000 });
      return;
    }

    if (res.status != 200) {
      const result = await res.json();
      toast.error(result?.message);
    }
    const result = await res.json();

    toast.success(result?.message);
    return;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (
  docId: string,
  token: string | null | undefined,
  data: object
) => {
  try {
    console.log({
      docId: docId,
      updateData: data,
    });

    const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATETEACHER!, {
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
