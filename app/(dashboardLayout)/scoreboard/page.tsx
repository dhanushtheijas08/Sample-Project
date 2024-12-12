/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo } from "react";
import { columns } from "@/components/apps/scoreboard-table/column";
import { DataTable } from "@/components/apps/scoreboard-table/data-table";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/common/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { LottieRobotAnimation } from "@/components/common/LottieAnimation";
import { getClassroomByRole } from "@/services/dashboard/classroom-service";

interface Level {
  id: string;
  type: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
  levels?: Level[];
}

interface Course {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  students: any[];
  themes: Theme[];
  studentIds: string[];
  course: Course;
}

const ScoreboardPage = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("timeTaken");
  const [sortOrder, setSortOrder] = useState<string>("ascending");
  const [rawStudentsData, setRawStudentsData] = useState<any[] | undefined>(
    undefined
  );
  const [sortedStudentsData, setSortedStudentsData] = useState<
    any[] | undefined
  >(undefined);
  const [filterBy, setFilterBy] = useState<string>("class");

  const { user } = useAuth();

  const { data: classData } = useQuery<any | Error | undefined>({
    queryKey: ["getScoreboard"],
    queryFn: () => getClassroomByRole({ userUid: user?.uid as string }),
  });

  // Use useMemo for courses array
  const courses = useMemo(() => {
    if (!Array.isArray(classData)) return [];
    const courseMap = new Map<string, Course>();
    classData.forEach((item) => {
      if (item.course && item.course.id) {
        courseMap.set(item.course.id, item.course);
      }
    });
    return Array.from(courseMap.values());
  }, [classData]);

  // Use useMemo for classesForCourse
  const classesForCourse = useMemo(() => {
    if (!Array.isArray(classData)) return [];
    return classData.filter((c) => c.course.id === selectedCourse);
  }, [classData, selectedCourse]);

  // Initial course selection
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id);
    }
  }, [courses, selectedCourse]);

  // Handle class selection when course changes
  useEffect(() => {
    if (filterBy === "class" && classesForCourse.length > 0) {
      setSelectedClass(classesForCourse[0].id);
    }
  }, [selectedCourse, classesForCourse, filterBy]);

  // Theme selection when class changes
  useEffect(() => {
    if (selectedClass && Array.isArray(classData)) {
      const selectedClassData = classData.find(
        (c: ClassData) => c.id === selectedClass
      );

      if (selectedClassData?.themes && selectedClassData.themes.length > 0) {
        setSelectedTheme(selectedClassData.themes[0].id);
      }
    }
  }, [selectedClass, classData]);

  // Level selection when theme changes
  useEffect(() => {
    if (selectedTheme && Array.isArray(classData)) {
      const selectedClassData = classData.find(
        (c: ClassData) => c.id === selectedClass
      );

      const selectedThemeData = selectedClassData?.themes.find(
        (t: Theme) => t.id === selectedTheme
      );

      const levelsOfTypeLevel = selectedThemeData?.levels?.filter(
        (level: Level) => level.type === "level"
      );

      if (levelsOfTypeLevel && levelsOfTypeLevel.length > 0) {
        setSelectedLevel(levelsOfTypeLevel[0].id);
      }
    }
  }, [selectedTheme, classData, selectedClass]);

  const fetchStudentsData = async () => {
    if (!user?.uid) return;
    const usersCollection = collection(db, "users");
    const usersDoc = doc(usersCollection, user?.uid);
    const userData = await getDoc(usersDoc);
    const userDataObj = userData.data();
    if (userDataObj === undefined) return;

    const bestSubmissionsCollection = collection(db, "bestSubmissions");
    let q;

    if (filterBy === "institute") {
      q = query(
        bestSubmissionsCollection,
        where("instituteId", "==", userDataObj.adminId || user?.uid),
        where("levelId", "==", selectedLevel)
      );
    } else {
      q = query(
        bestSubmissionsCollection,
        where("classId", "==", selectedClass),
        where("levelId", "==", selectedLevel)
      );
    }

    const querySnapshot = await getDocs(q);
    const studentList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const { themes, gameFiles, ...rest } = data;
      return rest;
    });

    setRawStudentsData(studentList);
  };

  useEffect(() => {
    if (
      ((filterBy === "class" && selectedClass) || filterBy === "institute") &&
      selectedTheme &&
      selectedLevel
    ) {
      fetchStudentsData();
    }
  }, [selectedClass, selectedTheme, selectedLevel, filterBy]);

  useEffect(() => {
    if (!rawStudentsData) return;

    const sortData = () => {
      const sorted = [...rawStudentsData].sort((a: any, b: any) => {
        let valueA, valueB;

        if (sortBy === "name") {
          valueA = a.userInfo?.name?.toLowerCase() || "";
          valueB = b.userInfo?.name?.toLowerCase() || "";
        } else {
          valueA = a[sortBy];
          valueB = b[sortBy];
        }

        if (valueA === undefined || valueA === null)
          return sortOrder === "ascending" ? -1 : 1;
        if (valueB === undefined || valueB === null)
          return sortOrder === "ascending" ? 1 : -1;

        if (sortOrder === "ascending") {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      });

      setSortedStudentsData(sorted);
    };

    sortData();
  }, [rawStudentsData, sortBy, sortOrder]);

  const activeThemes = useMemo(() => {
    if (!Array.isArray(classData)) return [];

    if (filterBy === "institute") {
      // Aggregate themes across all classes for the selected course
      const instituteThemes = new Map<string, Theme>();
      classData
        .filter((classItem) => classItem.course.id === selectedCourse)
        .forEach((classItem) => {
          classItem.themes?.forEach((theme: any) => {
            if (!instituteThemes.has(theme.id)) {
              instituteThemes.set(theme.id, theme);
            }
          });
        });
      return Array.from(instituteThemes.values());
    } else {
      const selectedClassData = classData.find(
        (classItem: ClassData) =>
          selectedClass === classItem.id && classItem.themes
      );
      return selectedClassData?.themes || [];
    }
  }, [classData, selectedClass, filterBy, selectedCourse]);

  const activeLevels = useMemo(() => {
    if (!Array.isArray(activeThemes)) return [];

    const selectedThemeData = activeThemes.find(
      (theme: Theme) => selectedTheme === theme.id
    );

    if (filterBy === "institute") {
      // Combine levels for the selected theme across all related classes
      const instituteLevels = new Map<string, Level>();

      classData // Check if classData is defined
        ?.filter((classItem: any) => classItem.course.id === selectedCourse)
        .forEach((classItem: any) => {
          const theme = classItem.themes?.find(
            (t: any) => t.id === selectedTheme
          );
          theme?.levels?.forEach((level: any) => {
            if (level.type === "level" && !instituteLevels.has(level.id)) {
              instituteLevels.set(level.id, level);
            }
          });
        });

      return Array.from(instituteLevels.values());
    } else {
      return (
        selectedThemeData?.levels?.filter(
          (level: any) => level.type === "level"
        ) || []
      );
    }
  }, [activeThemes, selectedTheme, classData, filterBy, selectedCourse]);

  const handleScopeChange = (value: string) => {
    if (value === "institute") {
      setFilterBy("institute");
      setSelectedClass("");
    } else {
      setFilterBy("class");
      setSelectedClass(value);
    }
  };
  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <div className="flex flex-col">
        <div className="flex items-center gap-5">
          <div className="flex flex-col justify-between w-full">
            <div className="w-fit"></div>
            <div className="flex flex-row gap-2 items-center">
              <h2 className="text-xl">Scoreboard of </h2>

              {/* Course Selection */}
              <div className="flex flex-col ml-6">
                <Label className="mb-1.5 opacity-60 text-[12px]">Course</Label>
                <Select
                  onValueChange={(val) => setSelectedCourse(val)}
                  value={selectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Selection */}
              <div className="flex flex-col ml-6">
                <Label className="mb-1.5 opacity-60 text-[12px]">Theme</Label>
                <Select
                  onValueChange={(val) => setSelectedTheme(val)}
                  value={selectedTheme}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeThemes.map((theme: Theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Selection */}
              <div className="flex flex-col ml-6">
                <Label className="mb-1.5 opacity-60 text-[12px]">Level</Label>
                <Select
                  onValueChange={(val) => setSelectedLevel(val)}
                  value={selectedLevel}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeLevels
                      .filter((level: Level) => level.type === "level")
                      .map((level: Level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scope Selection */}
              <div className="flex flex-col ml-6">
                <Label className="mb-1.5 opacity-60 text-[12px]">Scope</Label>
                <Select
                  onValueChange={handleScopeChange}
                  value={filterBy === "institute" ? "institute" : selectedClass}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesForCourse.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="institute">All Institute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sorting Options */}
            <div className="flex items-center gap-1.5 mt-8 justify-end">
              <h2 className="mb-1.5">Sort By</h2>
              <Select onValueChange={(val) => setSortBy(val)} value={sortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="submissionTime">
                    Submission Time
                  </SelectItem>
                  <SelectItem value="grade">Grade</SelectItem>
                  <SelectItem value="timeTaken">Time Taken</SelectItem>
                  <SelectItem value="sessionTime">Session Time</SelectItem>
                  <SelectItem value="attempts">Attempts</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(val) => setSortOrder(val)}
                value={sortOrder}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascending">Ascending</SelectItem>
                  <SelectItem value="descending">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Data Table or Empty State */}
        {sortedStudentsData !== undefined && sortedStudentsData.length === 0 ? (
          <div className="mt-14 text-center w-full flex flex-col items-center">
            <LottieRobotAnimation />
            <p className="text-lg max-w-md">
              No records found. Please select a different class, theme, or level
              to view the scoreboard data.
            </p>
          </div>
        ) : (
          <div className="mt-5 flex items-center">
            {sortedStudentsData !== undefined && (
              <DataTable columns={columns} data={sortedStudentsData} />
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ScoreboardPage;
