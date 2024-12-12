/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const fetchGameFile = async (
  gameName: string,
  courseId: string,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_GETCOURSEDATAFORSTUDENT!,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameName, courseId }),
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
