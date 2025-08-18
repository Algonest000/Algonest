import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';    // 640x1136
const bgMedium = './bg-medium.jpg';  // 1280x800 
const bgLarge = './bg-large.jpg';    // 1920x1080
const bgXLarge = './bg-xlarge.jpg';  // 3840x2160

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Extract reset key from URL
  useEffect(() => {
    const pathParts = location.pathname.split('key=');
    console.log("Full path:", location.pathname);
    console.log("Split parts:", pathParts);
    
    if (pathParts.length > 1) {
      const key = pathParts[1];
      console.log("Extracted key:", key);
      setResetKey(key);
    } else {
      console.log("No key found in URL");
      setErrorMessage("Invalid reset link. Please request a new password reset.");
    }
  }, [location]);

  const validate = () => {
    let newErrors = {};
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!validate()) return;
    
    if (!resetKey) {
      setErrorMessage("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(" https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/reset_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: resetKey,
          new_password: formData.password
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setFormData({ password: "", confirmPassword: "" });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen text-white p-4"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll',
      }}
    >
      <div className="w-full max-w-md p-6 rounded-lg bg-gray-800 shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/70 text-red-200 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {!resetKey ? (
          <div className="text-center">
            <p className="text-red-400 mb-4">Invalid or missing reset key</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="w-full mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700/80 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="w-full mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700/80 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
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
                  Processing...
                </span>
              ) : "Reset Password"}
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
                  Password reset successfully!
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Redirecting to login page...
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;