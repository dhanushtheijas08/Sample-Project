import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { ClassData, feedbackSchema, StudentData } from "@/schema";
import { addFeedback, getClasses } from "@/services/dashboard/feedback-service";
import React, { useEffect, useState } from "react";

interface FeedbackDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [classList, setClassList] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [errors, setErrors] = useState<{ class?: string; student?: string; topic?: string }>({});

  const { user } = useAuth();

  const handleSubmit = async () => {
    const result = feedbackSchema.safeParse({
      student: selectedStudent,
      topic,
      class: selectedClass,
    });

    if (!result.success) {
      const fieldErrors: { class?: string; student?: string; topic?: string } = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0] as keyof typeof fieldErrors] = error.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});

      setIsModalOpen(false);

      const feedbackData = {
        teacherId: user?.uid as string,
        studentId: selectedStudent,
        studentName: students.find((s) => s?.uid === selectedStudent)?.name,
        status: "Open",
        chats: [],
        topic,
        createdAt: new Date().toISOString(),
      };

      try {
        await addFeedback(feedbackData);
      } catch (error) {
        console.error(error);
      } finally {
        setSelectedStudent("");
        setTopic("");
        setIsModalOpen(false);
      }
    }
  };

  const getAllClass = async () => {
    const classList: ClassData[] = await getClasses(user?.uid);
    setClassList(classList);
  };

  useEffect(() => {
    getAllClass();
  }, []);

  useEffect(() => {
    setSelectedClass("");
    setSelectedStudent("");
    setTopic("");
    setErrors({});
  }, [isModalOpen, setIsModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Feedback</DialogTitle>
          <DialogDescription>Enter Student name and Topic to start Conversation</DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="class" className="text-lg">
            Class
          </Label>
          <Select
            onValueChange={(value) => {
              const selectedClass = classList.find((classItem) => classItem.id === value);
              if (selectedClass) {
                setStudents(selectedClass.students || []);
                setSelectedClass(selectedClass.name);
              }
            }}
          >
            <SelectTrigger id="class">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classList.map((classList: ClassData) => (
                <SelectItem key={classList.id} value={classList.id}>
                  {classList.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class && <p className="text-red-600 text-sm">{errors.class}</p>}
          <Label htmlFor="student" className="text-lg mt-4">
            Student
          </Label>
          <Select
            onValueChange={(value) => {
              setSelectedStudent(value);
            }}
            value={selectedStudent}
          >
            <SelectTrigger id="student">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.uid} value={student.uid!}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.student && <p className="text-red-600 text-sm">{errors.student}</p>}

          <Label htmlFor="topic" className="text-lg mt-4">
            Topic
          </Label>
          <Input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          {errors.topic && <p className="text-red-600 text-sm">{errors.topic}</p>}

          <Button id="submit" className="mt-2.5 justify-self-end" size="lg" onClick={handleSubmit}>
            Get Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
