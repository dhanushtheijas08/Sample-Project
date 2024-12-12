import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const firebaseTimestampToNormal = (
  timestamp: Timestamp | string | Date
): string => {
  if (!(timestamp instanceof Timestamp)) {
    throw new Error("Invalid timestamp provided");
  }

  const date = timestamp.toDate();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export function convertTimestampToDate(timestamp: {
  seconds: number;
  nanoseconds: number;
}): string {
  const totalMilliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);

  const date = new Date(totalMilliseconds);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}
