import { db } from "@/lib/firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";

interface GradeSectionPayload {
  name: string;
}

export const getGradeAndSections = (
  id: string,
  callback: (gradeSections: any[]) => void
) => {
  const docRef = doc(db, "users", id);

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data().gradeAndSections);
      } else {
        console.error("No such document!");
      }
    },
    (error) => {
      console.error("Error fetching document:", error);
    }
  );

  return unsubscribe;
};

export const deleteGradeSectionById = (id: string) => {};

export const appendGradeSection = async (
  id: string,
  payload: GradeSectionPayload
) => {
  try {
    console.log(id);

    const uniqueId = doc(collection(db, "users")).id;
    console.log(uniqueId);

    const gradeSection = {
      id: uniqueId,
      ...payload,
      createdAt: Timestamp.now(),
    };

    const userRef = doc(db, "users", id);

    await updateDoc(userRef, {
      gradeAndSections: arrayUnion(gradeSection),
    });

    console.log("Grade section added successfully:", gradeSection);
    toast.success("Grade and section added successfully");
  } catch (error) {
    console.error("Error adding grade section:", error);
    throw error;
  }
};

export const deleteGradeSection = async (userId: string, sectionId: string) => {
  try {
    const userRef = doc(db, "users", userId);

    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      console.error("User does not exist.");
      return;
    }

    const gradeSections = userSnapshot.data().gradeAndSections;

    const sectionToRemove = gradeSections.find(
      (section: any) => section.id === sectionId
    );

    if (!sectionToRemove) {
      console.error("Section not found:", sectionId);
      return;
    }

    await updateDoc(userRef, {
      gradeAndSections: arrayRemove(sectionToRemove),
    });

    console.log("Grade section deleted successfully:", sectionId);
    // toast.success("Grade section deleted successfully");
  } catch (error) {
    console.error("Error deleting grade section:", error);
    toast.error("Failed to delete grade section");
  }
};
