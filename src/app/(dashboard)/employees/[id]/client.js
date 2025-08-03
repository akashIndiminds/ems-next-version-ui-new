// src/app/(dashboard)/employees/[id]/client.js
'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import EditEmployeeClient from '../EditEmployeeClient';
import ViewEmployeeClient from '../ViewEmployeeClient';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function EmployeeContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Extract employee ID from pathname
  // For URL like /employees/24/ or /employees/24/edit
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const employeeIndex = pathParts.indexOf('employees');
  const employeeId = employeeIndex !== -1 ? pathParts[employeeIndex + 1] : null;
  
  // Get action from search params
  const action = searchParams?.get('action');
  
  // Debug logging
  console.log('Pathname:', pathname);
  console.log('Path parts:', pathParts);
  console.log('Employee ID extracted:', employeeId);
  console.log('Action:', action);
  
  // Ensure we have a valid ID
  if (!employeeId || employeeId === 'edit' || employeeId === 'view') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Invalid employee ID</p>
            <p className="text-sm">Could not extract employee ID from URL</p>
            <p className="text-xs mt-2">URL: {pathname}</p>
            <p className="text-xs">Extracted ID: {employeeId}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine action based on URL path or query params
  const isEditRoute = pathname?.includes('/edit') || action === 'edit';
  const isViewRoute = pathname?.includes('/view') || action === 'view' || !action;
  
  // Create a clean params object to pass down
  const cleanParams = {
    id: employeeId
  };
  
  console.log('Route decision:', { 
    isEditRoute, 
    isViewRoute, 
    finalAction: isEditRoute ? 'edit' : 'view',
    cleanParams 
  });
  
  // If edit route or edit action
  if (isEditRoute) {
    return <EditEmployeeClient params={cleanParams} />;
  }
  
  // Default to view
  return <ViewEmployeeClient params={cleanParams} />;
}

export default function EmployeeRouteHandler({ params }) {
  // Debug logging
  console.log('EmployeeRouteHandler received params:', params);
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EmployeeContent />
    </Suspense>
  );
}