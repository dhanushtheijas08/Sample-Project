import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { ticketSchema } from "@/schema";
import { addTicket } from "@/services/dashboard/ticket-service";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const TicketsDialog = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}) => {
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [errors, setErrors] = useState<{ title?: string; issue?: string }>({});
  const { user } = useAuth();

  const handleSubmit = async () => {
    const result = ticketSchema.safeParse({ title, issue });

    if (!result.success) {
      const fieldErrors: { title?: string; issue?: string } = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0] as keyof typeof fieldErrors] = error.message;
      });
      setErrors(fieldErrors);
    } else if (user?.name && user?.uid) {
      setErrors({});
      setIsModalOpen(false);

      const ticketData = {
        userName: user?.name ?? "",
        title: title,
        adminId: user?.uid ?? "",
        status: "Open",
        description: issue,
      };

      await addTicket(ticketData);
      toast.success("Ticket added successfully!");
    } else {
      toast.error("User information is missing. Please log in again.");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(val) => setIsModalOpen(val)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Ticket</DialogTitle>
          <DialogDescription>Enter Topic to Raise a Ticket</DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="title" className="text-base">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Enter ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-1.5 mt-4">
          <Label htmlFor="issue" className="text-base">
            Describe your issue
          </Label>
          <Textarea
            id="issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
          {errors.issue && (
            <p className="text-red-600 text-sm">{errors.issue}</p>
          )}

          <Button
            className="mt-2.5 justify-self-end"
            size="lg"
            onClick={handleSubmit}
          >
            Add Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketsDialog;
