import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const CourseCompletionCard = () => {
  return (
    <Card className="relative bg-[#F92E2E] text-white max-w-md mx-auto lg:mx-0 lg:max-w-sm rounded-2xl">
      <CardHeader className="flex flex-col items-center">
        <div className="absolute top-0 left-0 rounded-t-3xl rounded-b-full bg-white/20 h-44 w-full" />
        <CardTitle className="text-center">Last Played</CardTitle>
        <Image
          height={150}
          width={150}
          src="/course/profile.png"
          alt="profile image"
        />
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="font-semibold text-base sm:text-lg">
          Building Blocks of Robotics
        </p>
        <span className="text-lg">Level 2</span>
      </CardContent>
      <CardFooter className="w-full flex justify-center">
        <Button className="w-full font-semibold text-xl">Continue</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCompletionCard;
