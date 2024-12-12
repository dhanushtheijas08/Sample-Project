/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ProtectedRoute } from "@/components/common/index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Courses } from "@/schema";
import { getCourseById } from "@/services/dashboard/course-service";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player/youtube";
import { Modal } from "@/components/common/Modal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const updateLocalStorage = (key: string, newValue: any) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
  }
  localStorage.setItem(key, JSON.stringify(newValue));
};
const CourseById = () => {
  const [course, setCourse] = useState<Courses>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const { user } = useAuth();
  const pathname = usePathname();

  const courseId = pathname.split("/").pop();

  const levelsCount = () => {
    let count = 0;
    course?.themes?.forEach((theme) => {
      theme?.levels?.forEach((level) => {
        if (level.type != "level") {
          return;
        }
        count++;
      });
    });
    return count;
  };

  useEffect(() => {
    getCourseById(courseId!, setCourse);
  }, []);

  const openVideoModal = (url: string) => {
    setVideoUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVideoUrl(null);
  };

  return (
    <ProtectedRoute allowedRoles={["superadmin", "admin", "teacher"]}>
      <div className="p-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold ">{course?.title}</h1>
          {user?.role === "teacher" && <Button>View Guide</Button>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl">
          <Card className="border-none shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                No of themes <span className="mx-1"></span>
                {course?.themes?.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                No of levels <span className="mx-1"></span>
                {levelsCount()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Overview</h2>

        <div className="flex mb-6">
          <div className="w-1/2">
            {course?.image ? (
              <Carousel
                className="w-full"
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
              >
                <CarouselContent>
                  {Array.isArray(course?.image) &&
                    course.image.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          src={image}
                          alt={`Course image ${index + 1}`}
                          width={500}
                          height={300}
                          className="rounded-lg w-full shadow"
                        />
                      </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <Card className="aspect-video bg-muted"></Card>
            )}
            <Card className="max-w-2xl mt-6 mb-6 shadow border-none">
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{course?.description}</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="w-1/2 ml-6 shadow rounded-lg bg-white p-6 h-fit pt-4">
            <Accordion type="single" collapsible className="w-full">
              {course?.themes.map((theme) => (
                <AccordionItem value={`${theme?.id}`} key={theme?.id}>
                  <AccordionTrigger>{theme?.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto mt-4 scrollbar-none p-0">
                      <div className="opacity-70 pb-4">
                        {theme?.description}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {theme?.levels?.map((level) => (
                          <div
                            className="text-center flex flex-col items-center p-2"
                            key={level.id}
                          >
                            {level?.type == "video" ? (
                              <div
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => openVideoModal(level?.url ?? "")}
                              >
                                <Image
                                  src={
                                    level.name.startsWith("Coding")
                                      ? "/course/coding-tutorial-video.png"
                                      : "/course/play-button.png"
                                  }
                                  alt="Play video"
                                  width={50}
                                  height={50}
                                  className="rounded-lg"
                                />
                                <p className="mt-2 text-sm min-w-[110px] max-w-full">
                                  {level.name}
                                </p>
                              </div>
                            ) : (
                              <div
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => {
                                  updateLocalStorage("level", level);
                                  window.open(
                                    `${process.env.NEXT_PUBLIC_HOSTURL}/game-play`,
                                    "_blank"
                                  );
                                }}
                              >
                                <Image
                                  src="/course/student-not-opened.png"
                                  alt=""
                                  width={50}
                                  height={50}
                                  className="rounded-lg"
                                />
                                <p className="mt-2 text-sm min-w-[110px] max-w-full">
                                  {level.name}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {isModalOpen && videoUrl && (
          <Modal onClose={closeModal}>
            <ReactPlayer
              url={videoUrl}
              controls
              playing
              width="100%"
              height="100%"
              style={{ borderRadius: "20px" }}
            />
          </Modal>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CourseById;
