
"use client";
import { db } from "@/lib/firebase";
import { PurchaseData } from "@/schema";
import {
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export const updatePurchase = async (
  purchaseData: PurchaseData,
  adminId: string,
  courseId: string,
  userId: string
) => {
  const customDocId = `${adminId}_${courseId}`;
  const purchaseRef = doc(db, "purchases", customDocId);
  const { plan, count, institute, course } = purchaseData;

  const newHistoryEntryId = new Date().getTime().toString();
  const newHistoryEntry = {
    count,
    plan,
    purchasedAt: serverTimestamp(),
  };
  console.log(course);

  const adminRef = doc(db, "users", adminId);
  const adminDoc = await getDoc(adminRef);
  const instituteData = adminDoc.data();

  try {
    const courseExists = instituteData?.courses?.some(
      (c: any) => c.id === course.id
    );

    if (!courseExists) {
      await setDoc(
        adminRef,
        {
          courses: arrayUnion({
            id: course.id,
            name: course.name,
            image: course.image,
          }),
        },
        { merge: true }
      );
      console.log("Course added to instituteData.");
    } else {
      console.log("Course already exists in instituteData, no changes made.");
    }

    const docSnap = await getDoc(purchaseRef);

    if (docSnap.exists()) {
      await updateDoc(purchaseRef, {
        [`history.${newHistoryEntryId}`]: newHistoryEntry,
        ...(plan === "annual" && { annual: increment(count), purchasedAnnual:  increment(count)}),
        ...(plan === "monthly" && { monthly: increment(count), purchasedMonthly: increment(count)}),
        admin: {
          adminId: userId,
          name: institute.name,
          image: "",
        },
        course: {
          name: course.name,
          image: "",
        },
        purchasedAt: serverTimestamp(),
      });
    } else {
      await setDoc(purchaseRef, {
        history: { [newHistoryEntryId]: newHistoryEntry },
        ...(plan === "annual" && { annual: count, monthly: 0, purchasedAnnual: count, purchasedMonthly: 0, activatedAnnual: 0, activatedMonthly: 0 }),
        ...(plan === "monthly" && { monthly: count, annual: 0, purchasedAnnual: 0, purchasedMonthly: count, activatedAnnual: 0, activatedMonthly: 0 }),
        admin: {
          name: institute.name,
          image: "",
        },
        course: {
          name: course.name,
          image: "",
        },
        purchasedAt: serverTimestamp(),
      });
    }

    console.log("Purchase updated or created successfully!");
  } catch (error) {
    console.error("Error updating or creating purchase:", error);
    throw error;
  }
};

export const getAllPurchases = (callback: (purchases: any[]) => void, adminId?: string) => {
  try {
    const purchasesRef = collection(db, "purchases");

    const unsubscribe = onSnapshot(purchasesRef, (querySnapshot) => {
      const purchases = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          
          
          if (adminId && doc.id.startsWith(adminId + "_")) {
            if (Array.isArray(data.history)) {
              data.history.sort((a, b) => {
                return (
                  a.timestamp.seconds +
                  a.timestamp.nanoseconds / 1e9 - 
                  (b.timestamp.seconds + b.timestamp.nanoseconds / 1e9)
                );
              });
            }

            return {
              id: doc.id,
              ...data,
            };
          } else if (!adminId) {
            
            if (Array.isArray(data.history)) {
              data.history.sort((a, b) => {
                return (
                  a.timestamp.seconds +
                  a.timestamp.nanoseconds / 1e9 - 
                  (b.timestamp.seconds + b.timestamp.nanoseconds / 1e9)
                );
              });
            }

            return {
              id: doc.id,
              ...data,
            };
          }
          
          return null; 
        })
        .filter((purchase) => purchase !== null); 

      callback(purchases);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    throw error;
  }
};
