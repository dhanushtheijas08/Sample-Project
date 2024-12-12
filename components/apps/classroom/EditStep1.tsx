/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfilePicker from "@/components/common/ProfilePicker";
import { getCourseAndGrade } from "@/api/common/getCourseAndGrade";
import { useAuth } from "@/context/AuthContext";
import { classroomSchema } from "@/schema";
import * as z from "zod";
import { getTeachers } from "@/services/dashboard/teacher-service";
const profiles = [
  "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom-image%2Ficon-1.png?alt=media&token=9775fd76-3d6d-4c6a-b9ff-15d8316a082f",
  "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom-image%2Ficon-2.png?alt=media&token=5ed55354-333f-412a-b0df-9c1251b5a1b3",
  "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom-image%2Ficon-3.png?alt=media&token=c1b31b3a-9e10-4115-985f-dd83cbd28b0e",
  "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom-image%2Ficon-4.png?alt=media&token=0207b487-a30b-48c4-ad50-61ff807d349e",
  "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom-image%2Ficon-5.png?alt=media&token=d4e25e9e-96be-4047-bab3-c2e7f624e3e6",
  "https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom-image%2Ficon-6.png?alt=media&token=fc6d7364-1256-4eff-8918-ab9e53160e34",
];
type FormValues = z.infer<typeof classroomSchema>;

type CourseAndGradeType = {
  courses: { id: string; name: string; image: string }[];
  gradeAndSections: { name: string; createdAt: string; id: string }[];
};

export function EditStep1({
  form,
}: {
  form: UseFormReturn<FormValues, unknown, undefined>;
}) {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedCoTeacher, setSelectedCoTeacher] = useState<string | null>(
    null
  );

  const { user } = useAuth();
  const { data: courseAndGradeData, isLoading: courseAndGradeLoading } =
    useQuery<CourseAndGradeType | null | undefined>({
      queryKey: ["CourseAndGrade", user?.uid],
      queryFn: () => getCourseAndGrade(user?.uid as string),
      enabled: !!user?.uid,
    });

  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ["getTeacher"],
    queryFn: () => getTeachers(user?.uid as string),
  });

  const handleTeacherSelect = (teacher: string) => {
    if (!teachersData) return;

    const teacherObj = teachersData.find((t) => t.teacherEmail === teacher);

    if (!teacherObj) {
      console.warn("No teacher object found for selected email.");
      return;
    }

    form.setValue("teacherUid", teacherObj.id);
    form.setValue("teacherId", teacherObj.teacherId);
    form.setValue("teacherProfileImg", teacherObj.teacherProfileImg || "");
    form.setValue("teacherName", teacherObj.teacherName);

    setSelectedTeacher(teacher);

    if (teacher === selectedCoTeacher) {
      setSelectedCoTeacher(null);
    }
  };

  const handleCoTeacherSelect = (coTeacher: string) => {
    if (!teachersData) return;

    const coTeacherObj = teachersData.find((t) => t.teacherEmail === coTeacher);

    if (!coTeacherObj) {
      console.warn("No co-teacher object found for selected email.");
      return;
    }

    form.setValue("coTeacherId", coTeacherObj.teacherId);
    form.setValue("coTeacherUid", coTeacherObj.id);
    form.setValue("coTeacherProfileImg", coTeacherObj.teacherProfileImg);
    form.setValue("coTeacherName", coTeacherObj.teacherName);
    setSelectedCoTeacher(coTeacher);
  };

  const handleGradeAndSectionSelect = (gradeAndSectionId: string) => {
    if (!courseAndGradeData) return;

    const selectedGrade = courseAndGradeData.gradeAndSections.find(
      (grade) => grade.id === gradeAndSectionId
    );

    form.setValue("gradeAndSectionName", selectedGrade?.name || "");
    form.setValue("gradeAndSectionId", selectedGrade?.id || "");
  };
  const filteredCoTeachers =
    teachersData?.filter(
      (teacher: any) => teacher.teacherEmail !== selectedTeacher
    ) || [];

  const handleSelectProfile = (profile: string) => {
    form.setValue("classProfileImg", profile);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="className"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Class Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {courseAndGradeData?.gradeAndSections &&
      courseAndGradeData?.gradeAndSections.length !== 0 ? (
        <FormField
          control={form.control}
          name="gradeAndSectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade/Section</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  handleGradeAndSectionSelect(val);
                }}
                defaultValue={field.value}
                value={field.value}
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
                    courseAndGradeData.gradeAndSections.map(
                      (gradeAndSection) => (
                        <SelectItem
                          key={gradeAndSection.name}
                          value={gradeAndSection.id}
                        >
                          {gradeAndSection.name}
                        </SelectItem>
                      )
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="gradeAndSectionId"
          render={() => (
            <FormItem>
              <FormLabel>Grade/Section</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="No Grade/Section found" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="No Grade/Section found">
                    No Grade/Section found
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="teacherEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teacher</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleTeacherSelect(value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {teachersLoading ? (
                  <p>Loading...</p>
                ) : (
                  teachersData?.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.teacherEmail}>
                      {teacher.teacherName}{" "}
                      <span className="text-[0.7rem]">
                        ({teacher.teacherEmail} )
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {courseAndGradeData?.courses &&
      courseAndGradeData?.courses.length !== 0 ? (
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  const selectedCourse = courseAndGradeData?.courses.find(
                    (course) => course.id === val
                  );
                  form.setValue("courseName", selectedCourse?.name || "");
                  form.setValue("courseImage", selectedCourse?.image || "");
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseAndGradeLoading ? (
                    <p>Loading...</p>
                  ) : (
                    courseAndGradeData &&
                    courseAndGradeData.courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="course"
          render={() => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="No course found" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="No course found">
                    No course found
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="coTeacherEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Co-Teacher</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleCoTeacherSelect(value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select co-teacher" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {teachersLoading ? (
                  <p>Loading...</p>
                ) : (
                  filteredCoTeachers.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.teacherEmail}>
                      {teacher.teacherName}{" "}
                      <span className="text-[0.7rem]">
                        ({teacher.teacherEmail} )
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <ProfilePicker profiles={profiles} onSelect={handleSelectProfile} />
    </div>
  );
}
