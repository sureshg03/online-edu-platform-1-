import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  FileText,
  Building,
  BookOpen,
  UserPlus,
  Clipboard,
  BarChart,
} from 'lucide-react';
import AddLSC from './AddLSC';
import AddCourse from './AddCourse';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const settingsOptions = [
  { name: 'Admission Open', path: '/settings/admission-open', icon: <Calendar className="w-10 h-10" />, color: 'from-[#9333ea] to-[#f472b6]' },
  { name: 'Admission Opened Details', path: '/settings/admission-details', icon: <FileText className="w-10 h-10" />, color: 'from-[#7c3aed] to-[#db2777]' },
  { name: 'Add New LSC', path: '/settings/add-lsc', icon: <Building className="w-10 h-10" />, color: 'from-[#6d28d9] to-[#e879f9]' },
  { name: 'Add New Course', path: '/settings/add-course', icon: <BookOpen className="w-10 h-10" />, color: 'from-[#5b21b6] to-[#f9a8d4]' },
  { name: 'Add Counsellor', path: '/settings/add-counsellor', icon: <UserPlus className="w-10 h-10" />, color: 'from-[#4c1d95] to-[#f43f5e]' },
  { name: 'Add Attendance', path: '/settings/add-attendance', icon: <Clipboard className="w-10 h-10" />, color: 'from-[#3b0764] to-[#fb7185]' },
  { name: 'Add Assignment Mark', path: '/settings/add-assignment-mark', icon: <BarChart className="w-10 h-10" />, color: 'from-[#2a1548] to-[#f9a8d4]' },
  { name: 'Add Internal & Model Mark', path: '/settings/add-internal-model-mark', icon: <BarChart className="w-10 h-10" />, color: 'from-[#1e1b4b] to-[#f472b6]' },
];

