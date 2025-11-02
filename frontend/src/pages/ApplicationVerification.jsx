import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FunnelIcon, AcademicCapIcon, BookOpenIcon, LanguageIcon, CalendarIcon, 
  EyeIcon, XMarkIcon, ChevronUpDownIcon, ArrowPathIcon, 
  TableCellsIcon, Squares2X2Icon, UserIcon, EnvelopeIcon
} from '@heroicons/react/24/outline';

const ApplicationVerification = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-poppins relative overflow-hidden">
      <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10 box-border app-container">
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

        {/* Header with View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8"
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] tracking-tight leading-tight">
            Application Verification
          </h1>
          
          {/* View Toggle Buttons */}
          <div className="flex gap-2 xs:gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('table')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 xs:px-5 py-3 rounded-xl font-semibold text-sm xs:text-base transition-all duration-300 shadow-lg ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white'
                  : 'bg-white/80 text-[#7C3AED] hover:bg-white border-2 border-[#7C3AED]/30'
              }`}
            >
              <TableCellsIcon className="h-5 w-5 xs:h-6 xs:w-6" />
              <span className="whitespace-nowrap">Table View</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('card')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 xs:px-5 py-3 rounded-xl font-semibold text-sm xs:text-base transition-all duration-300 shadow-lg ${
                viewMode === 'card'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white'
                  : 'bg-white/80 text-[#7C3AED] hover:bg-white border-2 border-[#7C3AED]/30'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5 xs:h-6 xs:w-6" />
              <span className="whitespace-nowrap">Card View</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-xl rounded-2xl shadow-2xl p-5 xs:p-6 mb-8 sticky top-14 lg:top-0 z-20 border-2 border-[#7C3AED]/30 w-full max-w-full box-border"
        >
          <div className="flex items-center gap-2 xs:gap-3 mb-5">
            <FunnelIcon className="h-5 w-5 xs:h-6 xs:w-6 text-[#7C3AED] flex-shrink-0" />
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">Filter Applications</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 xs:gap-4">
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
                <field.icon className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-[#7C3AED] flex-shrink-0" />
                <input
                  type="text"
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  placeholder={field.placeholder}
                  className="w-full pl-10 xs:pl-12 pr-3 xs:pr-4 py-3 xs:py-3.5 bg-white/50 border-2 border-[#7C3AED]/40 rounded-xl text-sm xs:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all duration-300 hover:shadow-lg placeholder-gray-400 font-medium"
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
          <div className="mt-5 xs:mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 xs:gap-4">
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-4 xs:px-5 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-semibold text-sm xs:text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg"
              >
                <XMarkIcon className="h-5 w-5 flex-shrink-0" />
                <span>Clear Filters</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-4 xs:px-5 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-semibold text-sm xs:text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg"
              >
                <ArrowPathIcon className="h-5 w-5 flex-shrink-0" />
                <span>Refresh</span>
              </motion.button>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 xs:gap-3 bg-gradient-to-r from-[#7C3AED]/10 to-[#A78BFA]/10 px-4 xs:px-5 py-3 rounded-xl border-2 border-[#7C3AED]/20">
              <UserIcon className="h-5 w-5 xs:h-6 xs:w-6 text-[#7C3AED] flex-shrink-0" />
              <span className="text-sm xs:text-base font-semibold text-gray-700">
                Total: <span className="text-[#7C3AED] text-lg xs:text-xl font-bold ml-1">{filteredApps.length}</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Table/Card View Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-[#7C3AED]/30 w-full max-w-full box-border"
        >
          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto max-h-[calc(100vh-400px)] rounded-xl">
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
                      className={`min-w-[140px] px-4 sm:px-5 py-4 text-left text-sm sm:text-base font-bold tracking-wide uppercase ${header.key ? 'cursor-pointer hover:bg-[#7C3AED]/80' : ''} transition-all duration-300`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">{header.label}</span>
                        {header.icon && (
                          <header.icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${sortConfig.key === header.key ? 'text-[#A78BFA]' : 'text-white'}`} />
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
                      } hover:bg-gradient-to-r hover:from-[#A78BFA]/10 hover:to-[#7C3AED]/10 hover:shadow-lg`}
                    >
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-800 font-semibold text-sm sm:text-base rounded-l-xl">{app.name_initial}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-700 font-medium text-sm sm:text-base">{app.email}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-700 font-medium text-sm sm:text-base">{app.mode_of_study}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-700 font-medium text-sm sm:text-base">{app.programme_applied}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-700 font-medium text-sm sm:text-base">{app.course}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-700 font-medium text-sm sm:text-base">{app.medium}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 text-gray-700 font-medium text-sm sm:text-base">{app.academic_year}</td>
                      <td className="min-w-[140px] px-4 sm:px-5 py-4 rounded-r-xl">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewMore(app.email)}
                          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-semibold text-sm sm:text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg whitespace-nowrap"
                        >
                          <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span>View More</span>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)' }}
                    className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-5 xs:p-6 border-2 border-[#7C3AED]/20 shadow-lg hover:border-[#7C3AED]/50 transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-14 h-14 xs:w-16 xs:h-16 flex-shrink-0 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white font-bold text-xl xs:text-2xl shadow-lg">
                        {app.name_initial?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base xs:text-lg font-bold text-gray-800 truncate mb-1">{app.name_initial}</h3>
                        <p className="text-xs xs:text-sm text-gray-500 flex items-center gap-1.5 truncate">
                          <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{app.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-3 xs:space-y-3.5 mb-5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs xs:text-sm text-gray-600 font-medium">Mode of Study</span>
                          <p className="text-sm xs:text-base text-gray-800 font-semibold truncate">{app.mode_of_study}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs xs:text-sm text-gray-600 font-medium">Programme</span>
                          <p className="text-sm xs:text-base text-gray-800 font-semibold truncate">{app.programme_applied}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs xs:text-sm text-gray-600 font-medium">Course</span>
                          <p className="text-sm xs:text-base text-gray-800 font-semibold truncate">{app.course}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs xs:text-sm text-gray-600 font-medium">Medium</span>
                          <p className="text-sm xs:text-base text-gray-800 font-semibold">{app.medium}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs xs:text-sm text-gray-600 font-medium">Academic Year</span>
                          <p className="text-sm xs:text-base text-gray-800 font-semibold">{app.academic_year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleViewMore(app.email)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 xs:py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-semibold text-sm xs:text-base hover:from-[#8B5CF6] hover:to-[#6D28D9] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <EyeIcon className="h-5 w-5 flex-shrink-0" />
                      <span>View Full Details</span>
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
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