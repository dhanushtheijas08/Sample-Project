// // import { Avatar, Card, CardContent, CardHeader, Button, Progress } from 'shadcn/ui';
// import {Card,CardContent, CardHeader} from "@/components/ui/card";
// import {Button} from "@/components/ui/button";
// // import {Progress} from "@/components/ui/progress";
// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
//   } from "@/components/ui/avatar";

// import { ChevronsRightIcon } from 'lucide-react'; // For the arrow icon

// export function CourseCard() {
//   return (
//     <Card className="w-80 rounded-lg shadow-md" style={{ boxShadow: '0px 4px 26px 0px #B6B6B640',border:'none' }}>
//       {/* Header with avatar and colorful background */}
//       <CardHeader className="relative p-0">
//         <div className="bg-cover bg-center h-24 rounded-t-lg" style={{ backgroundImage: `url('/robot.png')`  }}></div>
//         {/* <div className="absolute" style={{top:'-43',left:'-31'}}>
//         <Avatar>
//       <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//       <AvatarFallback>CN</AvatarFallback>
//     </Avatar>
//         </div> */}
//         <div className="absolute" style={{ top: '-43px', left: '-31px' }}>
//   <Avatar style={{ width: '100px', height: '100px' }}>
//     <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//     <AvatarFallback>CN</AvatarFallback>
//   </Avatar>
// </div>

//       </CardHeader>

//       {/* Card Content */}
//       <CardContent className="p-4 space-y-3">
//         {/* Course title and description */}
//         {/* <h3 className="text-lg font-semibold">Robotics for Juniors</h3> */}
//         <h3
//   className="text-lg font-black text-black"
//   style={{
//     fontFamily: 'Poppins, sans-serif',
//     fontSize: '18px',
//     fontWeight: 800,
//     lineHeight: '23.43px',
//     textAlign: 'left'
//   }}
// >
//   Robotics for Juniors
// </h3>
//     <p className="text-sm text-gray-600" style={{
//     fontFamily: 'Poppins, sans-serif',
//     lineHeight: '24px',
//     padding:'10px'
//   }}>
//           This course provides an introduction to the fundamental concepts of robotics, blending theory with hands-on practice. Students will explore key areas such as robot kinematics, dynamics, sensors, and control systems.
//         </p>

//         {/* Grade level button */}
//         {/* <Button size="sm" className="text-xs">
//           6th B
//         </Button> */}

//         <div className="flex justify-between items-center mt-4">
//          {/* <Button className="text-sm font-semibold py-1 px-7 rounded-full">6th B</Button> */}
//          <Button className="text-sm  text-black  py-1 px-7 rounded-full" style={{ backgroundColor: '#DFE5FF' }}>6th B</Button>

//           {/* <ArrowRightIcon className="text-black" /> */}
//            <button className=" text-white rounded-full p-2" style={{ backgroundColor: '#2A2F6E' }}>
//            <ChevronsRightIcon />
//             </button>
//         </div>

//         {/* Progress bar */}
//         {/* <div className="flex items-center justify-between">
//           <p className="text-sm">13 Levels / 45%</p>
//         </div>
//         <Progress value={45} className="h-2 rounded-full bg-blue-600" /> */}

//         <div className="mt-4 text-sm text-gray-600">
//             <span>13 Levels / 45%</span>
//             <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
//         </div>
//          </div>
//          <div className="h-1"></div>
//       </CardContent>
//     </Card>
//   );
// }
// import React from 'react';
// import { Button } from "@/components/ui/button"; // Assuming you're using a UI library for the button
// import { Avatar,AvatarImage ,AvatarFallback} from "@/components/ui/avatar"; // Adjust according to your avatar implementation
// import { ArrowRightIcon } from 'lucide-react'; // For the arrow icon
// export const CourseCard: React.FC = () => {
//   return (
//     <div className="w-80 rounded-lg shadow-md border overflow-hidden">
//       {/* Header with avatar and colorful background */}
//       <div className="relative p-0">
//         {/* Accessing background image from public folder */}
//         <div
//           className="bg-cover bg-center h-24"
//           style={{ backgroundImage: `url('/robot.png')` }} // Change the image path accordingly
//         ></div>
//         {/* Avatar */}
//         <div className="absolute top-2 left-2">
//         <Avatar>
//              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//              <AvatarFallback>CN</AvatarFallback>
//          </Avatar>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="p-4">
//         <h3 className="font-bold text-lg">Robotics for Juniors</h3>
//         <p className="text-sm text-gray-600 mt-2">
//           This course provides an introduction to the fundamental concepts of robotics, blending theory with hands-on practice.
//         </p>

//         {/* Class Button */}
//         <div className="flex justify-between items-center mt-4">
//           <Button className="bg-gray-200 text-sm font-semibold py-3 px-4 rounded-full">6th B</Button>
//           <ArrowRightIcon className="text-black" />

//           {/* <button className="bg-black text-white rounded-full p-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 000 2h4a1 1 0 100-2H9z" clipRule="evenodd" />
//             </svg>
//              <ArrowRightIcon className="text-black" />
//           </button> */}
//         </div>

//         {/* Progress Bar */}
//         <div className="mt-4 text-sm text-gray-600">
//           <span>13 Levels / 45%</span>
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//             <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// "use client"
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ChevronsRightIcon } from "lucide-react"; // For the arrow icon

// export function CourseCard() {

//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleToggle = () => {
//     setIsExpanded(!isExpanded);
//   };
//   return (
//     <Card
//       className="w-80 rounded-lg"
//       style={{ boxShadow: "0px 4px 26px 0px #B6B6B640", border: "none",borderRadius:'20px' }}
//     >
//       {/* Header with avatar and colorful background */}
//       <CardHeader className="relative p-0">
//         <div
//           className="bg-cover bg-center h-40 rounded-t-lg "
//           style={{ backgroundImage: `url('/coursebg.png')`,borderTopRightRadius:'20px'}}
//         ></div>

