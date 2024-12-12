"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { teacherSchema } from "@/schema";

export default function TeacherForm({ form }: { form: UseFormReturn<z.infer<typeof teacherSchema>> }) {
  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Teacher Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teacher ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter Teacher ID" />
            </FormControl>
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
    </div>
  );
}
