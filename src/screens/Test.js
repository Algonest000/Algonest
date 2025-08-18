import React, { useState } from "react";
import AlertPopup from "../components/AlertPopup";

const Test = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <button
        className="px-6 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
        onClick={() => showAlert("success", "Your operation was successful!")}
      >
        Show Success
      </button>
      <button
        className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-700 rounded-md"
        onClick={() => showAlert("warning", "Please check your input!")}
      >
        Show Warning
      </button>
      <button
        className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-700 rounded-md"
        onClick={() => showAlert("error", "An error occurred!")}
      >
        Show Error
      </button>

      {alert && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default Test;
