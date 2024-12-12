import { db } from "@/lib/firebase";
import { instutionSchema } from "@/schema";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "sonner";
import { z } from "zod";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getInstution = async () => {
  try {
    const instutionsCollection = collection(db, "users");

    const instutionQuery = query(
      instutionsCollection,
      where("role", "==", "admin")
    );

    const instutionSnapshot = await getDocs(instutionQuery);

    if (instutionSnapshot.empty) {
      throw new FetchError("No instutions found in the collection.");
    }

    const instutionList = instutionSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        instutionName: data.name,
        instutionId: data.id,
        instutionProfileImg: data.image,
        instutionEmail: data.email,
        instutionPhoneNumber: data.phone,
        createdAt: data.createdAt,
        id: doc.id,
        isDeleted: data.isDeleted,
      };
    });

    return instutionList;
  } catch (error) {
    console.error("Error fetching instutions:", error);
    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch instutions.");
    } else {
      throw new FetchError("Failed to fetch instutions.");
    }
  }
};

export const createInstution = async (
  data: z.infer<typeof instutionSchema>,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_CREATEINSTITUTE!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
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

export const deleteInstituteById = async (
  instituteId: string,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DELETEINSTITUTE!, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        instituteId,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error deleting institute:", error);
    throw error;
  }
};

export const updateInstitute = async (
  docId: string,
  token: string | null | undefined,
  data: object
) => {
  try {
    console.log({
      docId: docId,
      updateData: data,
    });

    const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATEINSTITUTE!, {
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

    if (res.status === 400 || res.status === 500 || res.status == 403) {
      toast.error(resData.message || "Something went wrong.");
    }

    if (res.status === 200) {
      toast.success(resData.message || "Institute updated successfully!");
    }
  } catch (error) {
    console.error("Error updating institute:", error);
    toast.error("An unexpected error occurred. Please try again.");
    throw error;
  }
};
