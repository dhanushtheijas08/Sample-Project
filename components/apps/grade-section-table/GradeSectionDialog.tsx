import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { gradeSectionSchema } from "@/schema";
import { appendGradeSection } from "@/services/dashboard/grade-section-service"; // Adjust import as necessary
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface GradeSectionDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const GradeSectionDialog: React.FC<GradeSectionDialogProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [name, setName] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const { user } = useAuth();

  const handleSubmit = async () => {
    const result = gradeSectionSchema.safeParse({ name });

    if (!result.success) {
      const fieldErrors: { name?: string } = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0] as keyof typeof fieldErrors] = error.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});

      const gradeSectionData = {
        name,
      };

      try {
        await appendGradeSection(user?.uid as string, gradeSectionData);
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Failed to add grade and section!");
      } finally {
        setName("");
      }
    }
  };

  useEffect(() => {
    setName("");
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Grade and Section</DialogTitle>
          <DialogDescription>
            Enter the name of the grade and section.
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name" className="text-lg">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

          <Button
            id="submit"
            className="mt-2.5 justify-self-end"
            size="lg"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeSectionDialog;
