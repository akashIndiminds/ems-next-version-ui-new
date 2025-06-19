// src/components/providers/RouteLoadingProvider.js
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createContext, useContext } from 'react';

const RouteLoadingContext = createContext({});

export const useRouteLoading = () => {
  const context = useContext(RouteLoadingContext);
  if (!context) {
    throw new Error('useRouteLoading must be used within RouteLoadingProvider');
  }
  return context;
};

// Component that uses search params - wrap in Suspense
function RouteLoadingContent({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setTimeout(() => {
        setLoading(false);
      }, 300); // Small delay to show loading state
    };

    // Start loading when route changes
    handleStart();
    
    // Complete loading after route is ready
    const timer = setTimeout(handleComplete, 100);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [pathname, searchParams]);

  const value = {
    loading,
    setLoading
  };

  return (
    <RouteLoadingContext.Provider value={value}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </RouteLoadingContext.Provider>
  );
}

// Loading fallback component
function RouteLoadingFallback({ children }) {
  const value = {
    loading: false,
    setLoading: () => {}
  };

  return (
    <RouteLoadingContext.Provider value={value}>
      {children}
    </RouteLoadingContext.Provider>
  );
}

// Main provider with Suspense boundary
export default function RouteLoadingProvider({ children }) {
  return (
    <Suspense fallback={<RouteLoadingFallback>{children}</RouteLoadingFallback>}>
      <RouteLoadingContent>{children}</RouteLoadingContent>
    </Suspense>
  );
}