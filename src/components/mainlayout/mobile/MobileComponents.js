// src/components/mobile/MobileComponents.js
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiClock, FiUsers, FiCalendar, FiMapPin, FiBarChart, FiShield,
  FiMenu, FiX, FiChevronRight, FiStar
} from 'react-icons/fi';

// Mobile Header with Hamburger Menu
export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AttendanceHub</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiMenu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-50">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <Link href="/register" className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl font-semibold">
                  <span>Start Free Trial</span>
                  <FiChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/demo" className="flex items-center justify-between p-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold">
                  <span>Request Demo</span>
                  <FiChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="pt-4 border-t">
                <div className="space-y-3 text-sm text-gray-600">
                  <p>🎯 No credit card required</p>
                  <p>⏰ 30-day free trial</p>
                  <p>✅ Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mobile Hero Section
export const MobileHero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white px-4 py-12 md:hidden">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold leading-tight">
          Modern Attendance<br />
          Management for<br />
          Growing Teams
        </h1>
        <p className="text-lg text-blue-100 leading-relaxed">
          Track attendance, manage leaves, and boost productivity with our all-in-one solution
        </p>
        <div className="space-y-3">
          <Link href="/register" className="block w-full bg-white text-blue-600 py-4 rounded-xl font-semibold text-lg shadow-lg">
            Start Free Trial
          </Link>
          <Link href="/demo" className="block w-full border-2 border-white text-white py-4 rounded-xl font-semibold text-lg">
            Request Demo
          </Link>
        </div>
        <div className="pt-4 space-y-2 text-sm text-blue-100">
          <p>✨ No credit card required</p>
          <p>🚀 30-day free trial • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
};

// Mobile Features with Horizontal Scroll
export const MobileFeatures = () => {
  const features = [
    {
      icon: FiClock,
      title: 'Real-time Attendance',
      description: 'Track employee check-ins and check-outs in real-time with location verification',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiCalendar,
      title: 'Leave Management',
      description: 'Streamline leave requests and approvals with automated workflows',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiUsers,
      title: 'Employee Management',
      description: 'Manage employee profiles, departments, and organizational hierarchy',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: FiMapPin,
      title: 'Geofencing',
      description: 'Ensure attendance is marked only from authorized locations',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: FiBarChart,
      title: 'Analytics & Reports',
      description: 'Get insights with comprehensive attendance reports and analytics',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: FiShield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <section className="px-4 py-12 md:hidden">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Everything You Need
        </h2>
        <p className="text-gray-600">
          Powerful features designed to simplify workforce management
        </p>
      </div>
      
      {/* Horizontal Scroll Features */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4" style={{ width: 'max-content' }}>
          {features.map((feature, index) => (
            <div key={index} className="w-72 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-shrink-0">
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {features.map((_, index) => (
            <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Mobile Stats Grid
export const MobileStats = () => {
  const stats = [
    { number: '500+', label: 'Companies Trust Us' },
    { number: '50K+', label: 'Active Employees' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <section className="bg-gray-50 px-4 py-8 md:hidden">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stat.number}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Mobile Testimonials with Horizontal Scroll
export const MobileTestimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'HR Manager, TechCorp',
      content: 'AttendanceHub has transformed how we manage attendance. The automated reports save us hours every week.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'CEO, StartupX',
      content: 'Simple, efficient, and cost-effective. Perfect solution for our growing team.',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Operations Head, ManufacturingCo',
      content: 'The mobile app and location tracking features have been game-changers for our field staff.',
      rating: 5
    }
  ];

  return (
    <section className="px-4 py-12 md:hidden">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Loved by HR Teams
        </h2>
        <p className="text-gray-600">
          See what our customers say about AttendanceHub
        </p>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4" style={{ width: 'max-content' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-shrink-0">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Mobile CTA Section
export const MobileCTA = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-12 md:hidden">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-white leading-tight">
          Ready to Transform Your Attendance Management?
        </h2>
        <p className="text-blue-100">
          Join thousands of companies already using AttendanceHub
        </p>
        <Link href="/register" className="block w-full bg-white text-blue-600 py-4 rounded-xl font-semibold text-lg shadow-lg">
          Start Your Free Trial
        </Link>
      </div>
    </section>
  );
};

// Mobile Footer
export const MobileFooter = () => {
  return (
    <footer className="bg-gray-900 text-white px-4 py-8 md:hidden">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiClock className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">AttendanceHub</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-300">Product</h4>
            <ul className="space-y-1 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>Demo</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-300">Support</h4>
            <ul className="space-y-1 text-gray-400">
              <li>Help Center</li>
              <li>Contact</li>
              <li>Status</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-800 text-center text-xs text-gray-400">
          <p>© 2025 AttendanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};