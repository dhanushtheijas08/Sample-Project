import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { purchaseSchema } from "@/schema";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getInstitutes } from "@/api/purchase/getInstitutes";
import { getCourses } from "@/api/purchase/getCourses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Institute = {
  instituteName: string;
  instituteProfileImg: string;
  userCreatedAt: string;
  id: string;
};

export default function PurchaseForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof purchaseSchema>>;
}) {
  const { isLoading: isInstitutesLoading, data: instituteList } = useQuery({
    queryKey: ["getInstitutes"],
    queryFn: getInstitutes,
  });

  const { isLoading: isCoursesLoading, data: courseList } = useQuery({
    queryKey: ["getCourses"],
    queryFn: getCourses,
  });
  console.log(courseList);

  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <FormField
        control={form.control}
        name="institute"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institute</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  const selectedInstitute = instituteList?.find(
                    (inst) => inst.id === value
                  );
                  field.onChange({
                    id: selectedInstitute?.id,
                    name: selectedInstitute?.instituteName,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Institute" />
                </SelectTrigger>
                <SelectContent>
                  {isInstitutesLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    instituteList?.map((institute: Institute) => (
                      <SelectItem key={institute.id} value={institute.id}>
                        {institute.instituteName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="course"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  const selectedCourse = courseList?.find(
                    (course) => course.id === value
                  );
                  field.onChange({
                    id: selectedCourse?.id || "",
                    name: selectedCourse?.courseTitle || "",
                    image: selectedCourse?.courseProfileImg[0] || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {isCoursesLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    courseList?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseTitle}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plan</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Count</FormLabel>
            <FormControl>
              <Input
                placeholder="No of License"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
