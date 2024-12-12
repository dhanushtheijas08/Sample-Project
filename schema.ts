/* eslint-disable @typescript-eslint/no-explicit-any */

import { Timestamp } from "firebase/firestore";
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
});

export const classroomSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  gradeAndSectionId: z.string().optional(),
  gradeAndSectionName: z.string().optional(),
  teacherName: z.string().min(1, "Teacher name is required"),
  teacherEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  teacherId: z.string().optional(),
  teacherUid: z.string().optional(),
  teacherProfileImg: z.string().optional(),
  coTeacherName: z.string().optional(),
  coTeacherId: z.string().optional(),
  coTeacherUid: z.string().optional(),
  coTeacherProfileImg: z.string().optional(),
  coTeacherEmail: z.string().optional(),
  classProfileImg: z.string().optional(),

  classBadge: z.string().optional(),
  unlockType: z.enum([
    "manual",
    "sequential",
    "theme-by-theme",
    "all-levels-open",
  ]),
  startsAt: z.date().or(z.string()),
  duration: z.string(),
  course: z.string().min(1, "Course is required"),
  courseName: z.string().min(1, "Course name is required"),
  courseImage: z.string().min(1, "Course image is required"),
});

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone Number is required"),
  password: z.string().optional(),
  image: z.string().optional(),
  gradeAndSection: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  id: z.string().min(1, "Id is required"),
  spoc: z.string().optional(),
});

export type StudentDialogData = {
  name: string;
  email: string;
  phone: string;
  password?: string;
  gradeAndSection?: {
    id?: string;
    name?: string;
  };
  studentId: string; 
  isDeleted: boolean;
};

export const instutionSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 100 characters" })
    .regex(/^[A-Za-z0-9_-]+$/, { message: "Name must contain only alphanumeric characters, dashes, or underscores" }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),

  password: z.string().optional(),
  phone: z
    .string()
    .min(7, { message: "Phone Number must be at least 7 digits" })
    .max(15, { message: "Phone Number must be less than 15 digits" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Phone Number must be number" }),

});

export const teacherSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[A-Za-z0-9_-]+$/, { message: "Name must contain only alphanumeric characters, dashes, or underscores" }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),

  password: z.string().optional(),

  phone: z
    .string()
    .min(7, { message: "Phone Number must be at least 7 digits" })
    .max(15, { message: "Phone Number must be less than 15 digits" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Phone Number must be number" }),

  id: z
    .string()
    .min(1, { message: "Teacher ID is required" })
    .max(50, { message: "Teacher ID must be less than 50 characters" })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "Teacher ID must contain only alphanumeric characters, dashes, or underscores",
    }),
});

export const studentSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[A-Za-z0-9_-]+$/, { message: "Name must contain only alphanumeric characters, dashes, or underscores" }),
  
  gradeAndSection: z.object({
    id: z.string().min(1, { message: "Grade and Section is required" }),
    name: z.string().optional(),
  }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email must be less than 100 characters" }),

  password: z.string().optional(),

  phone: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits" })
    .max(15, { message: "Phone number must be less than 15 digits" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Phone Number must be number" }),


  studentId: z
    .string()
    .min(1, { message: "Student ID is required" })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "Student ID must contain only alphanumeric characters, dashes, or underscores",
    }),
});

// purchase schema, Institute, course, plan and count

export const purchaseSchema = z.object({
  institute: z.object({
    id: z.string().min(1, "Institute ID is required"),
    name: z.string().min(1, "Institute name is required"),
  }),
  course: z.object({
    id: z.string().min(1, "Course ID is required"),
    name: z.string().min(1, "Course name is required"),
    image: z.string().optional(),
  }),
  plan: z.string().min(1, "Plan is required"),
  count: z.coerce
    .number({
      message: "Count must be a number",
    })
    .positive("Count must be greater than zero"),
});

export type InstituteCourseObj = {
  name: string;
  id: string;
  image?: string;
};

export type PurchaseData = {
  institute: InstituteCourseObj;
  course: InstituteCourseObj;
  plan: string;
  count: number;
};

