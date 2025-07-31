// src/components/desktop/DesktopComponents.js
import React from 'react';
import Link from 'next/link';
import { 
  FiClock, FiUsers, FiCalendar, FiMapPin, FiBarChart, FiShield,
  FiPhone, FiMail
} from 'react-icons/fi';

// Desktop Navigation Bar
export const DesktopNavbar = () => {
  return (
    <nav className="hidden md:block bg-white border-b border-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AttendanceHub</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">Contact</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
            <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop Hero Section
export const DesktopHero = () => {
  return (
    <section className="hidden md:block relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Modern Attendance Management<br />for Growing Teams
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Track attendance, manage leaves, and boost productivity with our all-in-one solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
              Start Free Trial
            </Link>
            <Link href="/demo" className="border border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">
              Request Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

// Desktop Features Grid
export const DesktopFeatures = () => {
  const features = [
    {
      icon: FiClock,
      title: 'Real-time Attendance',
      description: 'Track employee check-ins and check-outs in real-time with location verification'
    },
    {
      icon: FiCalendar,
      title: 'Leave Management',
      description: 'Streamline leave requests and approvals with automated workflows'
    },
    {
      icon: FiUsers,
      title: 'Employee Management',
      description: 'Manage employee profiles, departments, and organizational hierarchy'
    },
    {
      icon: FiMapPin,
      title: 'Geofencing',
      description: 'Ensure attendance is marked only from authorized locations'
    },
    {
      icon: FiBarChart,
      title: 'Analytics & Reports',
      description: 'Get insights with comprehensive attendance reports and analytics'
    },
    {
      icon: FiShield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control'
    }
  ];

  return (
    <section className="hidden md:block py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Attendance
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to simplify workforce management
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Desktop Stats Section
export const DesktopStats = () => {
  return (
    <section className="hidden md:block bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Companies Trust Us</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Employees</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Desktop Testimonials Grid
export const DesktopTestimonials = () => {
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
    <section className="hidden md:block py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by HR Teams Everywhere
          </h2>
          <p className="text-xl text-gray-600">
            See what our customers have to say about AttendanceHub
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Desktop CTA Section
export const DesktopCTA = () => {
  return (
    <section className="hidden md:block bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Attendance Management?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of companies already using AttendanceHub
        </p>
        <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition inline-block">
          Start Your Free Trial
        </Link>
      </div>
    </section>
  );
};

// Desktop Footer
export const DesktopFooter = () => {
  return (
    <footer className="hidden md:block bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AttendanceHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Modern attendance management solution for growing teams.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/demo">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/status">Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@attendancehub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 AttendanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};