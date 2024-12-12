// import React from 'react';
// import Image from 'next/image';

// export const DoubleCircleBadge = ({ outerCircleColor , innerCircleColor , imageSrc , level ,unlock}) => {
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       position: 'relative',
//       width: '130px',
//       height: '130px'
//     }}>
//       {/* Outer Circle */}
//       <div style={{
//         border: `10px solid ${outerCircleColor}`,  // Outer circle color from props
//         borderRadius: '50%',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         boxShadow: '0px 4px 26px 0px #B6B6B640',
//         zIndex: 1
//       }}></div>

//       {/* Inner Circle */}
//       <div style={{
//         borderRadius: '50%',
//         backgroundColor: innerCircleColor,    // Background color of the inner circle from props
//         position: 'absolute',
//         width: '80%',
//         height: '80%',
//         zIndex: 2,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//          {/* Image inside the inner circle */}
//          <Image
//           src={imageSrc}  // Image source from props
//           alt="Icon"
//           width={50}  // Image width
//           height={50} // Image height
//         />
//      {unlock && (
//           <Image
//             src='/themeimg/lock.png'  // Overlay image source
//             alt="Overlay Icon"
//             width={30}  // Overlay image width
//             height={30} // Overlay image height
//             style={{
//               position: 'absolute', // Position it absolutely
//               top: '30%',
//               left: '38%',
//               zIndex: 3 // Ensure it's above the main image
//             }}
//           />
//         )}
//       </div>

//       {/* Level Count */}
//       <div style={{
//         fontFamily: 'Poppins, sans-serif',
//         position: 'absolute',
//         zIndex: 3,
//         fontSize: '20px',
//         fontWeight: 400,
//         color: '#394160',
//         textAlign: 'center',
//         bottom: '-30px',  // Position text below the circles
//       }}>
//         {level}  {/* Level count from props */}
//       </div>
//     </div>
//   );
// }

const Badges = () => {
  return <div>Badges</div>;
};

export default Badges;
