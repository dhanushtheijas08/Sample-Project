/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export const generateCsv = (
  filename: string,
  data: { email: string; name: string; password?: string | undefined }[]
) => {
  const headers = ["email", "name", "password"];

  const rows = data.map((item) => [item.email, item.name, item.password || ""]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

export const updateUserPassword = async (
  email: string,
  newPassword: string,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATEUSERPASSWORD!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const bulkUploadUsers = async (
  token: string | null,
  role: string,
  userData: any
) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_BULKUPLOADUSERS!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: role,
        userData: userData,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      toast.error(errorDetails?.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading:", error);
  }
};

export const convertToCSV = (data: any[]) => {
  try {
    // Ensure data is an array and contains at least one item
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data must be a non-empty array.");
    }

    // Create a unique set of all headers (keys) across all items
    const headers = Array.from(
      new Set(data.flatMap((item) => Object.keys(item)))
    );

    // Generate the CSV header
    const header = headers.join(",") + "\n";

    // Generate the CSV rows
    const rows = data
      .map((item) =>
        headers.map((header) => (header in item ? item[header] : "")).join(",")
      )
      .join("\n");

    return header + rows;
  } catch (error) {
    console.error("Error during CSV conversion:", error);
    toast.error("An error occurred while converting to CSV.");
  }
};

// Trigger CSV download
export const downloadCSV = (fileName: string, csvData: any) => {
  const blob = new Blob([csvData], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};

export const enableUser = async (token: string | null, id: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_ENABLEUSER!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: id,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      toast.error(errorDetails?.error);
    }

    const errorDetails = await response.json();
    toast.success(errorDetails?.message);
  } catch (error) {
    console.error("Error uploading:", error);
  }
};
