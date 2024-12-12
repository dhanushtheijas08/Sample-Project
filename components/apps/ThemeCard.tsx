// import { calculateProgress } from "@/lib/utils";
// import Image from "next/image";

// type ThemeCardProps = {
//   cardLabel: string;
//   isCardLocked?: boolean;
//   totalLevel?: number;
//   totalLevelCompleted?: number;
// };
// const ThemeCard = ({
//   cardLabel,
//   isCardLocked = false,
//   totalLevel,
//   totalLevelCompleted,
// }: ThemeCardProps) => {
//   return (
//     <div className="rounded-[24px] overflow-hidden w-64 bg-gradient-to-b relative">
//       <div className="relative">
//         <Image
//           src={isCardLocked ? "/theme-lock-img.png" : "/theme-img.png"}
//           height={300}
//           width={300}
//           alt="theme image"
//           className="object-cover"
//         />
//       </div>
//       <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-lg font-semibold">
//         {cardLabel}
//       </h2>
//       {isCardLocked ? (
//         <Image
//           src="/lock-img.png"
//           width={75}
//           height={75}
//           alt="Locked"
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//         />
//       ) : (
//         <>
//           <div className="flex flex-col gap-1 absolute top-12 left-4 w-full">
//             <div className="text-gray-300 text-sm">
//               {totalLevelCompleted} / {totalLevel} Levels
//             </div>
//             <div className="w-[90%]">
//               <div className="h-1.5 bg-white rounded-full">
//                 <div
//                   className="h-full bg-[#3A65FF]  rounded-full"
//                   style={{
//                     width: `${calculateProgress(
//                       totalLevel!,
//                       totalLevelCompleted!
//                     )}%`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
// export default ThemeCard;
const ThemeCard = () => {
  return <div>ThemeCard</div>;
};

export default ThemeCard;
