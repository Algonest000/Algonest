import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaRedo, FaCheck } from "react-icons/fa";

const VerifyEmail = () => {
  const [verified, setVerified] = useState(true);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

//   useEffect(() => {
//     // Simulate API call to check verification status
//     fetch(" http://localhost/AlgonestDigitals/check_verification.php")
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.verified) {
//           setVerified(true);
//         } else {
//           setVerified(false);
//         }
//       })
//       .catch((err) => {
//         setError("Failed to check verification status.");
//       });
//   }, []);

  const handleResendVerification = async () => {
    setResendMessage("");
    setError("");
    try {
      const response = await fetch(
        " https://api.algonestdigitals.com/api/resend_verification.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (data.success) {
        setResendMessage("Verification email sent successfully.");
      } else {
        setError(data.error || "Failed to resend email.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-md shadow-lg text-center">
        {verified ? (
          <>
            <div className="mb-4">
            <FaCheck className="text-blue-400 text-6xl mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-4">Your email has been successfully verified. You can now proceed to your dashboard.</p>
            <Link
              to="/dashboard"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md inline-block"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="mb-4">
            <FaEnvelope className="text-blue-400 text-6xl mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your inbox, please!</h2>
            <p className="text-gray-400 mb-4">
              We've sent a verification link to your email. Please check it and confirm.
            </p>
            <button
              onClick={handleResendVerification}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md"
            >
              Resend Email
            </button>
            {resendMessage &&  <FaRedo className="mr-2" /> && <p className="mt-4 text-green-500">{resendMessage}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaEnvelope, FaRedo } from "react-icons/fa";

// const VerifyEmail = () => {
//   const [emailSent, setEmailSent] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleResendEmail = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       // Simulate API call to resend verification email
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       setEmailSent(true);
//     } catch (err) {
//       setError("Failed to resend email. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
//       <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
//         <div className="flex justify-center mb-4">
//           <FaEnvelope className="text-blue-400 text-6xl" />
//         </div>
//         <h2 className="text-2xl font-bold mb-4">Check your inbox, please!</h2>
//         <p className="mb-6 text-gray-400">
//           We need to verify your email before you start using our services.
//           Please check your inbox and confirm your email address.
//         </p>
//         {emailSent ? (
//           <p className="text-green-500 font-semibold mb-4">
//             Verification email sent successfully!
//           </p>
//         ) : (
//           <button
//             onClick={handleResendEmail}
//             className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md flex items-center justify-center"
//             disabled={loading}
//           >
//             <FaRedo className="mr-2" /> {loading ? "Resending..." : "Resend Email"}
//           </button>
//         )}
//         {error && <p className="mt-4 text-red-500">{error}</p>}
//         <p className="mt-4 text-gray-400">
//           Didn't get the email? <Link to="/contact-support" className="text-blue-400 hover:underline">Contact Support</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
