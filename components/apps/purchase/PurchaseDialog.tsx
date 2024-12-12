"use client";
import PurchaseForm from "@/components/apps/purchase/PurchaseForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { purchaseSchema } from "@/schema";
import { updatePurchase } from "@/services/dashboard/purchase-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type PurchaseDialogProps = {
  isAddPurchaseModalOpen: boolean;
  setIsAddPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PurchaseDialog = ({
  isAddPurchaseModalOpen,
  setIsAddPurchaseModalOpen,
}: PurchaseDialogProps) => {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      institute: {
        id: "",
        name: "",
      },
      course: {
        id: "",
        name: "",
      },
      plan: "",
      count: 0,
    },
  });

  const handleSubmit = async ({
    institute,
    course,
    plan,
    count,
  }: z.infer<typeof purchaseSchema>) => {
    const purchaseData = {
      institute: institute,
      course: course,
      plan: plan,
      count: count,
    };

    try {
      await updatePurchase(
        purchaseData,
        institute.id,
        course.id,
        user?.uid as string
      );
      toast.success("Purchase added successfully!");
    } catch (error) {
      toast.error("Failed to add purchase!");
    } finally {
      form.reset();
      setIsAddPurchaseModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isAddPurchaseModalOpen}
      onOpenChange={(val) => setIsAddPurchaseModalOpen(val)}
    >
      <DialogContent className="max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2.5"
          >
            <DialogHeader>
              <DialogTitle>Add Purchase</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                Add License purchase for a Institute
                <Button type="submit" className="px-14 w-full max-w-[50px]">
                  Save
                </Button>
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <PurchaseForm form={form} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
