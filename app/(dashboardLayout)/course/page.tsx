"use client";

import { CourseCard } from "@/components/apps/LearningCard";
import { ProtectedRoute } from "@/components/common/index";
import { Input } from "@/components/ui/input";
import { Courses } from "@/schema";
import { getCourses } from "@/services/dashboard/course-service";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CoursePage = () => {
  const [courses, setCourses] = useState<Courses[]>([]);

  useEffect(() => {
    const unsubscribe = getCourses((coursesList) => {
      console.log(coursesList);

      setCourses(coursesList);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <ProtectedRoute allowedRoles={["superadmin", "admin", "teacher"]}>
      <div className="absolute top-0 inset-x-0 h-52 bg-blue-500 "></div>
      <div className="relative">
        <div className="max-w-6xl mx-auto mb-14">
          <h1 className="text-4xl font-bold text-center mb-2 text-primary-foreground">
            Wefaa Robotics
          </h1>
          <p className="text-xl text-center mb-8 text-primary-foreground">
            Courses we offer
          </p>
          <div className="relative mb-20 max-w-2xl mx-auto">
            <Input
              className="w-full pl-4 pr-10 py-2 h-12 rounded-md"
              placeholder="Discover Next Course Adventure For Students"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course: Courses) => (
              <Link href={`course/${course.id}`} key={course?.id}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CoursePage;
