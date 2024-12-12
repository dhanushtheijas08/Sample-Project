/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
interface DashboardSelectProps {
  placeholder: string;
  options: { value: string; label: string; courseName?: string }[];
  className?: string;
  searchParamsKey: string;
  type: "class" | "theme";
}

const DashboardSelect = ({
  type,
  searchParamsKey,
  placeholder,
  options,
  className = "w-full sm:w-[180px] lg:w-[220px] sm:text-base",
}: DashboardSelectProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(searchParamsKey) || options[0]?.value;

  const handleValueChange = (val: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(searchParamsKey, val);
    router.replace(`?${currentParams.toString()}`);
  };

  useEffect(() => {
    if (!selectedValue && options.length > 0) {
      const defaultVal = options[0].value;
      const params = new URLSearchParams(window.location.search);
      params.set(searchParamsKey, defaultVal);
      router.replace(`?${params.toString()}`);
    }
  }, [selectedValue, options, searchParamsKey, router]);

  return (
    <Select onValueChange={handleValueChange} value={selectedValue}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder} className="capitalize" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label?.[0].toLocaleUpperCase() + option.label?.slice(1)}

            {type === "class" && (
              <span className="text-xs text-gray-500 ml-2.5">
                ({option.courseName})
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DashboardHeader = ({
  isCompare,
  setIsCompare,
}: {
  isCompare: boolean;
  setIsCompare: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();

  const { data: classData, isLoading: classroomDataLoading } = useQuery({
    queryKey: ["getClass", user?.uid],
    queryFn: async () => {
      if (!user?.uid || !user.role) return;
      // const docRef = doc(db, "users", user?.uid);
      // const docSnap = await getDoc(docRef);
      // if (!docSnap.exists()) return;
      // const userData = docSnap.data();
      // if (user.role !== "teacher" || user.role !== "admin") return;
      const classCollection = collection(db, "classes");

      const whereQ =
        user.role === "teacher"
          ? where("teacherId", "==", user?.uid)
          : where("adminId", "==", user?.uid);
      const q = query(classCollection, whereQ);

      const querySnapshot = await getDocs(q);
      const classList = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          className: data.name || "",
          themes: data.themes || [],
          courseName: data.course.name,
        };
      });

      return classList;
    },
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!classData || classData.length === 0) return;

    const defaultClassId = searchParams.get("class") || classData[0].id;
    const defaultThemeId =
      searchParams.get("theme") || classData[0].themes[0]?.id;

    const params = new URLSearchParams(window.location.search);
    if (!searchParams.get("class")) params.set("class", defaultClassId);
    if (!searchParams.get("theme")) params.set("theme", defaultThemeId);
    router.replace(`?${params.toString()}`);
  }, [classData, searchParams, router]);

  if (classroomDataLoading) return <div>Loading...</div>;

  if (!classData || classData.length === 0) return <div>No data found</div>;

  const classList = classData.map((classItem) => ({
    value: classItem.id,
    label: classItem.className,
    courseName: classItem.courseName,
  }));

  const themeList =
    classData
      .find((cls) => cls.id === searchParams.get("class"))
      ?.themes.map((theme: any) => ({
        value: theme.id,
        label: theme.name,
      })) || [];

  return (
    <div className="flex flex-col space-y-4 w-full sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-5 max-w-md mx-auto lg:max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {user?.role === "teacher" && (
          <h1 className="text-xl sm:text-2xl font-semibold">Dashboard of</h1>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-3  gap-1.5">
          <DashboardSelect
            placeholder="Select Class"
            options={classList}
            searchParamsKey="class"
            type="class"
          />
          <DashboardSelect
            placeholder="Select Theme"
            options={themeList}
            searchParamsKey="theme"
            type="theme"
          />
        </div>
      </div>

      {/* {user?.role === "teacher" && (
        <div className="flex items-center space-x-2">
          <Label htmlFor="compare" className="text-sm sm:text-base">
            Compare
          </Label>
          <Switch
            id="compare"
            checked={isCompare}
            onCheckedChange={setIsCompare}
          />
        </div>
      )} */}
    </div>
  );
};

export default DashboardHeader;
