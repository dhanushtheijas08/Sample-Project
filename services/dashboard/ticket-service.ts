import { addDoc, arrayUnion, collection, doc, DocumentData, onSnapshot, orderBy, Query, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from 'sonner';
import { ChatMessage, TicketData } from '@/schema';



export const getAllTickets = (
  callback: (tickets: TicketData[]) => void,
  adminId?: string 
) => {
  try {
    let ticketsQuery: Query<DocumentData> = collection(db, "tickets");

    if (adminId) {
      ticketsQuery = query(ticketsQuery, where("adminId", "==", adminId));
    }

    ticketsQuery = query(ticketsQuery, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketList = snapshot.docs.map((doc) => {
        const { id, ...data } = doc.data() as TicketData; 
        return {
          id: doc.id,
          ...data,
        };
      });

      callback(ticketList);
    });

    return unsubscribe;
  } catch (error) {
    toast.error("Failed to fetch tickets!")
    console.error("Error listening for tickets updates: ", error);
  }
};


  
export const addTicket = async (ticketData: TicketData) => {
    try {
      const ticket = {
        ...ticketData,
        chats: [], 
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "tickets"), ticket);
      console.log("Document added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  export const updateTicketStatus = async (docId: string, status: string) => {
    try {
      const ticketRef = doc(db, "tickets", docId);
  
   
      await updateDoc(ticketRef, {
        status: status,
      });
  
      console.log(`Ticket ${docId} status updated to: ${status}`);
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };

  export const appendChatToTicket = async (ticketId: string, chat: ChatMessage) => {
    try {
      const ticketDocRef = doc(db, "tickets", ticketId); 
  
      await updateDoc(ticketDocRef, {
        chats: arrayUnion(chat), 
      });
  
      console.log("Chat appended successfully to ticket:", ticketId);
    } catch (error) {
      console.error("Error appending chat to ticket:", error);
    }
  };