// src/context/NavigationContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const pathname = usePathname();
  const [navigationState, setNavigationState] = useState({
    activeTab: null,
    isNavigating: false,
    moreMenuOpen: false,
    isMobile: false,
    lastVisitedPaths: {}
  });

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setNavigationState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768
      }));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close more menu on route change
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      moreMenuOpen: false,
      isNavigating: false,
      activeTab: null
    }));
  }, [pathname]);

  // Navigation state management
  const setActiveTab = (tabId) => {
    setNavigationState(prev => ({
      ...prev,
      activeTab: tabId
    }));
  };

  const setNavigating = (isNavigating) => {
    setNavigationState(prev => ({
      ...prev,
      isNavigating
    }));
  };

  const setMoreMenuOpen = (isOpen) => {
    setNavigationState(prev => ({
      ...prev,
      moreMenuOpen: isOpen
    }));
  };

  const recordVisitedPath = (path) => {
    setNavigationState(prev => ({
      ...prev,
      lastVisitedPaths: {
        ...prev.lastVisitedPaths,
        [path]: Date.now()
      }
    }));
  };

  // Smart navigation detection based on current path
  const getActiveNavigationTab = () => {
    if (pathname === '/dashboard') return 'home';
    
    if (pathname.startsWith('/employees') || 
        pathname.startsWith('/departments')) return 'people';
    
    if (pathname.startsWith('/attendance') || 
        pathname.startsWith('/leaves') || 
        pathname.startsWith('/leaveBalance')) return 'time';
    
    // Check if current path should highlight "more" tab
    const morePaths = [
      '/reports', '/attendanceManagement', '/leaveBalanceManagement',
      '/locations', '/company', '/profile', '/settings', '/notifications',
      '/help', '/privacy', '/more'
    ];
    
    if (morePaths.some(path => pathname.startsWith(path))) return 'more';
    
    return null;
  };

  // Gesture support for mobile navigation
  const [gestureState, setGestureState] = useState({
    startX: 0,
    startY: 0,
    isGesturing: false
  });

  const handleTouchStart = (e) => {
    if (!navigationState.isMobile) return;
    
    setGestureState({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      isGesturing: true
    });
  };

  const handleTouchEnd = (e) => {
    if (!navigationState.isMobile || !gestureState.isGesturing) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - gestureState.startX;
    const deltaY = endY - gestureState.startY;
    
    // Vertical swipe up to open more menu (if on bottom nav area)
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -50 && endY > window.innerHeight - 100) {
      setMoreMenuOpen(true);
    }
    
    setGestureState(prev => ({ ...prev, isGesturing: false }));
  };

  // Analytics and performance tracking
  const trackNavigation = (from, to, method = 'click') => {
    // This would integrate with your analytics service
    console.log('Navigation tracked:', { from, to, method, timestamp: Date.now() });
  };

  const value = {
    // State
    ...navigationState,
    currentActiveTab: getActiveNavigationTab(),
    
    // Actions
    setActiveTab,
    setNavigating,
    setMoreMenuOpen,
    recordVisitedPath,
    trackNavigation,
    
    // Gesture handlers
    handleTouchStart,
    handleTouchEnd,
    
    // Utilities
    isPathActive: (path) => pathname.startsWith(path),
    getLastVisited: (path) => navigationState.lastVisitedPaths[path] || 0
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};