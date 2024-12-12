"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export const description = "A donut chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

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
  firefox: {
    label: "Firefox",
    color: "#FF7188",
  },
  edge: {
    label: "Edge",
    color: "#9695E8",
  },
  other: {
    label: "Other",
    color: "#FF889B",
  },
} satisfies ChartConfig;

const LevelChart = () => {
  const chartLabelData = [
    {
      title: "Level 1",
      value: 30,
      color: "bg-[#FF4564]",
    },
    {
      title: "Level 2",
      value: 20,
      color: "bg-[#6766DB]",
    },
    {
      title: "Level 3",
      value: 15,
      color: "bg-[#FF7188]",
    },
    {
      title: "Level 4",
      value: 10,
      color: "bg-[#9695E8]",
    },
    {
      title: "Level 5",
      value: 5,
      color: "bg-[#FF889B]",
    },
  ];
  return (
    <Card className="border-none shadow-none">
      <CardContent className="pb-0 px-0 flex flex-row items-center">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[250px] flex-1"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>

        <div className="flex flex-col flex-wrap gap-1.5 max-w-xs">
          {chartLabelData.map((data) => (
            <div key={data.title} className="flex flex-row items-center">
              <div className={cn("w-3 h-3 rounded-sm", true && data.color)} />
              <span className="text-sm pl-1">{data.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default LevelChart;
