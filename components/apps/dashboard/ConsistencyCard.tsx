import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame } from "lucide-react";
const ConsistencyCard = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const activeDays = [3, 4, 5, 10, 15, 16, 17, 23, 24, 25];
  return (
    <Card className="max-w-md mx-auto lg:mx-0 lg:max-w-xs">
      <CardHeader className="flex flex-row justify-between items-center p-3">
        <h3 className="text-lg">Consistency</h3>
        <Select>
          <SelectTrigger className="w-[100px] rounded-2xl">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="jan" className="rounded-2xl">
              Jan
            </SelectItem>
            <SelectItem value="feb" className="rounded-2xl">
              Feb
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex flex-row gap-1">
          {days.map((day) => (
            <div
              key={day}
              className={`h-5 sm:h-6 w-1 sm:w-2 rounded-sm ${
                activeDays.includes(day) ? "bg-blue-500" : "bg-blue-100"
              }`}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3">
        <div className="flex">
          <div className="flex items-center space-x-2">
            <Flame className="text-orange-500" />
            <span className="font-semibold text-nowrap text-sm sm:text-base">
              4 days strike
            </span>
          </div>
          <p className="text-gray-500 ml-6 text-sm sm:text-nowrap">
            76 hrs this month
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConsistencyCard;
