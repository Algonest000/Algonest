import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";

// Responsive background images
const bgSmall = './bg-small.jpg';    // 640x1136
const bgMedium = './bg-medium.jpg';  // 1280x800 
const bgLarge = './bg-large.jpg';    // 1920x1080
const bgXLarge = './bg-xlarge.jpg';  // 3840x2160 

// Country codes array remains the same...
const countryCodes = [
  { code: "DZ", dialCode: "+213", name: "Algeria" },
  { code: "AO", dialCode: "+244", name: "Angola" },
  { code: "BJ", dialCode: "+229", name: "Benin" },
  { code: "BW", dialCode: "+267", name: "Botswana" },
  { code: "BF", dialCode: "+226", name: "Burkina Faso" },
  { code: "BI", dialCode: "+257", name: "Burundi" },
  { code: "CM", dialCode: "+237", name: "Cameroon" },
  { code: "CV", dialCode: "+238", name: "Cape Verde" },
  { code: "CF", dialCode: "+236", name: "Central African Republic" },
  { code: "TD", dialCode: "+235", name: "Chad" },
  { code: "KM", dialCode: "+269", name: "Comoros" },
  { code: "CD", dialCode: "+243", name: "DR Congo" },
  { code: "DJ", dialCode: "+253", name: "Djibouti" },
  { code: "EG", dialCode: "+20", name: "Egypt" },
  { code: "GQ", dialCode: "+240", name: "Equatorial Guinea" },
  { code: "ER", dialCode: "+291", name: "Eritrea" },
  { code: "ET", dialCode: "+251", name: "Ethiopia" },
  { code: "GA", dialCode: "+241", name: "Gabon" },
  { code: "GM", dialCode: "+220", name: "Gambia" },
  { code: "GH", dialCode: "+233", name: "Ghana" },
  { code: "GN", dialCode: "+224", name: "Guinea" },
  { code: "GW", dialCode: "+245", name: "Guinea-Bissau" },
  { code: "CI", dialCode: "+225", name: "Ivory Coast" },
  { code: "KE", dialCode: "+254", name: "Kenya" },
  { code: "LS", dialCode: "+266", name: "Lesotho" },
  { code: "LR", dialCode: "+231", name: "Liberia" },
  { code: "LY", dialCode: "+218", name: "Libya" },
  { code: "MG", dialCode: "+261", name: "Madagascar" },
  { code: "MW", dialCode: "+265", name: "Malawi" },
  { code: "ML", dialCode: "+223", name: "Mali" },
  { code: "MR", dialCode: "+222", name: "Mauritania" },
  { code: "MU", dialCode: "+230", name: "Mauritius" },
  { code: "MZ", dialCode: "+258", name: "Mozambique" },
  { code: "NA", dialCode: "+264", name: "Namibia" },
  { code: "NE", dialCode: "+227", name: "Niger" },
  { code: "NG", dialCode: "+234", name: "Nigeria" },
  { code: "RW", dialCode: "+250", name: "Rwanda" },
  { code: "SH", dialCode: "+290", name: "Saint Helena" },
  { code: "ST", dialCode: "+239", name: "São Tomé and Príncipe" },
  { code: "SN", dialCode: "+221", name: "Senegal" },
  { code: "SC", dialCode: "+248", name: "Seychelles" },
  { code: "SL", dialCode: "+232", name: "Sierra Leone" },
  { code: "ZA", dialCode: "+27", name: "South Africa" },
  { code: "SS", dialCode: "+211", name: "South Sudan" },
  { code: "SD", dialCode: "+249", name: "Sudan" },
  { code: "SZ", dialCode: "+268", name: "Eswatini" },
  { code: "TZ", dialCode: "+255", name: "Tanzania" },
  { code: "TG", dialCode: "+228", name: "Togo" },
  { code: "TN", dialCode: "+216", name: "Tunisia" },
  { code: "UG", dialCode: "+256", name: "Uganda" },
  { code: "ZM", dialCode: "+260", name: "Zambia" },
  { code: "ZW", dialCode: "+263", name: "Zimbabwe" },
];

const SignupScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultCountry = countryCodes.find(c => c.code === "NG") || countryCodes[0];
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: defaultCountry.code,
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    invitationCode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
   const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

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

  // Handle referral code from URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, invitationCode: refCode }));
    }
  }, [searchParams]);

  const validate = () => {
    const newErrors = {};
    const { fullName, phone, email, password, confirmPassword } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d+$/.test(phone)) newErrors.phone = "Only digits allowed.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match.";
      if (!agreeToTerms) setTermsError("You must agree to the terms and conditions");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && agreeToTerms;
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, countryCode: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validate()) return;

    setLoading(true);
    try {
      const country = countryCodes.find(c => c.code === formData.countryCode) || defaultCountry;
      const phoneNumber = `${country.dialCode}${formData.phone.replace(/\D/g, '')}`;

      const response = await axios.post(
        " https://api.algonestdigitals.com/api/register.php",
        {
          name: formData.fullName.trim(),
          phone_number: phoneNumber,
          email: formData.email.trim(),
          password: formData.password,
          referral_code: formData.invitationCode?.trim() || null,
        },
        { 
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response.data.error || "Signup failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage.replace("Error: ", ""));
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const selectedCountry = countryCodes.find(c => c.code === formData.countryCode) || defaultCountry;

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
      <div className="w-full max-w-md p-6 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              aria-describedby="fullName-error"
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-red-500 text-sm mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

              {/* Phone Number with Country Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                <div className="relative flex-1">
      <select
        value={formData.countryCode}
        onChange={handleCountryChange}
        className="w-full p-3 pr-8 rounded-md bg-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {countryCodes.map(country => (
          <option key={country.code} value={country.code}>
            {/* Show full country name on desktop, code on mobile */}
            <div className="hidden md:inline">
              {country.dialCode} {country.name}
            </div>
            {/* <span className="md:hidden">
              {country.dialCode} {country.code}
            </span> */}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-3">
        <ReactCountryFlag 
          countryCode={selectedCountry.code}
          svg
          style={{ width: '1.2em', height: '1.2em' }}
        />
      </div>
    </div>
              <input
                type="tel"
                name="phone"
                placeholder="10 Digits Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                aria-describedby="phone-error"
              />
            </div>
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                disabled={loading}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              aria-describedby="confirmPassword-error"
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Invitation Code */}
          <div className="mb-4">
            <label htmlFor="invitationCode" className="block text-sm font-medium mb-1">
              Invitation Code
            </label>
            <input
              type="text"
              id="invitationCode"
              name="invitationCode"
              placeholder="Enter invitation code"
              value={formData.invitationCode}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
               {/* Terms and Conditions Checkbox */}
          <div className="mb-4 flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (termsError) setTermsError("");
                }}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 focus:ring-blue-500"
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-500 hover:underline">
                Terms and Conditions
              </Link>
            </label>
          </div>
          {termsError && (
            <p className="text-red-500 text-sm mb-3">{termsError}</p>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 rounded-md">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 rounded-md">
              <p className="text-green-300 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// // Simple eye icons component
// const EyeIcon = () => (
//   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );

// const EyeOffIcon = () => (
//   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );

export default SignupScreen;