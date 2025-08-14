import { useState, useCallback, useEffect } from 'react';

export function useToast(duration = 2500) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [visible, duration]);

  return { message: visible ? message : '', showToast };
} 