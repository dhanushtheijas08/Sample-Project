"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const getLicences = async (userId: string) => {
  try {
    const licenceRef = doc(db, "purchases", userId);

    const licenceSnap = await getDoc(licenceRef);

    if (!licenceSnap.exists()) {
      throw new FetchError("No licence found for this user.");
    }
    const licenceData = { id: licenceSnap.id, ...licenceSnap.data() };

    return licenceData;
  } catch (error) {
    console.error("Error fetching licences:", error);

    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to fetch licences.");
    } else {
      throw new FetchError("Failed to fetch licences.");
    }
  }
};

type LicenceCount = { annual: number; monthly: number };

export const updateLicences = async (
  userId: string,
  licenceCount: LicenceCount
) => {
  try {
    const licenceRef = doc(db, "purchases", userId);

    const licenceSnap = await getDoc(licenceRef);
    if (!licenceSnap.exists()) {
      throw new Error(`Document for userId: ${userId} does not exist.`);
    }

    const currentAnnual = licenceSnap.data().annual;
    const currentMonthly = licenceSnap.data().monthly;
    if (
      typeof currentAnnual !== "number" ||
      typeof currentMonthly !== "number"
    ) {
      throw new Error(`Invalid data: "annual" field is not a number.`);
    }

    const updatedAnnual = currentAnnual - licenceCount.annual;
    const updatedMonthly = currentMonthly - licenceCount.monthly;
    if (updatedAnnual < 0 || updatedMonthly < 0) {
      throw new Error(`Insufficient licences.`);
    }

    await updateDoc(licenceRef, {
      annual: updatedAnnual,
      monthly: updatedMonthly,
    });

    return true;
  } catch (error) {
    console.error("Error updating licences:", error);

    if (error instanceof Error) {
      throw new FetchError(error.message || "Failed to update licences.");
    } else {
      throw new FetchError("Failed to update licences.");
    }
  }
};
