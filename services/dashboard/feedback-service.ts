import { db } from "@/lib/firebase";
import { ChatMessage, ClassData } from "@/schema";
import { addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";


interface FeedbackData {
  teacherId: string;
  studentId: string;
  status: string;
  topic: string;
  chats: any;
  createdAt: string; 
}

export const addFeedback = async (feedbackData: FeedbackData) => {
  try {
    console.log(feedbackData);
    
    const feedbackCollection = collection(db, "feedbacks");
    const docRef = await addDoc(feedbackCollection, {
      ...feedbackData,
      createdAt: new Date().toISOString(), 
    });
    toast.success("Feedback added successfully!")
    console.log("Feedback added with ID:", docRef.id);
    return docRef.id; 
  } catch (error) {
    toast.error("Failed to add feedback!")
    console.error("Error adding feedback: ", error);
    throw error; 
  }
};

export const getFeedbacks = (
  callback: (feedbacks: any[]) => void,
  teacherId?: string,
) => {
  try {
    const feedbackCollection = collection(db, "feedbacks");
    let feedbackQuery;

    if (teacherId) {
      feedbackQuery = query(feedbackCollection, where("teacherId", "==", teacherId), orderBy("createdAt", "desc"));
    } 
    else {
      console.warn("No teacherId or studentId provided for fetching feedback.");
      return; 
    }

    const unsubscribe = onSnapshot(feedbackQuery, (snapshot) => {
      const feedbackList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(feedbackList);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error listening for feedback updates: ", error);
  }
};

export const updateFeedbackStatus = async (docId: string, status: string) => {
  try {
    const feedbackRef = doc(db, "feedbacks", docId);

 
    await updateDoc(feedbackRef, {
      status: status,
    });

    console.log(`Feedback ${docId} status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating feedback status: ", error);
  }
};

export const appendChatToFeedback = async (feedbackId: string, chat: ChatMessage) => {
  try {
    const feedbackRef = doc(db, "feedbacks", feedbackId); 

    await updateDoc(feedbackRef, {
      chats: arrayUnion(chat), 
    });

    console.log("Chat appended successfully to feedback:", feedbackId);
  } catch (error) {
    console.error("Error appending chat to feedback:", error);
  }
};

export const getClasses = async (teacherId: string | undefined) => {
  if (!teacherId) {
    throw new Error("Teacher ID is required");
  }

  const classesCollection = collection(db, "classes");

  try {
    const q = query(classesCollection, where("teacherId", "==", teacherId));

    const classSnapshot = await getDocs(q);
    const classList = classSnapshot.docs.map(doc => {
      const { id, ...data } = doc.data() as ClassData;
      return {
        id: doc.id,
        ...data,
      };
    });

    console.log(classList);

    return classList;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw new Error("Failed to fetch classes");
  }
};

export const sendMessageWithFile = async (
  newMessage: string,
  selectedFile: File | null
): Promise<string> => {
  let messageContent = newMessage.trim();

  if (selectedFile) {
    const storage = getStorage();
    const storageRef = ref(storage, `chat_files/${selectedFile.name}`);

    try {
      await uploadBytes(storageRef, selectedFile);
      const fileUrl = await getDownloadURL(storageRef);
      messageContent += `\nFile: ${fileUrl}`;
    } catch (error) {
      toast.error("File upload failed!");
      throw new Error("File upload failed");
    }
  }

  return messageContent;
};