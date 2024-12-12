import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DeletePopup({
  open,
  isDeleting,
  setOpen,
  handleDelete,
}: {
  open: boolean;
  isDeleting: boolean;
  setOpen: (open: boolean) => void;
  handleDelete: () => Promise<void>;
  id: string | undefined;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white border border-gray-600">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="text-xl"> Are you absolutely sure?</p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently end the conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            disabled={isDeleting}
            className={`py-2 px-4 ml-2 outline outline-gray-600 border-gray-600 rounded-md text-sm font-medium min-w-[140px] hover:bg-primary-dark/90 shadow-md transition-all duration-200 ease-in-out`}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          {isDeleting ? (
            <Button
              disabled={true}
              className="px-8 rounded-lg min-w-[140px] hover:bg-opacity-50 bg-red-600 transition-all duration-200 ease-in-out"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Closing
            </Button>
          ) : (
            <Button
              disabled={isDeleting}
              className="px-8 rounded-lg min-w-[140px] hover:bg-opacity-20 bg-red-600 transition-all duration-200 ease-in-out"
              onClick={handleDelete}
            >
              {isDeleting ? "Closing..." : "Close"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
