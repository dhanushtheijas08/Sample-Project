import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleMore } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const conversationData = [
  {
    topic:
      "Describe robotics sgdcxbniwadsoczjh vhsgebdchjpibjkwbevdhsgc xnjopasiehdbuz jhhnwqdjasxhzugvjg wdsnhugiyqbknijwdashugvg",
    status: "Answered",
    time: "12:45 PM",
    actionsBtnText: "View",
    actionBtnOnclick: () => console.log("View clicked"),
  },
  {
    topic: "Explain theme 2 answer",
    status: "Submitted",
    time: "12:45 PM",
    actionsBtnText: "Open",
    actionBtnOnclick: () => console.log("Open clicked"),
  },
  {
    topic: "What is a loop?",
    status: "Unanswered",
    time: "12:45 PM",
    actionsBtnText: "Open",
    actionBtnOnclick: () => console.log("Open clicked"),
  },
];

export default function ConversationTable() {
  return (
    <Card className="max-w-md w-full mx-auto lg:mx-0 lg:max-w-full">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Topic</TableHead>
                <TableHead className="font-bold hidden sm:table-cell">
                  Status
                </TableHead>
                <TableHead className="font-bold hidden lg:table-cell">
                  Time
                </TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversationData.map((convo) => (
                <TableRow key={convo.topic}>
                  <TableCell className="font-medium text-xs sm:text-sm max-w-xs">
                    {convo.topic}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <StatusBadge status={convo.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {convo.time}
                  </TableCell>
                  <TableCell>
                    {/* <Button
                      onClick={convo.actionBtnOnclick}
                      size="sm"
                      className={cn(
                        "w-full sm:w-auto",
                        convo.actionsBtnText.toLowerCase() === "view"
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : ""
                      )}
                    >
                      {convo.actionsBtnText}
                    </Button> */}

                    <Button size="icon" variant="ghost">
                      <MessageCircleMore className=" h-5 w-5 sm:h-8 sm:w-8" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-full text-xs sm:text-sm font-semibold text-center w-full sm:w-auto max-w-[7rem]",
        status === "Answered" ? "bg-green-100 text-green-800" : "",
        status === "Submitted" ? "bg-blue-100 text-blue-800" : "",
        status === "Unanswered" ? "bg-yellow-100 text-yellow-800" : ""
      )}
    >
      {status}
    </div>
  );
}
