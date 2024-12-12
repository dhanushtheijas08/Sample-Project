/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { SendIcon, MessageCircleMore } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import DeletePopup from "@/components/common/DeletePopUp";
import { sendMessageWithFile } from "@/services/dashboard/feedback-service";

const ChatWindow = ({
  chatInfo,
  messages,
  addMessage,
  handleClose,
}: {
  chatInfo: {
    id: string;
    userName: string;
    title: string;
    status: string;
  };
  messages: { message: string; sender: string; createdAt: string }[];
  addMessage: (message: string, id: string) => void;
  handleClose: (ticketId: string) => void;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletePopup, setDeletePopup] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });
  const [isDeleting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const pathname = usePathname();

  let buttonText;

  if (pathname === "/feedback") {
    buttonText = "Close Feedback";
  } else if (pathname === "/tickets") {
    buttonText = "Close Ticket";
  } else {
    buttonText = "Close";
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const messageContent = await sendMessageWithFile(newMessage, selectedFile);

      if (messageContent) {
        addMessage(messageContent, chatInfo?.id);
        setNewMessage("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const isFileMessage = (message: string) => {
    const regex = /File: (https?:\/\/[^\s]+)/g;
    const match = regex.exec(message);
    return match ? match[1] : null;
  };

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, newMessage]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" asChild>
          <MessageCircleMore
            className={`h-5 w-5 ${pathname == "/dashboard" ? "sm:h-7 sm:w-7" : "sm:h-8 sm:w-8"} cursor-pointer`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full h-[100dvh] sm:max-w-[425px] sm:h-[100dvh] p-0 border-none">
        <Card className="w-full h-full flex flex-col border-none">
          <CardHeader className="border-b border-gray-300 p-4 flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <div
                className="bg-gray-200 text-black flex items-center justify-center rounded-full"
                style={{ width: 60, height: 60 }}
              >
                <span className="text-xl font-bold">{chatInfo?.userName?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <SheetTitle className="text-base">{chatInfo?.userName}</SheetTitle>
                <p className="text-sm text-black/80">{chatInfo?.title}</p>
              </div>
            </div>
            {(user?.role === "superadmin" && chatInfo?.status !== "Closed") ||
            (user?.role === "teacher" && chatInfo?.status !== "Closed") ? (
              <>
                <Button
                  className="bg-red-500 px-4"
                  size="sm"
                  onClick={() => setDeletePopup({ open: true, id: chatInfo?.id })}
                >
                  {buttonText}
                </Button>
                <DeletePopup
                  open={deletePopup.open && deletePopup.id === chatInfo?.id}
                  handleDelete={async () => await handleClose(chatInfo?.id)}
                  isDeleting={isDeleting}
                  setOpen={(open) =>
                    setDeletePopup({
                      open,
                      id: open ? chatInfo?.id : undefined,
                    })
                  }
                  id={chatInfo?.id}
                />
              </>
            ) : null}
          </CardHeader>
          <CardContent ref={scrollAreaRef} className="h-full overflow-y-auto p-4 scrollbar-none">
            <div className="space-y-4">
              {messages?.map((message) => {
                const fileUrl = isFileMessage(message.message);
                return (
                  <div
                    key={message.createdAt}
                    className={`flex ${message.sender === user?.role ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[90%] relative ${
                        message.sender === user?.role ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {fileUrl ? (
                        <div className="flex items-center">
                          <div
                            className={`bg-white rounded-md p-2 flex items-center py-4 px-4 justify-between w-full m-2 ${
                              message.sender === user?.role ? "bg-opacity-20" : "bg-opacity-70"
                            }`}
                          >
                            <div className="flex items-center">
                              <p className="text-xs mb-0">
                                {fileUrl.split("%").pop()?.split("?")[0] ?? "File name not available"}
                              </p>
                            </div>
                            <Button
                              className={`bg-white bg-opacity-50 border border-gray-200 ml-2 h-6 hover:bg-white/30 ${
                                message.sender === user?.role ? "text-white" : "text-gray-800 border-gray-300"
                              }`}
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              Open
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm mb-2">{message.message}</p>
                      )}

                      <p className={cn("text-right text-[10px] opacity-70 font-thin")}>
                        {new Date(message.createdAt).toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          {selectedFile && (
            <CardFooter className="p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between w-full border p-2 rounded-lg">
                <div>
                  <p className="text-sm font-semibold">File: {selectedFile.name}</p>
                  <p className="text-xs text-gray-500">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button variant="destructive" onClick={() => setSelectedFile(null)}>
                  Remove
                </Button>
              </div>
              <Button onClick={handleSendMessage}>Send File</Button>
            </CardFooter>
          )}

          {chatInfo?.status === "Open" && (
            <CardFooter className="p-4">
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit">
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
                <Input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} />
                <Button
                  type="button"
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  +
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default ChatWindow;
