import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';
const bgXLarge = './bg-xlarge.jpg';

const CustomerServiceComplaint = () => {
  const [report, setReport] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Set appropriate background image based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width <= 640) setBackgroundImage(bgSmall);
      else if (width <= 1024) setBackgroundImage(bgMedium);
      else if (width >= 2560 && height >= 1440) setBackgroundImage(bgXLarge);
      else setBackgroundImage(bgLarge);
    };

    // Preload images
    const images = [bgSmall, bgMedium, bgLarge, bgXLarge];
    const imagePromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setBackgroundLoaded(true);
        handleResize();
      })
      .catch(err => {
        console.error("Error loading background images", err);
        setBackgroundLoaded(true);
      });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Send report data to backend API
      const response = await axios.post(
        "https://api.algonestdigitals.com/api/submit_report.php",
        report,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        setReport({ name: "", email: "", subject: "", description: "" });
      } else {
        throw new Error(response.data.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(error.response?.data?.error || error.message || "Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div 
      className="min-h-screen text-white px-4 py-10 flex flex-col items-center"
      style={{ 
        backgroundImage: backgroundLoaded ? `url(${backgroundImage})` : 'none',
        backgroundColor: !backgroundLoaded ? '#111827' : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.3s ease'
      }}
    >
      <div className="w-full max-w-3xl">
        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">Customer Support</h1>
       
        {/* Report Submission Form */}
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit a Report</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={report.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={report.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={report.subject}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Describe your issue in detail..."
              value={report.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded w-full transition ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
            
            {/* Success and Error Messages */}
            {success && (
              <div className="mt-4 p-3 bg-green-900 bg-opacity-50 rounded-md text-center">
                Report submitted successfully! We'll get back to you soon.
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-900 bg-opacity-50 rounded-md text-center">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Additional Support Options */}
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Other Support Options</h2>
          <p className="mb-4 text-gray-300">
            For immediate assistance, please join our community groups:
          </p>
          
          <div className="flex flex-col space-y-4">
            <a
              href="https://t.me/your_telegram_group"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded transition"
            >
              <FaTelegram className="text-2xl mr-3" />
              <span>Join Telegram Support Group</span>
            </a>
            
            <a
              href="https://wa.me/your_whatsapp_group"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded transition"
            >
              <FaWhatsapp className="text-2xl mr-3" />
              <span>Join WhatsApp Support Group</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <h3 className="font-medium text-blue-400">How long does it take to get a response?</h3>
              <p className="text-gray-300 mt-1">We typically respond within 24-48 hours.</p>
            </div>
            <div className="border-b border-gray-700 pb-4">
              <h3 className="font-medium text-blue-400">What information should I include in my report?</h3>
              <p className="text-gray-300 mt-1">Please provide as much detail as possible, including any relevant transaction IDs.</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-400">Can I submit multiple reports for the same issue?</h3>
              <p className="text-gray-300 mt-1">Please avoid duplicate reports. We track all submissions and will respond to your first report.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceComplaint;