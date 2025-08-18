import React from "react";

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        {/* Loading Text */}
        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Preloader;

// import React from "react";

// const Preloader = () => {
//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
//       <div className="flex flex-col items-center gap-4">
//         {/* Bouncing Balls Animation */}
//         <div className="flex gap-2">
//           <div className="h-5 w-5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
//           <div className="h-5 w-5 bg-green-500 rounded-full animate-bounce delay-200"></div>
//           <div className="h-5 w-5 bg-yellow-500 rounded-full animate-bounce delay-300"></div>
//         </div>
//         {/* Loading Text */}
//         <p className="text-blue-500 text-lg font-semibold">Loading...</p>
//       </div>
//     </div>
//   );
// };

// export default Preloader;
