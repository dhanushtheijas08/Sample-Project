/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
// import { ChevronsRight } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { columns } from "./column-submissions";
// import { getSubmissionByLevelStudentClass } from "@/services/dashboard/scoreboard-service";
// import { ColumnDef } from "@tanstack/react-table";
// import { AllSubmissionsDataTable } from "./all-submissions-data-table";
// export default function AllSubmission({
//   payload,
// }: {
//   payload: {
//     levelId: string;
//     classId: string;
//     studentId: string;
//   };
// }) {
//   const [allSubmissions, setAllSubmissions] = useState<any>([]);
//   const [isClicked, setIsClicked] = useState(false);

//   const fetchAllsubmissions = async () => {
//     const allSubmissions = await getSubmissionByLevelStudentClass(
//       payload.levelId,
//       payload.studentId,
//       payload.classId
//     );
//     console.log(JSON.stringify(allSubmissions));
//     setAllSubmissions(allSubmissions);
//   };
//   useEffect(() => {
//     fetchAllsubmissions();
//   }, [isClicked]);

//   return (
//     <div>
//       <Dialog>
//         <DialogTrigger>
//           <Button variant="ghost" onClick={() => setIsClicked((prev) => !prev)}>
//             <ChevronsRight />
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="w-[100vw] min-w-[90vw] flex flex-col items-center justify-center">
//           <DialogTitle className="px-32  font-semibold w-full flex justify-start">
//             All Submissions
//           </DialogTitle>
//           <AllSubmissionsDataTable
//             columns={
//               columns as ColumnDef<{ email?: string | undefined }, unknown>[]
//             }
//             data={allSubmissions}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronsRight } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { columns } from "./column-submissions";
import { getSubmissionByLevelStudentClass } from "@/services/dashboard/scoreboard-service";
import { ColumnDef } from "@tanstack/react-table";
import { AllSubmissionsDataTable } from "./all-submissions-data-table";

export default function AllSubmission({
  payload,
}: {
  payload: {
    levelId: string;
    classId: string;
    studentId: string;
  };
}) {
  const [allSubmissions, setAllSubmissions] = useState<any>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [sortBy, setSortBy] = useState<string>("submissionTime");
  const [sortOrder, setSortOrder] = useState<string>("descending");

  const fetchAllSubmissions = async () => {
    const submissions = await getSubmissionByLevelStudentClass(
      payload.levelId,
      payload.studentId,
      payload.classId
    );
    console.log(JSON.stringify(submissions, null, 2));
    setAllSubmissions(submissions);
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, [isClicked]);

  const sortedSubmissions = useMemo(() => {
    if (!allSubmissions) return;
    const sorted = [...allSubmissions].sort((a: any, b: any) => {
      let valueA, valueB;

      if (sortBy === "name") {
        valueA = a.userInfo?.name?.toLowerCase() || "";
        valueB = b.userInfo?.name?.toLowerCase() || "";
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }

      if (valueA === undefined || valueA === null)
        return sortOrder === "ascending" ? -1 : 1;
      if (valueB === undefined || valueB === null)
        return sortOrder === "ascending" ? 1 : -1;

      if (sortOrder === "ascending") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
    return sorted;
  }, [allSubmissions, sortBy, sortOrder]);

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost" onClick={() => setIsClicked((prev) => !prev)}>
            <ChevronsRight />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[100vw] min-w-[90vw] flex flex-col items-center justify-center">
          <DialogTitle className="px-32 font-semibold w-full flex justify-start">
            All Submissions
          </DialogTitle>
          <div className="flex items-center gap-2.5 mt-8 self-end">
            <h2>Sort By</h2>
            <Select onValueChange={(val) => setSortBy(val)} value={sortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="submissionTime">Submission Time</SelectItem>
                <SelectItem value="grade">Grade</SelectItem>
                <SelectItem value="timeTaken">Time Taken</SelectItem>
                <SelectItem value="sessionTime">Session Time</SelectItem>
                <SelectItem value="attempts">Attempts</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(val) => setSortOrder(val)}
              value={sortOrder}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ascending">Ascending</SelectItem>
                <SelectItem value="descending">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {sortedSubmissions !== undefined && (
            <AllSubmissionsDataTable
              columns={
                columns as ColumnDef<{ email?: string | undefined }, unknown>[]
              }
              data={sortedSubmissions}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
