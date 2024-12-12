"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  appendChatToTicket,
  updateTicketStatus,
} from "@/services/dashboard/ticket-service";
import ChatWindow from "./ChatWindow";
import { TicketData } from "@/schema";

const TicketsTable = ({ ticketData }: { ticketData: TicketData[] }) => {
  const { user } = useAuth();

  const addMessage = async (message: string, ticketId: string) => {
    if (!user?.role) {
      console.error("User role is not defined");
      return;
    }

    const chatMessage = {
      sender: user?.role ?? "",
      message,
      createdAt: new Date().toISOString(),
    };
    await appendChatToTicket(ticketId, chatMessage);
  };

  const handleClose = async (ticketId: string) => {
    await updateTicketStatus(ticketId, "Closed");
  };

  if (ticketData?.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-500 mt-10">
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
        <h2 className="text-lg font-semibold">No Data Found</h2>
        <p className="mt-2 text-sm">
          It looks like there are no data in the list. Please add some or check
          back later.
        </p>
      </div>
    );
  }

  return (
    <Card className="mt-5 mb-14">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="">Opened At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketData?.map((ticket, index: number) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-3">
                  <div
                    className="bg-gray-200 text-black flex items-center justify-center rounded-full"
                    style={{ width: 60, height: 60 }}
                  >
                    <span className="text-xl font-bold">
                      {ticket?.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p> {ticket?.userName} </p>
                    <p className="text-muted-foreground">
                      {ticket?.title} | {ticket?.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{<StatusBadge status={ticket?.status} />}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {ticket?.createdAt
                    ? new Date(ticket?.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <ChatWindow
                    addMessage={addMessage}
                    chatInfo={{
                      id: ticket?.id ?? "",
                      userName: ticket?.userName,
                      title: ticket?.title,
                      status: ticket?.status,
                    }}
                    messages={ticket?.chats ?? []}
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

export default TicketsTable;
