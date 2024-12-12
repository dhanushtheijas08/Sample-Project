/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getAllPurchases } from "@/services/dashboard/purchase-service";
import { getCourses } from "@/services/dashboard/course-service";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#FF4564",
  },
  safari: {
    label: "Safari",
    color: "#6766DB",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload }: any) => {
  const { user } = useAuth();
  if (active && payload && payload.length) {
    const { course, remaining, fill, total, totalActivated, totalGraduated } = payload[0]?.payload || {};
    return (
      <div className="bg-white p-2 shadow-md rounded border border-gray-200">
        <p className="text-sm font-semibold" style={{ color: fill || "#000" }}>
          {course || "Unknown"}
        </p>
        {user?.role == "admin" && (
          <>
            <p className="text-xs">Remaining License: {remaining ?? "N/A"}</p>
            <p className="text-xs">Total License: {total ?? "N/A"}</p>
            <p className="text-xs">Total Activated: {totalActivated ?? "N/A"}</p>
            <p className="text-xs">Total Graduated: {totalGraduated ?? "0"}</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

const CoursesBoughtOrSold = ({ componentOwner }: { componentOwner: "admin" | "superadmin" }) => {
  const colors = ["#FF4564", "#6766DB"];
  const bgColors = ["bg-[#FF4564]", "bg-[#6766DB]"];

  const [chartData, setChartData] = useState<any>([]);

  const { user } = useAuth();

  const handlePurchases = (newPurchases: any) => {
    const data = newPurchases?.map((purchase: any, index: number) => ({
      course: purchase?.course?.name,
      remaining: purchase?.annual + purchase?.monthly,
      total: purchase?.purchasedAnnual + purchase?.purchasedMonthly,
      totalActivated: purchase?.activatedAnnual + purchase?.activatedMonthly || "N/A",
      totalGraduated: purchase?.graduatedAnnual + purchase?.graduatedMonthly || "N/A",
      fill: colors[index % 2],
    }));

    setChartData(data);
  };

  const handleCourse = (courses: any) => {
    const data = courses?.map((course: any, index: number) => ({
      course: course?.title,
      remaining: 1,
      fill: colors[index % 2],
    }));

    setChartData(data);
  };

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (user?.role === "admin") {
      unsubscribe = getAllPurchases(handlePurchases, user?.uid) || (() => {});
    } else {
      unsubscribe = getCourses(handleCourse) || (() => {});
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Card className="w-full h-full max-w-md mx-auto xl:mx-0 pb-6">
      <CardHeader>
        <p className="text-lg text-primary/80 font-semibold">Course {componentOwner === "admin" ? "Bought" : "Sold"}</p>
      </CardHeader>
      <CardContent className="flex-1 py-0 h-full flex flex-col sm:flex-row-reverse items-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Pie data={chartData} dataKey="remaining" nameKey="course" innerRadius={60} />
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1.5 lg:gap-x-4 max-w-xs">
          {chartData.map((data: any, index: number) => (
            <div key={index} className="flex flex-row items-center">
              <div className={`p-1.5 rounded-sm mr-2 ${bgColors[index % 2]}`}></div>
              <span className="text-sm pl-1">{data.course}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoursesBoughtOrSold;
