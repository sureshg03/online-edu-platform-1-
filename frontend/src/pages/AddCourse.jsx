import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Trash2, Edit, AlertTriangle, XCircle, ChevronLeft, ChevronRight, BookOpen, PlusCircle, List, RefreshCw, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [courseShortCode, setCourseShortCode] = useState('');
  const [courseFullName, setCourseFullName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [numSemesters, setNumSemesters] = useState('');
  const [numYears, setNumYears] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [degree, setDegree] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(3);
  const [pageInput, setPageInput] = useState('1');
  const [filterCourseShortCode, setFilterCourseShortCode] = useState('');
  const [filterCourseFullName, setFilterCourseFullName] = useState('');
  const [filterCourseCode, setFilterCourseCode] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch all courses and verify authentication
  const fetchCourses = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/list/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = response.data.data || [];
      setCourses(data);
      setFilteredCourses(data);
      setGeneralError('');
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Fetch Courses error:', err);
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('/login');
      } else {
        setGeneralError('Failed to fetch Courses.');
        toast.error('Failed to fetch Courses.', { position: 'top-right' });
        setIsAuthenticated(true);
      }
    }
  };

  // Handle form submission with field-specific error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    let token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      toast.error('Please log in to continue.', { position: 'top-right' });
      navigate('/login');
      return;
    }

    try {
      const data = {
        course_short_code: courseShortCode.trim(),
        course_full_name: courseFullName.trim(),
        branch_name: branchName.trim(),
        num_semesters: parseInt(numSemesters, 10),
        num_years: parseInt(numYears, 10),
        course_code: courseCode.trim(),
        degree: degree.trim(),
      };
      const headers = { Authorization: `Token ${token}` };
      let response;
      if (editingCourse) {
        response = await axios.put(`${API_BASE_URL}/courses/${editingCourse.id}/update/`, data, { headers });
        toast.success('Course updated successfully!', { position: 'top-right' });
        setEditingCourse(null);
      } else {
        response = await axios.post(`${API_BASE_URL}/courses/create/`, data, { headers });
        toast.success('Course added successfully!', { position: 'top-right' });
      }
      setCourseShortCode('');
      setCourseFullName('');
      setBranchName('');
      setNumSemesters('');
      setNumYears('');
      setCourseCode('');
      setDegree('');
      await fetchCourses(token);
      setCurrentPage(1);
      setPageInput('1');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data) {
        const errors = err.response.data;
        const newFieldErrors = {};
        Object.keys(errors).forEach((key) => {
          newFieldErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
        });
        setFieldErrors(newFieldErrors);
        toast.error('Please correct the errors in the form.', { position: 'top-right' });
      } else if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('/login');
      } else {
        setGeneralError('Failed to save Course. Please try again.');
        toast.error('Failed to save Course. Please try again.', { position: 'top-right' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit action
  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseShortCode(course.course_short_code);
    setCourseFullName(course.course_full_name);
    setBranchName(course.branch_name);
    setNumSemesters(course.num_semesters.toString());
    setNumYears(course.num_years.toString());
    setCourseCode(course.course_code);
    setDegree(course.degree);
    setFieldErrors({});
    setGeneralError('');
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      formRef.current.focus();
    }
  };

  // Handle single course deletion
  const handleDelete = async () => {
    try {
      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/courses/${courseToDelete.id}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      await fetchCourses(token);
      setShowDeleteModal(false);
      setCourseToDelete(null);
      toast.error('Course deleted successfully!', { position: 'top-right' });
      setPageInput(currentPage.toString());
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete Course.';
      setGeneralError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('/login');
      }
    }
  };

  // Handle deletion of all courses
  const handleDeleteAll = async () => {
    try {
      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/courses/delete-all/`, {
        headers: { Authorization: `Token ${token}` },
      });
      await fetchCourses(token);
      setShowDeleteAll(false);
      setCourseToDelete(null);
      toast.error('All Courses deleted successfully!', { position: 'top-right' });
      setCurrentPage(1);
      setPageInput('1');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete all Courses.';
      setGeneralError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('/login');
      }
    }
  };

  // Filter courses based on input
  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.course_short_code.toLowerCase().includes(filterCourseShortCode.toLowerCase()) &&
        course.course_full_name.toLowerCase().includes(filterCourseFullName.toLowerCase()) &&
        course.course_code.toLowerCase().includes(filterCourseCode.toLowerCase()) &&
        course.degree.toLowerCase().includes(filterDegree.toLowerCase())
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
    setPageInput('1');
  }, [filterCourseShortCode, filterCourseFullName, filterCourseCode, filterDegree, courses]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setTimeout(() => {
          token = localStorage.getItem('authToken') || localStorage.getItem('token');
          if (!token) {
            setIsAuthenticated(false);
            toast.error('Please log in to access this page.', { position: 'top-right' });
            navigate('/login');
          } else {
            fetchCourses(token);
          }
        }, 100);
      } else {
        fetchCourses(token);
      }
    };
    checkAuth();
  }, [navigate]);

  // Auto-suggestion data
  const uniqueShortCodes = [...new Set(courses.map((course) => course.course_short_code))];
  const uniqueFullNames = [...new Set(courses.map((course) => course.course_full_name))];
  const uniqueBranchNames = [...new Set(courses.map((course) => course.branch_name))];
  const uniqueCourseCodes = [...new Set(courses.map((course) => course.course_code))];
  const uniqueDegrees = [...new Set(courses.map((course) => course.degree))];

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInput(value);
    if (value === '') return;
    const pageNum = parseInt(value, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Render loading UI
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-100 p-8">
        <motion.div
          className="flex justify-center items-center text-gray-700 text-2xl font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RefreshCw className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
          Loading...
        </motion.div>
      </div>
    );
  }

  // Render unauthenticated UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl border border-gray-200 shadow-2xl text-center max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to log in to manage Courses.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] transition-all duration-300"
            aria-label="Go to login page"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden font-sans" style={{ overflowX: 'hidden' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Oleo+Script+Swash+Caps&family=Inter:wght@400;500;600&display=swap');

        
          .table-header {
            background: linear-gradient(90deg, rgb(163, 14, 201), rgb(83, 3, 158));
            color: white;
            position: relative;
            overflow: hidden;
          }
          .table-header th {
            padding: 1.5rem 1rem;
            font-size: 0.9rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            z-index: 1;
            white-space: nowrap;
          }
          .table-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
            animation: glow 8s infinite;
            pointer-events: none;
          }
          .table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            max-width: 100% !important;
            display: fixed !important;
            width: max-content !important ; /* Allow table to expand as needed */
            min-width: 100%  !important; /* Ensure it fills the container at minimum */
          }
          .table-wrapper::-webkit-scrollbar {
            height: 8px;
          }
          .table-wrapper::-webkit-scrollbar-track {
            background: rgba(99, 102, 241, 0.1);
            border-radius: 4px;
          }
          .table-wrapper::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, rgb(163, 14, 201), rgb(83, 3, 158));
            border-radius: 4px;
          }
          .table-wrapper::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, rgb(183, 34, 221), rgb(103, 23, 178));
          }
          table {
            width: auto; /* Allow table to size naturally based on content */
            min-width: 100%; /* Ensure it fills the wrapper at minimum */
            border-collapse: collapse;
            table-layout: fixed;
          }
          @keyframes glow {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(25%, 25%) scale(1.3); }
            100% { transform: translate(0, 0) scale(1); }
          }
          .table-row {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.85);
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
            position: relative;
            overflow: hidden;
          }
          .table-row:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(99, 102, 241, 0.3);
          }
          .table-row::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: 0.6s;
          }
          .table-row:hover::after {
            left: 100%;
          }
          .table-row td {
            font-size: 1rem;
            font-weight: 500;
            padding: 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .input-focus {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(99, 102, 241, 0.3);
            color: #1f2937;
            border-radius: 1rem;
            padding: 0.75rem 1rem;
          }
          .input-focus:focus {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
            border-color: #4f46e5;
            background: white;
          }
          .input-error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
          }
          .error-text {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
          .glow-container {
            position: relative;
            overflow: hidden;
            border-radius: 1.5rem;
          }
          .glow-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
            animation: glow 12s infinite;
            pointer-events: none;
          }
          .button-glow {
            position: relative;
            overflow: hidden;
            border-radius: 1rem;
          }
          .button-glow::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: 0.5s;
          }
          .button-glow:hover::after {
            left: 100%;
          }
          .pagination-input {
            width: 70px;
            text-align: center;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(99, 102, 241, 0.3);
            color: #1f2937;
            border-radius: 1rem;
            padding: 0.5rem;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          .pagination-input:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
            border-color: #4f46e5;
          }
          .highlight-card {
            animation: highlight 1.5s ease-out;
          }
          @keyframes highlight {
            0% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.7); }
            100% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
          }
          .filter-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 1.5rem;
            border: 1px solid blue;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
          }
          .filter-input {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(99, 102, 241, 0.3);
            color: #1f2937;
            border-radius: 1rem;
            padding: 0.75rem 2.4rem;
            font-size: 1rem;
            width: 100%;
          }
          .filter-input:focus {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
            border-color: #4f46e5;
            background: white;
            outline: none;
          }
          .filter-input::placeholder {
            color: #6b7280;
            font-weight: 500;
          }
          .filter-clear-btn {
            font-family: 'Poppins', sans-serif;
            color: blue;
            width: 180px;
            height: 60px;
            font-weight: 700;
            border-radius: 1rem;
            transition: all 0.3s ease;
          }
          .detail-modal {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(30px);
            border-radius: 2rem;
            border: 5px solid rgba(51, 3, 73, 0.93);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            overflow: hidden;
          }
          .detail-modal::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            animation: glow 10s infinite;
            pointer-events: none;
          }
          .close-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: linear-gradient(45deg, rgb(236, 13, 36), rgb(209, 4, 4));
            border-radius: 50%;
            padding: 0.2rem;
            box-shadow: 0 4px 12px rgba(255, 75, 92, 0.4);
            transition: all 0.3s ease;
          }
          .close-button:hover {
            transform: rotate(90deg);
            box-shadow: 0 6px 18px rgba(255, 75, 92, 0.6);
          }
          .detail-field {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 1rem;
            padding: 1rem;
            border: 1px solid rgba(99, 102, 241, 0.2);
            transition: all 0.3s ease;
          }
          .detail-field:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
        `}
      </style>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-12">
          <h1
            className="text-5xl font-extrabold text-gray-900"
            style={{
              fontFamily: "'Oleo Script Swash Caps', cursive",
              textShadow: '0 4px 12px rgba(0,0,0,0.1), 0 0 6px rgba(99,102,241,0.3)',
            }}
          >
            Course Management
          </h1>
          <motion.div whileHover={{ scale: 1.3, rotate: 20 }} whileTap={{ scale: 0.9 }}>
            <Building className="w-16 h-16 text-indigo-600" />
          </motion.div>
        </motion.div>

        {/* Form Card */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white backdrop-blur-xl p-10 rounded-3xl border border-teal-700 shadow-2xl mb-12 highlight-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            {editingCourse ? (
              <>
                <Edit className="w-6 h-6 mr-2 text-indigo-600" /> Update Course
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6 mr-2 text-indigo-600" /> Add New Course
              </>
            )}
          </h2>
          {generalError && (
            <motion.div
              className="flex items-center bg-red-100 text-red-600 p-4 rounded-xl mb-6 border border-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              <p>{generalError}</p>
            </motion.div>
          )}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="courseShortCode" className="block text-xl font-semibold text-gray-700 mb-2">
                Course Short Code
              </label>
              <motion.input
                id="courseShortCode"
                type="text"
                value={courseShortCode}
                onChange={(e) => setCourseShortCode(e.target.value)}
                placeholder="Course Short Code"
                required
                list="shortCodeSuggestions"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.course_short_code ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.course_short_code ? 'courseShortCode-error' : undefined}
              />
              <datalist id="shortCodeSuggestions">
                {uniqueShortCodes.map((code) => (
                  <option key={code} value={code} />
                ))}
              </datalist>
              {fieldErrors.course_short_code && (
                <p id="courseShortCode-error" className="error-text">
                  {fieldErrors.course_short_code}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="courseFullName" className="block text-xl font-semibold text-gray-700 mb-2">
                Course Full Name
              </label>
              <motion.input
                id="courseFullName"
                type="text"
                value={courseFullName}
                onChange={(e) => setCourseFullName(e.target.value)}
                placeholder="Course Full Name"
                required
                list="fullNameSuggestions"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.course_full_name ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.course_full_name ? 'courseFullName-error' : undefined}
              />
              <datalist id="fullNameSuggestions">
                {uniqueFullNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {fieldErrors.course_full_name && (
                <p id="courseFullName-error" className="error-text">
                  {fieldErrors.course_full_name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="branchName" className="block text-xl font-semibold text-gray-700 mb-2">
                Branch Name
              </label>
              <motion.input
                id="branchName"
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Branch Name"
                required
                list="branchNameSuggestions"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.branch_name ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.branch_name ? 'branchName-error' : undefined}
              />
              <datalist id="branchNameSuggestions">
                {uniqueBranchNames.map((branch) => (
                  <option key={branch} value={branch} />
                ))}
              </datalist>
              {fieldErrors.branch_name && (
                <p id="branchName-error" className="error-text">
                  {fieldErrors.branch_name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="numSemesters" className="block text-xl font-semibold text-gray-700 mb-2">
                Number of Semesters
              </label>
              <motion.input
                id="numSemesters"
                type="number"
                value={numSemesters}
                onChange={(e) => setNumSemesters(e.target.value)}
                placeholder="No. of Semesters"
                required
                min="1"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.num_semesters ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.num_semesters ? 'numSemesters-error' : undefined}
              />
              {fieldErrors.num_semesters && (
                <p id="numSemesters-error" className="error-text">
                  {fieldErrors.num_semesters}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="numYears" className="block text-xl font-semibold text-gray-700 mb-2">
                Number of Years
              </label>
              <motion.input
                id="numYears"
                type="number"
                value={numYears}
                onChange={(e) => setNumYears(e.target.value)}
                placeholder="No. of Years"
                required
                min="1"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.num_years ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.num_years ? 'numYears-error' : undefined}
              />
              {fieldErrors.num_years && (
                <p id="numYears-error" className="error-text">
                  {fieldErrors.num_years}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="courseCode" className="block text-xl font-semibold text-gray-700 mb-2">
                Course Code
              </label>
              <motion.input
                id="courseCode"
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Course Code"
                required
                list="courseCodeSuggestions"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.course_code ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.course_code ? 'courseCode-error' : undefined}
              />
              <datalist id="courseCodeSuggestions">
                {uniqueCourseCodes.map((code) => (
                  <option key={code} value={code} />
                ))}
              </datalist>
              {fieldErrors.course_code && (
                <p id="courseCode-error" className="error-text">
                  {fieldErrors.course_code}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="degree" className="block text-xl font-semibold text-gray-700 mb-2">
                Degree
              </label>
              <motion.input
                id="degree"
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Degree"
                required
                list="degreeSuggestions"
                className={`input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none ${fieldErrors.degree ? 'input-error' : ''}`}
                whileFocus={{ scale: 1.02 }}
                aria-describedby={fieldErrors.degree ? 'degree-error' : undefined}
              />
              <datalist id="degreeSuggestions">
                {uniqueDegrees.map((deg) => (
                  <option key={deg} value={deg} />
                ))}
              </datalist>
              {fieldErrors.degree && (
                <p id="degree-error" className="error-text">
                  {fieldErrors.degree}
                </p>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] transition-all duration-300 button-glow ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.06, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.94 }}
                aria-label={editingCourse ? 'Update Course' : 'Add Course'}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : editingCourse ? (
                  <span className="flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Update Course
                  </span>
                ) : (
                  <span className="flex items-center py-1">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Course
                  </span>
                )}
              </motion.button>
              {editingCourse && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setCourseShortCode('');
                    setCourseFullName('');
                    setBranchName('');
                    setNumSemesters('');
                    setNumYears('');
                    setCourseCode('');
                    setDegree('');
                    setFieldErrors({});
                    setGeneralError('');
                  }}
                  className="px-8 py-3 rounded-full font-semibold text-red-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300 button-glow"
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Cancel Editing"
                >
                  <span className="flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Cancel
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.form>

        {/* Filter Section */}
        <motion.div
          className="filter-container mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Search className="w-6 h-6 mr-2 text-indigo-600" />
            Filter Courses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-7 items-end">
            <div className="relative">
              <label htmlFor="filterShortCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Short Code
              </label>
              <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="filterShortCode"
                  type="text"
                  value={filterCourseShortCode}
                  onChange={(e) => setFilterCourseShortCode(e.target.value)}
                  placeholder="Search Short Code..."
                  className="filter-input pl-10"
                  list="filterShortCodeSuggestions"
                  aria-label="Filter by Course Short Code"
                />
                <datalist id="filterShortCodeSuggestions">
                  {uniqueShortCodes.map((code) => (
                    <option key={code} value={code} />
                  ))}
                </datalist>
              </motion.div>
            </div>
            <div className="relative">
              <label htmlFor="filterFullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Full Name
              </label>
              <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="filterFullName"
                  type="text"
                  value={filterCourseFullName}
                  onChange={(e) => setFilterCourseFullName(e.target.value)}
                  placeholder="Search Full Name..."
                  className="filter-input pl-10"
                  list="filterFullNameSuggestions"
                  aria-label="Filter by Course Full Name"
                />
                <datalist id="filterFullNameSuggestions">
                  {uniqueFullNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </motion.div>
            </div>
            <div className="relative">
              <label htmlFor="filterCourseCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Course Code
              </label>
              <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="filterCourseCode"
                  type="text"
                  value={filterCourseCode}
                  onChange={(e) => setFilterCourseCode(e.target.value)}
                  placeholder="Search Course Code..."
                  className="filter-input pl-10"
                  list="filterCourseCodeSuggestions"
                  aria-label="Filter by Course Code"
                />
                <datalist id="filterCourseCodeSuggestions">
                  {uniqueCourseCodes.map((code) => (
                    <option key={code} value={code} />
                  ))}
                </datalist>
              </motion.div>
            </div>
            <div className="relative">
              <label htmlFor="filterDegree" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Degree
              </label>
              <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="filterDegree"
                  type="text"
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  placeholder="Search Degree..."
                  className="filter-input pl-10"
                  list="filterDegreeSuggestions"
                  aria-label="Filter by Degree"
                />
                <datalist id="filterDegreeSuggestions">
                  {uniqueDegrees.map((deg) => (
                    <option key={deg} value={deg} />
                  ))}
                </datalist>
              </motion.div>
            </div>
            <div className="flex justify-end">
              <motion.button
                onClick={() => {
                  setFilterCourseShortCode('');
                  setFilterCourseFullName('');
                  setFilterCourseCode('');
                  setFilterDegree('');
                }}
                className="filter-clear-btn flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95}}
                aria-label="Clear Filters"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Clear Filters
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Course Table */}
        <motion.div
          className="table-container p-10 border border-purple-700"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <List className="w-6 h-6 mr-2 text-indigo-600" />
              Course List
            </h2>
            {filteredCourses.length > 0 && (
              <motion.button
                onClick={() => setShowDeleteAll(true)}
                className="px-6 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all duration-300 button-glow flex items-center"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Delete All Courses"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete All
              </motion.button>
            )}
          </div>
          {filteredCourses.length === 0 ? (
            <motion.div
              className="text-gray-600 text-center py-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold">No Courses found.</p>
            </motion.div>
          ) : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead className="table-header">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[15%]">Short Code</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[20%]">Full Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[15%]">Branch</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[10%]">Semesters</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[10%]">Years</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[15%]">Course Code</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[10%]">Degree</th>
                      <th className="px-6 py-4 text-left text-sm font-bold w-[15%]">Created At</th>
                      <th className="px-6 py-4 text-right text-sm font-bold w-[10%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCourses.map((course, index) => (
                      <motion.tr
                        key={course.id}
                        className="table-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4 text-base font-medium text-gray-900 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2" />
                          {course.course_short_code}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {course.course_full_name}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {course.branch_name}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {course.num_semesters}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {course.num_years}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {course.course_code}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {course.degree}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-gray-600">
                          {new Date(course.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium flex justify-end space-x-3">
                          <motion.button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDetailModal(true);
                            }}
                            className="text-teal-600 hover:text-teal-800"
                            whileHover={{ scale: 1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Details"
                            aria-label={`View details for ${course.course_short_code}`}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            onClick={() => handleEdit(course)}
                            className="text-indigo-600 hover:text-indigo-800"
                            whileHover={{ scale: 1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Course"
                            aria-label={`Edit ${course.course_short_code}`}
                          >
                            <Edit className="w-6 h-6" />
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              setCourseToDelete(course);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                            whileHover={{ scale: 1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete Course"
                            aria-label={`Delete ${course.course_short_code}`}
                          >
                            <Trash2 className="w-6 h-6" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <motion.button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-3 rounded-full text-white button-glow ${
                      currentPage === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-[0_0_15px_rgba(99,102,241,0.7)]'
                    }`}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <input
                    type="text"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    className="pagination-input"
                    placeholder={currentPage.toString()}
                    aria-label={`Current page, enter page number between 1 and ${totalPages}`}
                  />
                  <motion.button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-3 rounded-full text-white button-glow ${
                      currentPage === totalPages
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-[0_0_15px_rgba(99,102,241,0.7)]'
                    }`}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                  <span className="text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* View Details Modal */}
        <AnimatePresence>
          {showDetailModal && selectedCourse && (
            <motion.div
              className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <motion.div
                className="detail-modal"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <motion.button
                  onClick={() => setShowDetailModal(false)}
                  className="close-button"
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close Details Modal"
                >
                  <XCircle className="w-7 h-7 text-white" />
                </motion.button>
                <div className="flex items-center mb-8">
                  <motion.div
                    className="detail-icon"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BookOpen className="w-8 h-8 text-black" />
                  </motion.div>
                  <h3
                    className="text-3xl font-extrabold text-gray-900 ml-4"
                    style={{ fontFamily: "'Poppins', sans-serif", textShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                  >
                    Course Details
                  </h3>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Course Short Code', value: selectedCourse.course_short_code, icon: Search },
                    { label: 'Course Full Name', value: selectedCourse.course_full_name, icon: Building },
                    { label: 'Branch Name', value: selectedCourse.branch_name, icon: Building },
                    { label: 'Number of Semesters', value: selectedCourse.num_semesters, icon: Search },
                    { label: 'Number of Years', value: selectedCourse.num_years, icon: Search },
                    { label: 'Course Code', value: selectedCourse.course_code, icon: Search },
                    { label: 'Degree', value: selectedCourse.degree, icon: Search },
                  ].map((field) => (
                    <motion.div key={field.label} className="detail-field" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                      <div className="flex items-center">
                        <motion.div className="detail-icon" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                          <field.icon className="w-6 h-6 text-black" />
                        </motion.div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {field.label}
                          </p>
                          <p className="text-xl font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {field.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-xl p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-200"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Delete Course</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete Course <span className="font-semibold">{courseToDelete?.course_short_code}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-2 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cancel Deletion"
                  >
                    <span className="flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Delete ${courseToDelete?.course_short_code}`}
                  >
                    <span className="flex items-center">
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete All Confirmation Modal */}
        <AnimatePresence>
          {showDeleteAll && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-xl p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-200"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50}}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Delete All Courses</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold">all Courses</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setShowDeleteAll(false)}
                    className="px-6 py-2 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cancel Deletion of All Courses"
                  >
                    <span className="flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleDeleteAll}
                    className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95}}
                    aria-label="Delete All Courses"
                  >
                    <span className="flex items-center">
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete All
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AddCourse;