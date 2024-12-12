"use client";
import { userSchema } from "@/schema";
import { z } from "zod";
type BulkStudent = {
  name: string;
  id: number;
  email: string;
  phone: number;
  image?: string;
  gradeAndSection: string;
};
export const createStudent = async (
  data: z.infer<typeof userSchema> | BulkStudent[],
  token: string | null | undefined,
  isBulkUpload: boolean = false
) => {
  try {
    const body = isBulkUpload
      ? data
      : {
          email: (data as z.infer<typeof userSchema>).email,
          name: (data as z.infer<typeof userSchema>).name,
          phone: (data as z.infer<typeof userSchema>).phone,
          id: (data as z.infer<typeof userSchema>).id,
          gradeAndSection: (data as z.infer<typeof userSchema>).gradeAndSection,
        };

    const res = await fetch(process.env.NEXT_PUBLIC_API_CREATESTUDENT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

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
