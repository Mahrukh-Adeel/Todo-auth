import { useEffect } from 'react';

interface ErrorPopupProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

function ErrorPopup({ message, isVisible, onClose, duration = 5000 }: ErrorPopupProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 border-l-4 border-red-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Content */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Error
                </h3>
                <p className="text-sm text-gray-700">
                  {message}
                </p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Action Button */}
          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPopup;
