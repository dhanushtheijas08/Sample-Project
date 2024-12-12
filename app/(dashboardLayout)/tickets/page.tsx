/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import TicketsTable from "@/components/apps/dashboard/TicketsTable";
import { ProtectedRoute } from "@/components/common";
import TicketsDialog from "@/components/tickets/TicketsDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getAllTickets } from "@/services/dashboard/ticket-service";
import { useEffect, useState } from "react";
import { TicketData } from "@/schema";

const TicketsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketsData, setTicketsData] = useState<TicketData[]>([]);

  const { user } = useAuth();

  const handleDialogOpen = () => {
    setIsModalOpen(true);
  };

  const handleTicketsUpdate = (tickets: TicketData[]) => {
    setTicketsData(tickets);
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
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div>
        <div className="flex justify-between">
          <div className="flex items-start gap-4 flex-col md:flex-row md:items-center">
            <h2 className="text-xl text-nowrap">Tickets</h2>
          </div>
          {user?.role === "admin" && (
            <div className="flex flex-row gap-1.5">
              <Button onClick={handleDialogOpen}>Add Ticket</Button>
            </div>
          )}
        </div>

        <TicketsTable ticketData={ticketsData} />
        {user?.role === "admin" && (
          <TicketsDialog
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default TicketsPage;
