import { useState, useEffect } from 'react';
import { 
  FiMenu, FiBell, FiUser, FiChevronDown, FiSettings, FiLogOut, 
  FiSearch, FiCommand, FiSun, FiMoon, FiGlobe, FiHelpCircle,
  FiMaximize2, FiMinimize2, FiX
} from 'react-icons/fi';

const useAuth = () => ({
  user: {
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@company.com",
    company: {
      companyName: "TechCorp Solutions"
    },
    avatar: null
  },
  logout: () => console.log('Logout')
});

export default function ModernHeader({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
      setNotificationOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const notifications = [
    { id: 1, title: 'Your leave request has been approved', time: '2 hours ago', type: 'success', unread: true },
    { id: 2, title: 'New employee added to your department', time: '5 hours ago', type: 'info', unread: true },
    { id: 3, title: 'Reminder: Submit monthly report', time: '1 day ago', type: 'warning', unread: false },
    { id: 4, title: 'System maintenance scheduled', time: '2 days ago', type: 'info', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {(dropdownOpen || notificationOpen || commandPaletteOpen) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Modern Glassmorphic Header */}
      <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
          
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 transition-all duration-200 md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-50/50"
              onClick={onMenuClick}
            >
              <FiMenu className="h-5 w-5" />
            </button>

            {/* Company Logo & Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {user?.company?.companyName}
                </h1>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative">
              <div className={`relative transition-all duration-300 ${searchOpen ? 'w-full' : 'w-full max-w-sm mx-auto'}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search or press ⌘K"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setSearchOpen(false)}
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-100/80 hover:bg-gray-200/50 focus:bg-white/90 border border-gray-200/50 rounded-xl text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-gray-200 rounded-md text-xs font-mono text-gray-500 bg-gray-50">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {isFullscreen ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationOpen(!notificationOpen);
                  setDropdownOpen(false);
                }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <FiBell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50/80 border-l-4 transition-colors duration-150 ${
                          notification.unread 
                            ? 'bg-blue-50/50 border-l-blue-500' 
                            : 'border-l-transparent'
                        } ${
                          notification.type === 'success' ? 'border-l-green-500' :
                          notification.type === 'warning' ? 'border-l-amber-500' :
                          'border-l-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {user?.fullName}
                  </p>
                </div>
                <FiChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <FiUser className="mr-3 h-4 w-4 text-gray-400" />
                      Your Profile
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <FiSettings className="mr-3 h-4 w-4 text-gray-400" />
                      Settings
                    </a>
                    <a
                      href="/help"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <FiHelpCircle className="mr-3 h-4 w-4 text-gray-400" />
                      Help & Support
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-150"
                    >
                      <FiLogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center px-4 pt-16">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)} />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-lg">
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <FiCommand className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-500"
                  autoFocus
                />
                <button 
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                >
                  <FiX className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {['Dashboard', 'Analytics', 'Settings', 'Profile', 'Help'].map((item, index) => (
                  <div key={index} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}