import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { FeedbackData } from "@/schema";
import { appendChatToFeedback, getFeedbacks, updateFeedbackStatus } from "@/services/dashboard/feedback-service";
import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import FeedbackDialog from "../feedback/FeedbackDialog";

const RecentFeedbackCard = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  const addMessage = async (message: string, feedbackId: string) => {
    if (!user || !user.role) {
      console.error("User or user role is not defined");
      return;
    }

    const chatMessage = {
      sender: user?.role ?? "",
      message,
      createdAt: new Date().toISOString(),
    };
    await appendChatToFeedback(feedbackId, chatMessage);
  };

  const handleFeedbacksUpdate = (feedbacks: FeedbackData[]) => {
    setFeedbacks(feedbacks.slice(0, 10));
  };

  const handleClose = async (feedbackId: string) => {
    await updateFeedbackStatus(feedbackId, "Closed");
  };
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user?.role == "teacher" && user.uid) {
      unsubscribe = getFeedbacks(handleFeedbacksUpdate, user?.uid);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-lg text-primary/80 font-semibold">Recent Feedback</div>
          {user?.role == "teacher" && (
            <div className="flex flex-row gap-1.5">
              <Button onClick={() => setIsModalOpen(true)}>Add</Button>
              <FeedbackDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* <div className="flex flex-row justify-between">
          <div className="grid grid-cols-2 gap-y-1 gap-x-2.5 items-center">
            <MessageSquareMore className="w-8 h-8 text-[#AAAAAA] " />
            <p className="text-[#464646] text-xl font-semibold">3</p>
            <p className="text-[#464646] col-span-2 ">Open</p>
          </div>
          <div className="grid grid-cols-2 gap-y-1 gap-x-2.5 items-center">
            <MessageSquareMore className="w-8 h-8 text-[#AAAAAA] " />
            <p className="text-[#464646] text-xl font-semibold">3</p>
            <p className="text-[#464646] col-span-2">Answered</p>
          </div>
        </div> */}
        <ScrollArea className="w-full xl:w-72 h-[38.5rem]">
          {feedbacks.length == 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-10 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9"></path>
                <path d="M12 4h9"></path>
                <path d="M3 12h9"></path>
                <path d="M12 12L4 6"></path>
                <path d="M12 12L4 18"></path>
              </svg>
              <h2 className="text-lg font-semibold">No Feedbacks Found</h2>
            </div>
          ) : (
            <>
              {feedbacks.map((feedback, index) => (
                <div className="flex justify-between px-3 mb-3.5" key={index}>
                  <div className="flex flex-col">
                    <p> {feedback.topic} </p>
                    <span className="text-sm text-[#818181]">{feedback.studentName}</span>
                  </div>

                  <ChatWindow
                    addMessage={addMessage}
                    chatInfo={{
                      id: feedback?.id,
                      userName: feedback?.studentName,
                      title: feedback?.topic,
                      status: feedback?.status,
                    }}
                    messages={feedback?.chats}
                    handleClose={handleClose}
                  ></ChatWindow>
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentFeedbackCard;