//         {/* Avatar */}
//         <div className="absolute" style={{ top: "-43px", left: "-31px" }}>
//           <Avatar style={{ width: "100px", height: "100px" }}>
//             <AvatarImage src="/profile.png" alt="profile" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//         </div>
//       </CardHeader>

//       {/* Card Content */}
//       <CardContent className="p-4 space-y-3">
//         {/* Course title */}
//         <h3
//           className="text-lg font-black"
//           style={{
//             fontFamily: "Poppins, sans-serif",
//             fontSize: "18px",
//             fontWeight: 800,
//             lineHeight: "23.43px",
//             textAlign: "left",
//             color: "#484C79",
//           }}
//         >
//           Robotics for Juniors
//         </h3>

//         {/* Description with extra margin-bottom */}
//         <p
//           className={`text-sm ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'} `}
//           style={{
//             fontFamily: "Poppins, sans-serif",
//             lineHeight: "24px",
//             color: "#4E4E4E",
//             overflow: 'hidden',
//             transition: 'max-height 0.3s ease',
//             maxHeight: isExpanded ? 'none' : '3.6rem',
//           }}
//         >
//           This course provides an introduction to the fundamental concepts of
//           robotics. Students will explore key areas such as robot kinematics, dynamics,
//           sensors, and control systems, blending theory with hands-on practice.
//           {/* Additional text to demonstrate "Read More" functionality */}
//           Learn how these concepts are applied in real-world scenarios and gain practical
//           skills that can be used in various applications.
//         </p>
//         <button
//           className="text-blue-500 text-sm mt-2"
//           onClick={handleToggle}
//         >
//           {isExpanded ? 'Read Less' : 'Read More'}
//         </button>
//         <div className="h-3"></div>
//         {/* Grade level button and right arrow */}
//         <div className="flex justify-between items-center mt-4">
//           {/* Reduced boldness for "6th B" button */}
//           <Button
//             className="text-sm text-black py-1 px-10 rounded-full"
//             style={{ backgroundColor: "#DFE5FF", fontWeight: 400 }}
//           >
//             6th B
//           </Button>

//           {/* Arrow button */}
//           <button
//             className="text-white rounded-full p-2"
//             style={{ backgroundColor: "#2A2F6E" }}
//           >
//             <ChevronsRightIcon />
//           </button>
//         </div>

//         {/* Progress bar */}
//         <div className="mt-4 text-sm text-gray-600">
//           <span>13 / 45 Levels</span>
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//             <div
//               className="bg-blue-600 h-2 rounded-full"
//               style={{ width: "45%" }}
//             ></div>
//           </div>
//         </div>

//         {/* Extra space at the bottom */}
//         <div className="h-1"></div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsRightIcon } from "lucide-react"; // For the arrow icon
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function CourseCard() {
  // Move isExpanded state inside each card instance
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      className="w-80 rounded-lg"
      style={{
        boxShadow: "0px 4px 26px 0px #B6B6B640",
        border: "none",
        borderRadius: "20px",
      }}
    >
      {/* Header with avatar and colorful background */}

      <CardHeader className="relative p-0">
        <div
          className="bg-cover bg-center h-40 rounded-t-lg"
          style={{
            backgroundImage: `url('/coursebg.png')`,
            borderTopRightRadius: "20px",
          }}
        ></div>

        {/* Avatar */}
        <div className="absolute" style={{ top: "-43px", left: "-31px" }}>
          <Avatar style={{ width: "100px", height: "100px" }}>
            <AvatarImage src="/profile.png" alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      {/* Card Content */}
      <CardContent className="p-4 space-y-3">
        {/* Course title */}
        <h3
          className="text-lg font-black"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "18px",
            fontWeight: 800,
            lineHeight: "23.43px",
            textAlign: "left",
            color: "#484C79",
          }}
        >
          Robotics for Juniors
        </h3>

        {/* Description with expandable text */}
        <p
          className={`text-sm ${
            isExpanded ? "line-clamp-none" : "line-clamp-2"
          } `}
          style={{
            fontFamily: "Poppins, sans-serif",
            lineHeight: "24px",
            color: "#4E4E4E",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
            maxHeight: isExpanded ? "none" : "3.6rem",
          }}
        >
          This course provides an introduction to the fundamental concepts of
          robotics. Students will explore key areas such as robot kinematics,
          dynamics, sensors, and control systems, blending theory with hands-on
          practice. Learn how these concepts are applied in real-world scenarios
          and gain practical skills that can be used in various applications.
        </p>
        <button className="text-blue-500 text-sm" onClick={handleToggle}>
          {isExpanded ? "Read Less" : "Read More"}
        </button>
        <div className="h-3"></div>
        {/* Grade level button and right arrow */}
        <div className="flex justify-between items-center mt-4">
          <Button
            className="text-sm text-black py-1 px-10 rounded-full"
            style={{ backgroundColor: "#DFE5FF", fontWeight: 400 }}
          >
            6th B
          </Button>

          {/* Arrow button */}
          <NextLink href={`${pathname}/id/1 `}>
            <button
              className="text-white rounded-full p-2"
              style={{ backgroundColor: "#2A2F6E" }}
            >
              <ChevronsRightIcon />
            </button>
          </NextLink>
        </div>

        {/* Progress bar */}
        <div className="mt-4 text-sm text-gray-600">
          <span>13 / 45 Levels</span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        </div>

        {/* Extra space at the bottom */}
        <div className="h-1"></div>
      </CardContent>
    </Card>
  );
}
