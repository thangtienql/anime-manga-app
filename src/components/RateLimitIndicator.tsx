/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useState } from 'react';

export default function RateLimitIndicator() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const handleRateLimitEvent = (event: CustomEvent) => {
      const { isRateLimited, retryIn } = event.detail;
      setIsRateLimited(isRateLimited);
      
      if (isRateLimited) {
        setCountdown(retryIn);
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    };

    // @ts-ignore - CustomEvent typing issue
    window.addEventListener('jikan-rate-limit', handleRateLimitEvent);
    
    return () => {
      // @ts-ignore - CustomEvent typing issue
      window.removeEventListener('jikan-rate-limit', handleRateLimitEvent);
    };
  }, []);

  if (!isRateLimited) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-pulse">
      <svg 
        className="w-5 h-5"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span>
        Rate limited - Retrying in {countdown} seconds
      </span>
    </div>
  );
} 