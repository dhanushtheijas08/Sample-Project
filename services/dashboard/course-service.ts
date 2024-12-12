import { db } from "@/lib/firebase";
import { collection, doc, getDoc, onSnapshot} from "firebase/firestore";

export const getCourses = (callback: (courses: any[]) => void) => {
  try {
    const coursesCollection = collection(db, "courses");

    const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
      const coursesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(coursesList);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error listening for course updates: ", error);
  }
};


export const getCourseById = async (courseId: string, callback: (course: any) => void) => {
    try {
      const courseDocRef = doc(db, "courses", courseId); 
      const courseDoc = await getDoc(courseDocRef);
  
      if (courseDoc.exists()) {
        const courseData = {
          id: courseDoc.id,
          ...courseDoc.data(),
        };
        callback(courseData); 
      } else {
        console.error("No such course exists!");
        callback(null); 
      }
    } catch (error) {
      console.error("Error getting course: ", error);
      callback(null);
    }
  };
