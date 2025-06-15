// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import RouteLoadingProvider from '@/components/providers/RouteLoadingProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AttendanceHub - Employee Attendance Management System',
  description: 'Complete attendance management solution for modern organizations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RouteLoadingProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </RouteLoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}