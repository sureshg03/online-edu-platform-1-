import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CheckCircle,
  Users,
  CreditCard,
  Calendar,
  LogOut,
  Settings,
  FileText,
  Building,
  BookOpen,
  UserPlus,
  Clipboard,
  BarChart2,
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fallback logo (base64 transparent PNG)
const fallbackLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6VcmAAAAABJRU5ErkJggg==';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isInitialRender = useRef(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mark initial render as complete
  useEffect(() => {
    if (isSidebarOpen && isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [isSidebarOpen]);

  const settingsSubMenu = [
    { name: 'Admission Open', path: '/settings/admission-open', icon: <Calendar className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Admission Details', path: '/settings/admission-details', icon: <FileText className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Add LSC', path: '/settings/add-lsc', icon: <Building className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Add Course', path: '/settings/add-course', icon: <BookOpen className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Add Counsellor', path: '/settings/add-counsellor', icon: <UserPlus className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Add Attendance', path: '/settings/add-attendance', icon: <Clipboard className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Assignment Marks', path: '/settings/add-assignment-mark', icon: <BarChart2 className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Internal Marks', path: '/settings/add-internal-model-mark', icon: <BarChart2 className="w-6 h-6 stroke-[1.5]" /> },
  ];

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Verification', path: '/application-verification', icon: <CheckCircle className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Students', path: '/verified-students', icon: <Users className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Payments', path: '/application-payment', icon: <CreditCard className="w-6 h-6 stroke-[1.5]" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-6 h-6 stroke-[1.5]" />, hasSubMenu: true },
    { name: 'Logout', path: '/login', icon: <LogOut className="w-6 h-6 stroke-[1.5]" /> },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handleMenuClick = (item) => {
    if (item.name === 'Logout') {
      handleLogout();
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    } else if (item.hasSubMenu) {
      setIsSettingsOpen(!isSettingsOpen);
    } else {
      navigate(item.path);
      if (window.innerWidth < 1024) {
        setTimeout(() => setIsSidebarOpen(false), 150);
      }
    }
  };

  const handleSubMenuClick = (subItem) => {
    navigate(subItem.path);
    if (window.innerWidth < 1024) {
      setTimeout(() => setIsSidebarOpen(false), 150);
    }
  };

  // Check if current path is settings-related
  const isSettingsActive = () => {
    return location.pathname.startsWith('/settings');
  };

  // Auto-open settings submenu if we're on a settings page
  useEffect(() => {
    if (isSettingsActive()) {
      setIsSettingsOpen(true);
    }
  }, [location.pathname]);

  // Animation variants
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { 
      x: 0, 
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] // Smoother cubic-bezier easing
      } 
    },
  };

  const subMenuVariants = {
    hidden: { 
      height: 0, 
      opacity: 0,
      transition: {
        height: { duration: 0.25 },
        opacity: { duration: 0.15 }
      }
    },
    visible: { 
      height: 'auto', 
      opacity: 1, 
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 }
      } 
    },
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Inter:wght@600;700;800&display=swap');

          .sidebar {
            background: linear-gradient(180deg, #1e1b4b 0%, #050257ff 50%, #21054cff 100%);
            color: #ffffff;
            font-family: 'Manrope', sans-serif;
            position: relative;
            overflow-y: auto;
            overflow-x: hidden;
            box-shadow: 6px 0 30px rgba(0, 0, 0, 0.3), inset -1px 0 0 rgba(255, 255, 255, 0.05);
            scrollbar-width: thin;
            scrollbar-color: rgba(167, 139, 250, 0.6) transparent;
            backdrop-filter: blur(10px);
          }
          
          .sidebar::-webkit-scrollbar {
            width: 6px;
          }
          
          .sidebar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .sidebar::-webkit-scrollbar-thumb {
            background: rgba(167, 139, 250, 0.5);
            border-radius: 3px;
          }
          
          .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(167, 139, 250, 0.7);
          }

          .sidebar-item {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 14px;
            margin-bottom: 6px;
            cursor: pointer;
            user-select: none;
            backdrop-filter: blur(10px);
            border: 1px solid transparent;
          }
          
          .sidebar-item:hover {
            background: linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.25) 100%);
            padding-left: 1.75rem;
            border-color: rgba(167, 139, 250, 0.2);
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15);
          }
          
          .sidebar-item.active {
            background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%);
            color: #ffffff;
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
            font-weight: 600;
          }
          
          .sidebar-item:active {
            transform: scale(0.97);
          }

          .submenu-item {
            position: relative;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            margin-bottom: 4px;
            cursor: pointer;
            user-select: none;
            border: 1px solid transparent;
          }
          
          .submenu-item:hover {
            background: linear-gradient(90deg, rgba(167, 139, 250, 0.12) 0%, rgba(124, 58, 237, 0.2) 100%);
            padding-left: 1.5rem;
            border-color: rgba(167, 139, 250, 0.15);
            box-shadow: 0 3px 12px rgba(124, 58, 237, 0.12);
          }
          
          .submenu-item.active {
            background: linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%);
            color: #1e1b4b;
            box-shadow: 0 4px 14px rgba(167, 139, 250, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            font-weight: 600;
            border-color: rgba(255, 255, 255, 0.2);
          }
          
          .submenu-item:active {
            transform: scale(0.96);
          }

          .icon-container {
            display: inline-flex;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
          
          .sidebar-item:hover .icon-container {
            transform: scale(1.15) rotate(8deg);
            filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.4));
          }
          
          .submenu-item:hover .icon-container {
            transform: scale(1.12) rotate(5deg);
            filter: drop-shadow(0 3px 6px rgba(167, 139, 250, 0.3));
          }
          
          .sidebar-item.active .icon-container {
            transform: scale(1.1);
            filter: drop-shadow(0 4px 10px rgba(255, 255, 255, 0.3));
          }
          
          .submenu-item.active .icon-container {
            transform: scale(1.08);
            filter: drop-shadow(0 2px 6px rgba(30, 27, 75, 0.3));
          }

          .submenu-container {
            overflow: hidden;
          }

          .Toastify__toast {
            font-family: 'Manrope', sans-serif;
            font-size: 0.9rem;
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .Toastify__toast--success {
            background: #10B981 !important;
            color: #ffffff;
          }
          
          .Toastify__toast--error {
            background: #EF4444 !important;
            color: #ffffff;
          }
          
          .Toastify__close-button {
            color: #ffffff;
            opacity: 0.7;
            transition: opacity 0.2s ease;
          }
          
          .Toastify__close-button:hover {
            opacity: 1;
          }
        `}
      </style>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="z-[100000]"
      />

      <motion.div
        role="navigation"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-30 w-[85vw] min-w-[280px] max-w-[320px] sm:w-80 lg:w-64 sidebar transition-transform duration-300 ease-in-out lg:translate-x-0`}
        variants={sidebarVariants}
        initial="hidden"
        animate={isSidebarOpen ? 'visible' : 'hidden'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 xs:p-4 sm:p-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 flex-1 min-w-0 pr-2">
            <motion.img
              src="/Logo.png"
              alt="College Logo"
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/20 flex-shrink-0"
              onError={(e) => (e.target.src = fallbackLogo)}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <h2 className="text-sm xs:text-base sm:text-lg lg:text-xl font-semibold tracking-tight truncate leading-tight">Admin Dashboard</h2>
          </div>
          <button
            aria-label="Close navigation"
            className="lg:hidden text-white hover:text-gray-200 focus:outline-none flex-shrink-0 p-1"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-3 xs:mt-4 sm:mt-5 lg:mt-6 px-2 xs:px-2.5 sm:px-3 pb-6 relative z-10">
          {menuItems.map((item) => {
            const isActive = item.hasSubMenu 
              ? isSettingsActive() 
              : location.pathname === item.path;
            
            return (
              <div key={item.name} className="mb-0.5 xs:mb-1">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center w-full px-3 xs:px-4 sm:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3.5 rounded-lg text-xs xs:text-sm sm:text-base font-medium sidebar-item ${
                    isActive ? 'active' : 'text-gray-100'
                  }`}
                >
                  <div className="icon-container flex-shrink-0">
                    {React.cloneElement(item.icon, { 
                      className: "w-4 h-4 xs:w-5 xs:h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 stroke-[1.5]" 
                    })}
                  </div>
                  <span className="ml-2.5 xs:ml-3 sm:ml-3.5 lg:ml-4 flex-1 text-left truncate leading-tight">{item.name}</span>
                  {item.hasSubMenu && (
                    <motion.div
                      className="ml-1 xs:ml-1.5 sm:ml-2 flex-shrink-0"
                      animate={{ rotate: isSettingsOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  )}
                </button>
                {item.hasSubMenu && (
                  <AnimatePresence initial={false}>
                    {isSettingsOpen && (
                      <motion.div
                        variants={subMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="submenu-container mt-0.5 xs:mt-1 ml-2.5 xs:ml-3 sm:ml-4 pl-2.5 xs:pl-3 sm:pl-4 border-l-2 border-white/20"
                      >
                        {settingsSubMenu.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleSubMenuClick(subItem)}
                            className={`flex items-center w-full px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 rounded-lg text-[11px] xs:text-xs sm:text-sm font-medium submenu-item ${
                              location.pathname === subItem.path ? 'active' : 'text-gray-200'
                            }`}
                          >
                            <div className="icon-container flex-shrink-0">
                              {React.cloneElement(subItem.icon, { 
                                className: "w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[1.5]" 
                              })}
                            </div>
                            <span className="ml-2 xs:ml-2.5 sm:ml-3 flex-1 text-left truncate leading-tight">{subItem.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </motion.div>

      {/* Mobile Menu Button */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            aria-label="Open navigation"
            className="lg:hidden fixed top-3 xs:top-3.5 sm:top-4 left-3 xs:left-3.5 sm:left-4 z-40 p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95"
            onClick={() => setIsSidebarOpen(true)}
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{ cursor: 'pointer' }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;