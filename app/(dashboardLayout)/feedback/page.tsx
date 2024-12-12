/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import FeedbackTable from "@/components/apps/dashboard/FeedbackTable";
import FeedbackDialog from "@/components/apps/feedback/FeedbackDialog";
import { AppLayout, ProtectedRoute } from "@/components/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { ClassData, FeedbackData } from "@/schema";
import { getClasses, getFeedbacks } from "@/services/dashboard/feedback-service";
import { useEffect, useState } from "react";

const FeedbackPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [classList, setClassList] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("All");

  const { user } = useAuth();

  const addFeedback = () => {
    setIsModalOpen(true);
  };

  const getAllClass = async () => {
    const classList: ClassData[] = await getClasses(user?.uid);
    setClassList(classList);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user?.role == "teacher" && user.uid) {
      unsubscribe = getFeedbacks(setFeedbacks, user?.uid);
    }
    getAllClass();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedClass && selectedClass != "All") {
      const selectedClassObj = classList.find((classItem) => classItem.id === selectedClass);

      if (selectedClassObj && selectedClassObj.students) {
        const studentUids = selectedClassObj.students.map((student) => student.uid);

        setFeedbacks((feedbacks) => feedbacks.filter((feedback) => studentUids.includes(feedback.studentId)));
      }
    } else {
      let unsubscribe: (() => void) | undefined;
      if (user?.role == "teacher" && user.uid) {
        unsubscribe = getFeedbacks(setFeedbacks, user?.uid);
      }
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [selectedClass, classList]);

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <AppLayout
        appLayoutHeading="Feedback of"
        btnAction={addFeedback}
        btnText="Get Feedback"
        showButton={user?.role == "teacher"}
        extraElement={
          <Select
            onValueChange={(value) => {
              if (value == "All") {
                setSelectedClass("All");
                return;
              }
              const selectedClass = classList.find((classItem) => classItem.id === value);
              if (selectedClass) {
                setSelectedClass(selectedClass.id);
              }
            }}
            value={selectedClass === "All" ? "All" : selectedClass}
          >
            <SelectTrigger id="class" className="w-[200px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {classList.map((classList: ClassData) => (
                <SelectItem key={classList.id} value={classList.id}>
                  {classList.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <FeedbackTable feedbacks={feedbacks} />
        <FeedbackDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default FeedbackPage;