// Ticket schema

export const ticketSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  issue: z.string().min(1, "Issue description is required"),
});

export interface TicketData {
  id?: string;
  userName: string;
  title: string;
  adminId: string;
  description: string;
  chats?: ChatMessage[];
  status: string;
  createdAt?: string;
}

export const classroomFormSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  gradeAndSection: z.object({
    id: z.string().min(1, "Grade and section ID is required"),
    name: z.string().min(1, "Grade and section name is required"),
  }),
  teacherName: z.string().min(1, "Teacher name is required"),
  coTeacherName: z.string().min(1, "Co-Teacher name is required"),
  course: z.string().min(1, "Course is required"),
  courseName: z.string().min(1, "Course name is required"),
  teacherId: z.string().optional(),
  teacherUid: z.string().optional(),
  coTeacherId: z.string().optional(),
  coTeacherUid: z.string().optional(),
});

const step2Schema = z.object({
  students: z
    .array(
      z.object({
        studentName: z.string().min(1, "Student name is required"),
        studentId: z.string().min(1, "Student ID is required"),
        licenseType: z.enum(["Annual", "Monthly"]),
      })
    )
    .min(1, "At least one student must be selected"),
});

const step3Schema = z.object({
  course: z.string().min(1, "Course selection is required"),
  unlockType: z.enum(["Manual", "Automatic"]),
  themeDates: z.record(
    z.array(z.object({ startDate: z.string(), endDate: z.string() }))
  ),
});

export const getValidationSchema = (step: number) => {
  switch (step) {
    case 1:
      return classroomFormSchema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    default:
      return z.object({});
  }
};

// Feedback schema, type

export const feedbackSchema = z.object({
  class: z.string().min(1, "Please select a class"),
  student: z.string().min(1, "Please select a student"),
  topic: z.string().min(1, "Topic is required"),
});

export interface FeedbackData {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  status: "Open" | "Closed";
  chats: ChatMessage[];
  topic: string;
  createdAt: string;
}

// Student type

export interface StudentData {
  email: string;
  grade?: string;
  image?: string;
  name: string;
  password?: string;
  plan?: string;
  studentId?: string;
  uid?: string;
}

export type StudentDataDialog = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  gradeAndSection?: {
    name?: string;
    id?: string;
  };
  password?: string;
  spoc?: string;
};

interface Teacher {
  id: string;
  image: string;
  name: string;
  teacherId: string;
}

export interface TeacherDialogeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  isDeleted: boolean;
}

export interface InstituteDialogData {
  name: string;
  email: string;
  phone: string;
  isDeleted: boolean;
}

interface GameFiles {
  data: string;
  js: string;
  json: string;
  wasm: string;
  id: string;
  image: string;
  name: string;
  unlockAt: string;
}

interface Level {
  gameFiles: GameFiles;
  id: string;
  name: string;
}

interface Theme {
  description: string;
  id: string;
  levels: Level[];
}

interface Course {
  id: string;
  image: string;
  name: string;
  courseId: string;
  duration: string;
}

interface Grade {
  id: string;
  name: string;
  gradeId: string;
}

export interface ClassData {
  id: string;
  adminId: string;
  coTeacherId: string;
  coTeacher: any;
  image: string;
  name: string;
  course: Course;
  grade: Grade;
  isArchived: boolean;
  licenceUsed: null;
  startsAt: string;
  studentIds: string[];
  students: StudentData[];
  teacher: Teacher;
  themes: Theme[];
  unlockType: string;
}

// Chat Message Type

export interface ChatMessage {
  sender: string;
  message: string;
  createdAt: string;
}

// Grade Section

export interface GradeSection {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export const gradeSectionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

// Courses

export interface Courses {
  id: string;
  guide: string;
  title: string;
  description: string;
  themes: Themes[];
  image: string[];
}

export interface Themes {
  name: string;
  description: string;
  id: string;
  levels: Levels[];
}

export interface Levels {
  id: string;
  image: string;
  url?: string;
  name: string;
  played?: boolean;
  type: string;
}
