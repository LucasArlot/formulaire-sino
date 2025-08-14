import React, { useEffect, useState } from 'react';
import '@/styles/toast.css';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  const [animation, setAnimation] = useState('');
  
  useEffect(() => {
    if (isVisible) {
      setAnimation('slide-in');
      
      const timer = setTimeout(() => {
        setAnimation('slide-out');
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, message]);
  
  if (!message) return null;
  
  return (
    <div className={`toast ${animation}`}>
      {message}
    </div>
  );
};

export default Toast;