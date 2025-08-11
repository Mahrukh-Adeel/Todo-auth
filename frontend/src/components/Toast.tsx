import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

function Toast({ 
  message, 
  type = 'error', 
  isVisible, 
  onClose, 
  duration = 4000,
  position = 'top-right'
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsAnimating(false);
          setTimeout(() => {
            onClose();
          }, 300); // Animation duration
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  if (!isVisible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500'
        };
      case 'success':
        return {
          bg: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-500'
        };
      default:
        return getTypeStyles();
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div 
      className={`fixed z-50 ${getPositionClasses()} transition-all duration-300 ${
        isAnimating ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
    >
      <div className={`${typeStyles.bg} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm min-w-72`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