const Settings = ({ initialSection }) => {
  const [activeSection, setActiveSection] = useState(initialSection || 'Admission Open');
  const [progress, setProgress] = useState(settingsOptions.findIndex((opt) => opt.name === (initialSection || 'Admission Open')) + 1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentOption = settingsOptions.find((opt) => opt.path === location.pathname);
    if (currentOption) {
      setActiveSection(currentOption.name);
      setProgress(settingsOptions.findIndex((opt) => opt.name === currentOption.name) + 1);
    }
  }, [location.pathname]);

  const handleButtonClick = (option, index) => {
    setActiveSection(option.name);
    setProgress(index + 1);
    navigate(option.path);
  };

  const handleNext = () => {
    if (progress < settingsOptions.length) {
      const nextOption = settingsOptions[progress];
      setActiveSection(nextOption.name);
      setProgress(progress + 1);
      navigate(nextOption.path);
    }
  };

  const handlePrevious = () => {
    if (progress > 1) {
      const prevOption = settingsOptions[progress - 2];
      setActiveSection(prevOption.name);
      setProgress(progress - 1);
      navigate(prevOption.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 p-8  relative overflow-hidden">
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          width: 'auto',
          maxWidth: '400px',
        }}
      />
      
      <style>
        {`
          @keyframes holographic {
            0% { background-position: 0% 50%; }
            100% { background-position: 400% 50%; }
          }
          @keyframes sparkle {
            0% { opacity: 0; transform: scale(0) translate(0, 0); }
            50% { opacity: 1; transform: scale(1) translate(8px, -8px); }
            100% { opacity: 0; transform: scale(0) translate(16px, -16px); }
          }
          @keyframes ripple {
            0% { transform: scale(0); opacity: 0.6; }
            100% { transform: scale(4); opacity: 0; }
          }
          
          .sparkle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, rgba(147,51,234,0.9), transparent);
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 1.8s infinite;
          }
          .sparkle:nth-child(2) { animation-delay: 0.4s; left: 85%; top: 15%; }
          .sparkle:nth-child(3) { animation-delay: 0.8s; left: 15%; top: 85%; }
          .sparkle:nth-child(4) { animation-delay: 1.2s; left: 90%; top: 40%; }
          .sparkle:nth-child(5) { animation-delay: 1.6s; left: 10%; top: 60%; }
          .ripple {
            position: absolute;
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, rgba(147,51,234,0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s linear;
          }
             .Toastify__toast-container {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 99999 !important;
            width: auto !important;
            max-width: 400px !important;
          }
          .Toastify__toast {
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            padding: 16px 24px;
            border-radius: 12px;
            min-height: 60px;
            display: flex !important;
            opacity: 1 !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
          .Toastify__toast--success {
            background: linear-gradient(135deg, rgba(0, 192, 70, 0.9), rgba(0, 146, 54, 0.8)) !important;
            color: white;
          }
          .Toastify__toast--error {
            background: linear-gradient(135deg, rgba(201, 8, 8, 0.9), rgba(94, 0, 0, 0.8)) !important;
            color: white;
          }
          .Toastify__toast-body {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .Toastify__toast-body::before {
            content: '';
            display: inline-block;
            width: 24px;
            height: 24px;
            background-size: contain;
            background-repeat: no-repeat;
          }
          .Toastify__toast--success .Toastify__toast-body::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          }
          .Toastify__toast--error .Toastify__toast-body::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'/%3E%3Cline x1='6' y1='6' x2='18' y2='18'/%3E%3C/svg%3E");
          }
          .Toastify__close-button {
            color: white;
            opacity: 0.8;
            transition: opacity 0.3s ease, transform 0.3s ease;
          }
          .Toastify__close-button:hover {
            opacity: 1;
            transform: scale(1.1);
          }
          @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toastGlow {
            from { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 0 15px rgba(99, 102, 241, 0.4); }
            to { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 0 20px rgba(99, 102, 241, 0.6); }
          }
        `}
      </style>
      <motion.div
        className="absolute inset-0 pointer-events-none holographic "
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(147,51,234,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(244,114,182,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 30%, rgba(147,51,234,0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <circle cx="100" cy="100" r="4" fill="#9333ea" opacity="0.4" />
          <circle cx="900" cy="900" r="5" fill="#f472b6" opacity="0.5" />
          <circle cx="500" cy="150" r="3" fill="#7c3aed" opacity="0.6" />
          <circle cx="850" cy="250" r="4" fill="#9333ea" opacity="0.4" />
          <circle cx="150" cy="850" r="3.5" fill="#f472b6" opacity="0.5" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-10 text-gray-900"
          style={{
            fontFamily: "'Oleo Script Swash Caps', cursive",
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 3px rgba(147, 51, 234, 0.4)',
          }}
        
        >
          Settings
        </motion.h1>

        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-3">
            {settingsOptions.map((_, index) => (
              <motion.div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  progress > index ? 'bg-gradient-to-r from-[#9333ea] to-[#f472b6]' : 'bg-gray-300'
                }`}
                animate={{ scale: progress === index + 1 ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.6, repeat: progress === index + 1 ? Infinity : 0 }}
              />
            ))}
          </div>
          <span className="ml-6 text-base font-medium text-gray-600" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
            Step {progress} of {settingsOptions.length}
          </span>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 mb-16">
          {settingsOptions.map((option, index) => (
            <motion.button
              key={option.name}
              onClick={(e) => {
                handleButtonClick(option, index);
                const rect = e.currentTarget.getBoundingClientRect();
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = `${e.clientX - rect.left - 20}px`;
                ripple.style.top = `${e.clientY - rect.top - 20}px`;
                e.currentTarget.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }}
              className={`relative p-10 border-2 border-violet-400 rounded-2xl bg-white/85 backdrop-blur-xl  ${
                activeSection === option.name
                  ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-[0_12px_32px_rgba(147,51,234,0.5)]`
                  : 'border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
              } hover:shadow-[0_16px_40px_rgba(147,51,234,0.6)] transition-all duration-400 overflow-hidden group perspective-1000`}
              whileHover={{
                scale: 1.06,
                rotateX: 2,
                rotateY: 4,
                z: 20,
               
              }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-40 transition-opacity duration-400`} />
              {activeSection === option.name && (
                <>
                  <div className="sparkle" style={{ left: '10%', top: '20%' }} />
                  <div className="sparkle" style={{ left: '85%', top: '15%' }} />
                  <div className="sparkle" style={{ left: '15%', top: '85%' }} />
                  <div className="sparkle" style={{ left: '90%', top: '40%' }} />
                  <div className="sparkle" style={{ left: '10%', top: '60%' }} />
                </>
              )}
              <div className="relative flex flex-col items-center ">
                <motion.div
                  className="mb-3"
                  whileHover={{ scale: 1.4, rotate: 15, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {option.icon}
                </motion.div>
                <span
                  className={`text-base font-semibold text-center ${
                    activeSection === option.name ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: "'Inter', 'Poppins', sans-serif", letterSpacing: '0.05em' }}
                >
                  {option.name}
                </span>
              </div>
              {activeSection === option.name && (
                <motion.div
                  className="absolute inset-0 border-4 border-[#f472b6] rounded-2xl"
                  animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {activeSection && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, scale: 1.02 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="p-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.2)] border-2 border-transparent holographic"
            >
              <h2
                className="text-3xl font-extrabold mb-6 flex items-center text-gray-900"
                style={{ fontFamily: "'Inter', 'Poppins', sans-serif", textShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
              >
                {settingsOptions.find((opt) => opt.name === activeSection)?.icon}
                <span className="ml-4 ">{activeSection}</span>
              </h2>
              <div className="text-gray-700 space-y-6" style={{ fontFamily: "'Inter', 'Poppins', sans-serif", lineHeight: '1.7' }}>
                {activeSection === 'Admission Open' && (
                  <>
                    <p>Manage admission open statuses and configurations for the upcoming academic year.</p>
                    <motion.button
                      className="px-8 py-3 bg-gradient-to-r from-[#9333ea] to-[#f472b6] text-white rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all duration-400"
                      whileHover={{ scale: 1.06, y: -3 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      Configure Admissions
                    </motion.button>
                  </>
                )}
                {activeSection === 'Admission Opened Details' && (
                  <p>View and edit details of currently opened admissions, including applicant data and status updates.</p>
                )}
                {activeSection === 'Add New LSC' && (
                  <AddLSC />
                )}
                {activeSection === 'Add New Course' && (
                   <AddCourse />
                )}
                {activeSection === 'Add Counsellor' && (
                  <p>Add a new counsellor to guide students, including their contact details and specialization.</p>
                )}
                {activeSection === 'Add Attendance' && (
                  <p>Record and manage student attendance records for various courses and semesters.</p>
                )}
                {activeSection === 'Add Assignment Mark' && (
                  <p>Input and update assignment marks for students, including grading and feedback.</p>
                )}
                {activeSection === 'Add Internal & Model Mark' && (
                  <p>Manage internal and model exam marks for students, with options to upload and verify scores.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeSection && (
          <div className="flex justify-between mt-10">
            <motion.button
              onClick={handlePrevious}
              disabled={progress <= 1}
              className={`px-8 py-3 rounded-xl border-2 ${
                progress <= 1
                  ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#9333ea] to-[#f472b6] text-white border-[#f472b6] shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]'
              } transition-all duration-400`}
              whileHover={{ scale: progress <= 1 ? 1 : 1.06, y: progress <= 1 ? 0 : -3 }}
              whileTap={{ scale: progress <= 1 ? 1 : 0.94 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={progress >= settingsOptions.length}
              className={`px-8 py-3 rounded-xl border-2 ${
                progress >= settingsOptions.length
                  ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#9333ea] to-[#f472b6] text-white border-[#f472b6] shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]'
              } transition-all duration-400`}
              whileHover={{ scale: progress >= settingsOptions.length ? 1 : 1.06, y: progress >= settingsOptions.length ? 0 : -3 }}
              whileTap={{ scale: progress >= settingsOptions.length ? 1 : 0.94 }}
            >
              Next
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;