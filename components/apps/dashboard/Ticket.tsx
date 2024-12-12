import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { TicketData } from "@/schema";
import { appendChatToTicket, getAllTickets, updateTicketStatus } from "@/services/dashboard/ticket-service";
import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import TicketsDialog from "@/components/tickets/TicketsDialog";

export default function TicketManagement() {
  const [ticketsData, setTicketsData] = useState<TicketData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  const handleTicketsUpdate = (tickets: TicketData[]) => {
    setTicketsData(tickets.slice(0, 3));
  };

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

  const handleDialogOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = async (ticketId: string) => {
    await updateTicketStatus(ticketId, "Closed");
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user?.role == "admin") {
      unsubscribe = getAllTickets(handleTicketsUpdate, user?.uid);
    } else if (user?.role == "superadmin") {
      unsubscribe = getAllTickets(handleTicketsUpdate);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  return (
    <div className="container mx-auto max-w-md xl:max-w-full">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="text-lg text-primary/80 font-semibold">Ticket</div>
            {user?.role === "admin" && (
              <div className="flex flex-row gap-1.5">
                <Button onClick={handleDialogOpen}>Add Ticket</Button>
              </div>
            )}
          </div>
          {/* <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="font-semibold">9</span>
              <span className="text-sm text-gray-500">New</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="font-semibold">4</span>
              <span className="text-sm text-gray-500">Open</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="font-semibold">5</span>
              <span className="text-sm text-gray-500">Closed</span>
            </div>
          </div> */}
        </CardHeader>

        <CardContent>
          {ticketsData.length == 0 ? (
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
              <h2 className="text-lg font-semibold">No Tickets Found</h2>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketsData.map((ticket, index) => (
                  <TableRow key={index}>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "Closed" ? "secondary" : ticket.status === "New" ? "default" : "secondary"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {" "}
                      {ticket?.createdAt ? new Date(ticket?.createdAt).toLocaleDateString() : "N/A"}
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
          )}
          {user?.role === "admin" && <TicketsDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </CardContent>
      </Card>
    </div>
  );
}
