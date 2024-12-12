/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Timestamp } from "firebase/firestore";
import { Calendar, CheckCircle, Info } from "lucide-react";
import { PurchaseInfo } from "../purchase-table/columns";

function convertFirestoreTimestamp(timestamp: Timestamp) {
  return timestamp?.toDate()?.toLocaleDateString();
}

export default function HistoryDialog({
  open,
  setOpen,
  historyObject,
  purchaseInfo,
}: {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  historyObject: Record<string, any>;
  purchaseInfo: PurchaseInfo;
}) {
  const history = Object.values(historyObject);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-transparent hover:bg-transparent hover:underline">
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[550px] h-[600px] scrollbar-none overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Purchase History</DialogTitle>
          <DialogDescription>
            {purchaseInfo.instituteName} - {purchaseInfo.courseName}
          </DialogDescription>
        </DialogHeader>
        <Separator className="mb-2 mt-4" />
        <div className="overflow-y-auto h-full mx-6 scrollbar-none">
          {history.length === 0 ? (
            <p>No history available.</p>
          ) : (
            history.map((item) => (
              <Card key={item?.purchasedAt} className="bg-zinc-100 rounded-lg mb-6 border-none">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Plan</span>
                      <p>{item?.plan.charAt(0).toUpperCase() + item?.plan.slice(1)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Purchased At</span>
                      <p>{convertFirestoreTimestamp(item?.purchasedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Info className="h-5 w-5 text-gray-500" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Count</span>
                      <p>{item?.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
