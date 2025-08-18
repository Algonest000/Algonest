import { FaTimes, FaSync } from "react-icons/fa";

const ErrorToast = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-900/90 text-white p-4 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">Error</h3>
        <button 
          onClick={onDismiss}
          className="text-white hover:text-gray-200"
          aria-label="Dismiss error"
        >
          <FaTimes />
        </button>
      </div>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm"
          >
            <FaSync className="mr-1" /> Retry
          </button>
        )}
        <button
          onClick={onDismiss}
          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;