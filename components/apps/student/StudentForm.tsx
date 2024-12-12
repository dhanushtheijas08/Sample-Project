"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { studentSchema } from "@/schema";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getCourseAndGrade } from "@/api/common/getCourseAndGrade";

type CourseAndGradeType = {
  courses: { id: string; name: string }[];
  gradeAndSections: { name: string; createdAt: string; id: string }[];
};

export default function StudentForm({ form }: { form: UseFormReturn<z.infer<typeof studentSchema>> }) {
  const { user } = useAuth();

  const { data: courseAndGradeData, isLoading: courseAndGradeLoading } = useQuery<
    CourseAndGradeType | null | undefined
  >({
    queryKey: ["CourseAndGrade", user?.uid],
    queryFn: () => getCourseAndGrade(user?.uid as string),
    enabled: !!user?.uid,
  });
  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Student Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="studentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter Student ID" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gradeAndSection.id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade/Section</FormLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                const fieldName = courseAndGradeData?.gradeAndSections?.find((grade) => grade.id === val)?.name;
                form.setValue("gradeAndSection.name", fieldName);
                field.onChange(val);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {courseAndGradeLoading ? (
                  <p>Loading...</p>
                ) : (
                  courseAndGradeData &&
                  courseAndGradeData.gradeAndSections &&
                  courseAndGradeData.gradeAndSections.map((gradeAndSection) => (
                    <SelectItem key={gradeAndSection.name} value={gradeAndSection.id}>
                      {gradeAndSection.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter Email ID" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter Phone Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <ProfilePicker profiles={studentProfile} onSelect={onProfileSelect} /> */}
    </div>
  );
}
