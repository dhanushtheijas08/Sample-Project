"use client";
import React from "react";
import Lottie from "lottie-react";
import roboanimationData from "../../public/lottie-robot-animation.json";

// export default function LottieAnimation() {
//   return <Lottie animationData={animationData} loop={true} />;
// }

export function LottieRobotAnimation() {
  return (
    <Lottie
      animationData={roboanimationData}
      loop={true}
      className="max-w-sm"
    />
  );
}
