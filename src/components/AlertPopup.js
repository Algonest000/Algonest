import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const AlertPopup = ({ type, message, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-600 text-black";
      case "error":
        return "bg-red-700 text-white";
      case "success":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FaExclamationTriangle className="text-5xl text-yellow-300" />
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FaTimesCircle className="text-5xl text-red-300" />
          </motion.div>
        );
      case "success":
        return (
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-green-300"
          >
            <path
              d="M20 50 L40 70 L80 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center items-start px-4 pt-6"
    >
      <div className={`w-full max-w-xs md:max-w-md lg:max-w-lg rounded-2xl shadow-2xl overflow-hidden ${getAlertStyles()}`}>
        <div className="p-6 flex flex-col items-center border-b border-gray-600">
          {getIcon()}
          <h2 className="text-white text-lg font-bold mt-4 capitalize">{type}</h2>
        </div>
        <div className="bg-gray-800 p-6 text-center rounded-b-2xl">
          <p className="text-gray-300 font-medium">{message}</p>
          <button
            className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full font-bold focus:outline-none hover:bg-gray-600 transition duration-300"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertPopup;
