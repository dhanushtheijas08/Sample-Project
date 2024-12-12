"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { appendChatToFeedback, updateFeedbackStatus } from "@/services/dashboard/feedback-service";
import { FeedbackData } from "@/schema";
import { cn } from "@/lib/utils";
import ChatWindow from "./ChatWindow";

const FeedbackTable = ({ feedbacks }: { feedbacks: FeedbackData[] }) => {
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

  const handleClose = async (feedbackId: string) => {
    await updateFeedbackStatus(feedbackId, "Closed");
  };

  return (
    <Card className="mt-5 mb-14">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Opened At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks?.map((feedback: FeedbackData, index: number) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-3">
                  <div
                    className="bg-gray-200 text-black flex items-center justify-center rounded-full"
                    style={{ width: 60, height: 60 }}
                  >
                    <span className="text-xl font-bold">{feedback?.studentName?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <p> {feedback?.studentName} </p>
                    <p className="text-muted-foreground">{feedback?.topic}</p>
                  </div>
                </TableCell>
                <TableCell>{<StatusBadge status={feedback?.status} />}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {feedback?.createdAt ? new Date(feedback?.createdAt).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-full text-xs sm:text-sm font-semibold text-center w-full sm:w-auto max-w-[7rem]",
        status === "Open" ? "bg-green-100 text-green-800" : "",
        status === "Closed" ? "bg-yellow-100 text-yellow-800" : ""
      )}
    >
      {status}
    </div>
  );
}

export default FeedbackTable;
