import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Add this import
import axios from 'axios';
import { FunnelIcon, AcademicCapIcon, BookOpenIcon, LanguageIcon, CalendarIcon, EyeIcon, XMarkIcon, ChevronUpDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ApplicationVerification = () => {
  const navigate = useNavigate(); // Add navigate hook
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filters, setFilters] = useState({
    mode_of_study: '',
    programme_applied: '',
    course: '',
    medium: '',
    academic_year: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/applications/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }, // Add token
        });
        setApplications(response.data);
        setFilteredApps(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...applications].filter((app) => {
      return (
        (!filters.mode_of_study || app.mode_of_study.toLowerCase().includes(filters.mode_of_study.toLowerCase())) &&
        (!filters.programme_applied || app.programme_applied.toLowerCase().includes(filters.programme_applied.toLowerCase())) &&
        (!filters.course || app.course.toLowerCase().includes(filters.course.toLowerCase())) &&
        (!filters.medium || app.medium.toLowerCase().includes(filters.medium.toLowerCase())) &&
        (!filters.academic_year || app.academic_year.toLowerCase().includes(filters.academic_year.toLowerCase()))
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toLowerCase() || '';
        const bValue = b[sortConfig.key]?.toLowerCase() || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredApps(filtered);
  }, [filters, applications, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      mode_of_study: '',
      programme_applied: '',
      course: '',
      medium: '',
      academic_year: '',
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleViewMore = (email) => {
    console.log('Navigating to student details with email:', email); // Debug
    navigate(`/student-details?email=${encodeURIComponent(email)}`); // Navigate with email
  };

  const handleRefresh = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/applications/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setApplications(response.data);
      setFilteredApps(response.data);
    } catch (error) {
      console.error('Error refreshing applications:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white font-poppins relative overflow-hidden">
  <div className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 lg:p-10 max-w-[100vw] box-border app-container">
        {/* Particle Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <style jsx>{`
            .particles {
              position: absolute;
              width: 100%;
              height: 100%;
              background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='30' cy='30' r='0.8' fill='rgba(167, 139, 250, 0.4)'/%3E%3Ccircle cx='70' cy='80' r='0.6' fill='rgba(124, 58, 237, 0.5)'/%3E%3Ccircle cx='150' cy='40' r='0.7' fill='rgba(139, 92, 246, 0.4)'/%3E%3Ccircle cx='100' cy='170' r='0.6' fill='rgba(167, 139, 250, 0.3)'/%3E%3Ccircle cx='50' cy='120' r='0.8' fill='rgba(124, 58, 237, 0.4)'/%3E%3C/svg%3E");
              background-size: 200px 200px;
              animation: particleMove 20s linear infinite;
              opacity: 0.3;
            }
            @keyframes particleMove {
              0% { transform: translate(0, 0); }
              100% { transform: translate(50px, 50px); }
            }
            .blink-particle {
              animation: blink 1.5s infinite alternate ease-in-out;
            }
            @keyframes blink {
              0% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 0.8; transform: scale(1.2); }
              100% { opacity: 0.2; transform: scale(0.8); }
            }
          `}</style>
          <div className="particles" />
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="0.5" fill="#A78BFA" className="blink-particle" />
              <circle cx="80" cy="80" r="0.6" fill="#7C3AED" className="blink-particle" />
              <circle cx="40" cy="10" r="0.4" fill="#D8B4FE" className="blink-particle" />
              <circle cx="90" cy="30" r="0.5" fill="#A78BFA" className="blink-particle" />
              <circle cx="10" cy="70" r="0.4" fill="#7C3AED" className="blink-particle" />
            </svg>
          </motion.div>
        </div>

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] mb-8 tracking-tight"
        >
          Application Verification
        </motion.h1>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-8 sticky top-0 z-20 border-2 border-[#7C3AED]/30 w-full max-w-full box-border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'mode_of_study', placeholder: 'Mode of Study', icon: FunnelIcon },
              { name: 'programme_applied', placeholder: 'Programme', icon: AcademicCapIcon },
              { name: 'course', placeholder: 'Course', icon: BookOpenIcon },
              { name: 'medium', placeholder: 'Medium', icon: LanguageIcon },
              { name: 'academic_year', placeholder: 'Academic Year', icon: CalendarIcon },
            ].map((field) => (
              <motion.div
                key={field.name}
                className="relative group"
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)' }}
                transition={{ duration: 0.3 }}
              >
                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7C3AED]" />
                <input
                  type="text"
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-[#7C3AED]/40 rounded-xl text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all duration-300 hover:shadow-lg placeholder-gray-400"
                />
                <motion.div
                  className="absolute -top-3 -right-2 hidden group-hover:block bg-[#7C3AED] text-white text-xs rounded-full px-2 py-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Filter
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-bold text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg"
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Clear Filters
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-bold text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-[#7C3AED]/30 w-full max-w-full box-border"
        >
          <div className="overflow-x-auto max-h-[calc(100vh-400px)]">
            <table className="w-full table-auto border-collapse">
              <thead className="sticky top-0 bg-gradient-to-r from-[#6B46C1] to-[#4C2A85] text-white shadow-lg z-10">
                <tr>
                  {[
                    { label: 'Name', key: 'name_initial', icon: ChevronUpDownIcon },
                    { label: 'Email', key: 'email', icon: ChevronUpDownIcon },
                    { label: 'Mode of Study', key: 'mode_of_study', icon: ChevronUpDownIcon },
                    { label: 'Programme', key: 'programme_applied', icon: ChevronUpDownIcon },
                    { label: 'Course', key: 'course', icon: ChevronUpDownIcon },
                    { label: 'Medium', key: 'medium', icon: ChevronUpDownIcon },
                    { label: 'Academic Year', key: 'academic_year', icon: ChevronUpDownIcon },
                    { label: 'Action', key: null, icon: null },
                  ].map((header) => (
                    <th
                      key={header.label}
                      onClick={() => header.key && handleSort(header.key)}
                      className={`min-w-[120px] px-3 sm:px-4 py-3 text-left text-base font-bold tracking-wide uppercase ${header.key ? 'cursor-pointer hover:bg-[#7C3AED]/80' : ''} transition-all duration-300`}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {header.icon && (
                          <header.icon className={`ml-2 h-4 w-4 ${sortConfig.key === header.key ? 'text-[#A78BFA]' : 'text-white'}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredApps.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`border-b-2 border-[#7C3AED]/20 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-gradient-to-r hover:from-[#A78BFA]/10 hover:to-[#7C3AED]/10 hover:shadow-lg rounded-xl`}
                    >
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base rounded-l-xl">{app.name_initial}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base">{app.email}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base">{app.mode_of_study}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base">{app.programme_applied}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base">{app.course}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base">{app.medium}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 text-gray-800 font-medium text-base">{app.academic_year}</td>
                      <td className="min-w-[120px] px-3 sm:px-4 py-3 rounded-r-xl">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewMore(app.email)}
                          className="flex items-center px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-bold text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg"
                        >
                          <EyeIcon className="h-5 w-5 mr-2" />
                          View More
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ApplicationVerification;