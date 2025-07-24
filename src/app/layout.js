// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import RouteLoadingProvider from '@/components/providers/RouteLoadingProvider';
import ClientToaster from '@/components/ui/ClientToaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  // title: 'AttendanceHub - Employee Attendance Management System',
  description: 'Complete attendance management solution for modern organizations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RouteLoadingProvider>
            {children}
            <ClientToaster />
          </RouteLoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}