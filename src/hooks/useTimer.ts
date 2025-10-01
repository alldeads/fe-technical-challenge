import { useState, useEffect } from 'react';

export const useTimer = (lastOnlineTimestamp: number | null): string => {
  const [timeSinceOnline, setTimeSinceOnline] = useState<string>('');

  const calculateTimeSinceOnline = (timestamp: number): string => {
    const now = Date.now();
    const lastOnline = timestamp * 1000;
    const diffInMs = now - lastOnline;
    
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!lastOnlineTimestamp) return;

    // Initialize the timer
    setTimeSinceOnline(calculateTimeSinceOnline(lastOnlineTimestamp));
    
    // Set up interval to update every second
    const interval = setInterval(() => {
      setTimeSinceOnline(calculateTimeSinceOnline(lastOnlineTimestamp));
    }, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [lastOnlineTimestamp]);

  return timeSinceOnline;
};