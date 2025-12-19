import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade-out animation before clearing the message
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ${
        visible && message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {message && (
        <div className="bg-brand-secondary text-white font-semibold px-4 py-3 rounded-md shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default Toast;
