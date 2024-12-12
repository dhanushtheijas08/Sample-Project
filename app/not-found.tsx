import Link from "next/link";
import { Righteous } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
});

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-2.5">
      <h2 className={`text-9xl ${righteous.className}`}>404</h2>
      <h4 className="text-3xl">Page Not Found</h4>
      <p className="text-xl">Oops! The page you looking for does not exist</p>
      <Button asChild className="h-14 px-8 mt-5">
        <Link href="/">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg">Back to home</span>
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
