"use client";

import Image from "next/image";

const UnderConstruction = () => {
  return (
    <div className="flex flex-col h-[70vh] justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-700 mb-4">
        🚧 Under Construction 🚧
      </h1>
      <p className="text-lg text-gray-500">
        We are working hard to bring you this page soon.
      </p>
      <p className="text-lg text-gray-500">Check back later!</p>

      <Image
        src="underconstruction.svg"
        alt="Under Construction"
        width={180}
        height={180}
      />
    </div>
  );
};

export default UnderConstruction;
