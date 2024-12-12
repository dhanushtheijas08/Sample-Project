"use client";
import { z } from "zod";
import { userSchema } from "@/schema";
type BulkTeacher = {
  name: string;
  id: number;
  email: string;
  phone: number;
  image?: string;
};

export const createTeacher = async (
  data: z.infer<typeof userSchema> | BulkTeacher[],
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
        };

    console.log(body);
    const res = await fetch(process.env.NEXT_PUBLIC_API_CREATETEACHERS!, {
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
    console.error("Error creating teacher:", error);
    throw error;
  }
};
