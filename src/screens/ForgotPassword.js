import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';    // 640x1136
const bgMedium = './bg-medium.jpg';  // 1280x800 
const bgLarge = './bg-large.jpg';    // 1920x1080
const bgXLarge = './bg-xlarge.jpg';  // 3840x2160

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);

  // Responsive background setup
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width <= 640) setBackgroundImage(bgSmall);
      else if (width <= 1024) setBackgroundImage(bgMedium);
      else if (width >= 2560 && height >= 1440) setBackgroundImage(bgXLarge);
      else setBackgroundImage(bgLarge);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validate = () => {
    if (!email.trim()) {
      setError("Email address is required.");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/generate_reset_key.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // First check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      // Get the response text first
      const responseText = await response.text();
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", responseText);
        throw new Error("Server returned an invalid response");
      }

      // Check if the response has the expected structure
      if (!data || typeof data.success === 'undefined') {
        throw new Error("Invalid response format from server");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to send reset instructions");
      }

      setSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Error during password reset request:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen text-white p-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll',
      }}
    >
      <div className="w-full max-w-md p-6 rounded-lg bg-gray-800/90 shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Enter your registered email to receive reset instructions.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/70 text-red-200 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full p-3 bg-gray-700/80 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || success}
              aria-describedby="email-error"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || success}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : "Send Instructions"}
          </button>
          
          {success && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-500/90 flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-400 mt-3 font-medium">
                Reset instructions sent to your email!
              </p>
              <p className="text-gray-300 text-sm mt-2">
                If you don't see the email, check your spam folder.
              </p>
            </div>
          )}
        </form>
        
        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;