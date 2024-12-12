"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { classroomFormSchema } from "@/schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export default function ClassroomForm({ form }: { form: UseFormReturn<z.infer<typeof classroomFormSchema>> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <FormField
        control={form.control}
        name="className"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Class Name" {...field} />
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
            <FormControl>
              <Input {...field} placeholder="Select grade" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teacherName"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Teacher</FormLabel>
            <FormControl>
              <Input placeholder="Select teacher name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="coTeacherName"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Co-Teacher</FormLabel>
            <FormControl>
              <Input placeholder="Select co-teacher name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <Label>Choose Class Badge</Label>
      <ProfilePicker onSelect={handleSelect} /> */}
    </div>
  );
}
