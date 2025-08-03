// src/app/(dashboard)/employees/[id]/page.js
// This is a server component - no 'use client' directive
import EmployeeRouteHandler from './client';

// For static export - this is required
export async function generateStaticParams() {
  return [];
}

// Simple server component that passes params to client component
export default function EmployeePage({ params }) {
  return <EmployeeRouteHandler params={params} />;
}