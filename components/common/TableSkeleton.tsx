import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, RotateCcw, Trash2 } from "lucide-react";

interface TableSkeletonProps<T> {
  columns: ColumnDef<T>[];
  rowCount: number;
}

export default function TableSkeleton<T>({ columns, rowCount }: TableSkeletonProps<T>) {
  const getRandomWidth = () => {
    const widths = [100, 120, 140, 160];
    return widths[Math.floor(Math.random() * widths.length)];
  };

  const SkeletonItem = ({ width }: { width: number }) => (
    <div className={`h-4 w-[${width}px] animate-pulse rounded bg-slate-200`} />
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>
              <SkeletonItem width={getRandomWidth()} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rowCount)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>
                {column.id === "teacherName" ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                    <div className="flex flex-col space-y-1">
                      <SkeletonItem width={120} />
                      <SkeletonItem width={80} />
                    </div>
                  </div>
                ) : column.id === "actions" ? (
                  <div className="flex justify-center gap-">
                    <Button variant="ghost" size="icon" className="bg-transparent">
                      <Edit className="text-slate-300 w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-transparent">
                      <RotateCcw className="text-slate-300 w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-transparent">
                      <Trash2 className="text-slate-300 w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <SkeletonItem width={getRandomWidth()} />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
