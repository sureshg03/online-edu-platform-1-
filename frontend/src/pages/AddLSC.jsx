import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Trash2, Edit, AlertTriangle, XCircle, ChevronLeft, ChevronRight, PlusCircle, List, RefreshCw, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const AddLSC = () => {
  const [lscCode, setLscCode] = useState('');
  const [centreName, setCentreName] = useState('');
  const [lscs, setLscs] = useState([]);
  const [filteredLscs, setFilteredLscs] = useState([]);
  const [editingLsc, setEditingLsc] = useState(null);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [lscToDelete, setLscToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(3);
  const [pageInput, setPageInput] = useState('1');
  const [filterLscCode, setFilterLscCode] = useState('');
  const [filterCentreName, setFilterCentreName] = useState('');
  const navigate = useNavigate();
  const formRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch all LSCs and verify authentication
  const fetchLSCs = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lsc/list/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = response.data.data || [];
      setLscs(data);
      setFilteredLscs(data);
      setError('');
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Fetch LSCs error:', err);
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('/login');
      } else {
        setError('Failed to fetch Learning Support Centers.');
        toast.error('Failed to fetch Learning Support Centers.', { position: 'top-right' });
        setIsAuthenticated(true);
      }
    }
  };

    {/* State for View Details Modal */}
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLsc, setSelectedLsc] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      toast.error('Please log in to continue.', { position: 'top-right' });
      navigate('/login');
      return;
    }

    try {
      const data = { lsc_code: lscCode.trim(), centre_name: centreName.trim() };
      const headers = { Authorization: `Token ${token}` };
      let response;
      if (editingLsc) {
        response = await axios.put(`${API_BASE_URL}/lsc/${editingLsc.id}/update/`, data, { headers });
        toast.success('LSC updated successfully!', { position: 'top-right' });
        setEditingLsc(null);
      } else {
        response = await axios.post(`${API_BASE_URL}/lsc/create/`, data, { headers });
        toast.success('LSC added successfully!', { position: 'top-right' });
      }
      setLscCode('');
      setCentreName('');
      await fetchLSCs(token);
      setCurrentPage(1);
      setPageInput('1');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.lsc_code?.[0] ||
        'Failed to save LSC. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit action
  const handleEdit = (lsc) => {
    setEditingLsc(lsc);
    setLscCode(lsc.lsc_code);
    setCentreName(lsc.centre_name);
    setError('');
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      formRef.current.focus();
    }
  };

  // Handle single LSC deletion
  const handleDelete = async () => {
    try {
      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/lsc/${lscToDelete.id}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      await fetchLSCs(token);
      setShowDeleteModal(false);
      setLscToDelete(null);
      toast.error('LSC deleted successfully!', { position: 'top-right' });
      setPageInput(currentPage.toString());
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete LSC.';
      setError(errorMsg);
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

  // Handle deletion of all LSCs
  const handleDeleteAll = async () => {
    try {
      let token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/lsc/delete-all/`, {
        headers: { Authorization: `Token ${token}` },
      });
      await fetchLSCs(token);
      setShowDeleteAll(false);
      setLscToDelete(null);
      toast.error('All LSCs deleted successfully!', { position: 'top-right' });
      setCurrentPage(1);
      setPageInput('1');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete all LSCs.';
      setError(errorMsg);
      toast.error(errorMsg, { position: 'top-right' });
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.', { position: 'top-right' });
        navigate('//login');
      }
    }
  };

  // Filter LSCs based on input
  useEffect(() => {
    const filtered = lscs.filter(
      (lsc) =>
        lsc.lsc_code.toLowerCase().includes(filterLscCode.toLowerCase()) &&
        lsc.centre_name.toLowerCase().includes(filterCentreName.toLowerCase())
    );
    setFilteredLscs(filtered);
    setCurrentPage(1);
    setPageInput('1');
  }, [filterLscCode, filterCentreName, lscs]);

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
            fetchLSCs(token);
          }
        }, 100);
      } else {
        fetchLSCs(token);
      }
    };
    checkAuth();
  }, [navigate]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLSCs = filteredLscs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredLscs.length / rowsPerPage);

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
      <div className="min-h-screen flex items-center justify-center  p-8">
        <motion.div
          className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl border border-gray-200 shadow-2xl text-center max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to log in to manage Learning Support Centers.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] transition-all duration-300"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden font-sans">
      <style>
        {`
          .table-container {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .table-header {
            background: linear-gradient(90deg, rgb(163, 14, 201), rgb(83, 3, 158));
            color: white;
            position: relative;
            overflow: hidden;
          }
          .table-header th {
            padding: 1.5rem 2rem;
            font-size: 0.9rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            z-index: 1;
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
          .table-wrapper table {
            width: max-content;
            min-width: 100%;
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
            border:1px solid blue ;
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
          fontFamily: "'Poppins', sans-serif"
            color:blue !important;
            width:150px;
            height:60px;
          
            font-weight: bolder;
            border-radius: 1rem;
            padding: 0.8rem 1rem;
            transition: all 0.3s ease;
          }
            .detail-modal {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter:/temp/ blur(30px);
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
        background: linear-gradient(45deg,rgb(236, 13, 36),rgb(209, 4, 4));
        border-radius: 50%;
        padding: 0.2rem;
        box-shadow: 0 4px 12px rgba(255, 75, 92, 0.4);
        transition: all 0.3s ease;
      }
      .close-button:hover {
        transform: srotate(90deg);
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
        className="max-w-9xl mx-auto"
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
            Learning Support Centers
          </h1>
          <motion.div whileHover={{ scale: 1.3, rotate: 20 }} whileTap={{ scale: 0.9 }}>
            <Building className="w-16 h-16 text-indigo-600" />
          </motion.div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          ref={formRef}
          tabIndex={-1}
          className="bg-white backdrop-blur-xl p-10 rounded-3xl border border-teal-700 shadow-2xl mb-12 highlight-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            {editingLsc ? (
              <>
                <Edit className="w-6 h-6 mr-2 text-indigo-600" /> Update LSC
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6 mr-2 text-indigo-600" /> Add New LSC
              </>
            )}
          </h2>
          {error && (
            <motion.div
              className="flex items-center bg-red-100 text-red-600 p-4 rounded-xl mb-6 border border-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </motion.div>
          )}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-semibold text-gray-700 mb-2">LSC Code</label>
              <motion.input
                type="text"
                value={lscCode}
                onChange={(e) => setLscCode(e.target.value)}
                placeholder="e.g., LSC001"
                required
                className="input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div>
              <label className="block text-xl font-semibold text-gray-700 mb-2">Centre Name</label>
              <motion.input
                type="text"
                value={centreName}
                onChange={(e) => setCentreName(e.target.value)}
                placeholder="e.g., City Learning Centre"
                required
                className="input-focus block w-full px-4 py-3 rounded-xl text-gray-900 outline-none"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] transition-all duration-300 button-glow ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.06, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.94 }}
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
                ) : editingLsc ? (
                  <span className="flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Update LSC
                  </span>
                ) : (
                  <span className="flex items-center py-1">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add LSC
                  </span>
                )}
              </motion.button>
              {editingLsc && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setEditingLsc(null);
                    setLscCode('');
                    setCentreName('');
                    setError('');
                  }}
                  className="px-8 py-3 rounded-full font-semibold text-red-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300 button-glow"
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <span className="flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Cancel
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
{/* Filter Section */}
  <motion.div
    className="filter-container mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
      <Search className="w-6 h-6 mr-2 text-indigo-600" />
      Filter LSCs
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-center">
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by LSC Code</label>
        <motion.div className="relative" whileHover={{ scale: 1.02 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={filterLscCode}
            onChange={(e) => setFilterLscCode(e.target.value)}
            placeholder="Search LSC Code..."
            className="filter-input pl-10"
          />
        </motion.div>
      </div>
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Centre Name</label>
        <motion.div className="relative" whileHover={{ scale: 1.02 }}>
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={filterCentreName}
            onChange={(e) => setFilterCentreName(e.target.value)}
            placeholder="Search Centre Name..."
            className="filter-input pl-10"
          />
        </motion.div>
      </div>
      <div className="flex items-end justify-end mt-5 mr-5 ">
        <motion.button
          onClick={() => {
            setFilterLscCode('');
            setFilterCentreName('');
          }}
          className="filter-clear-btn flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <XCircle className="w-5 h-5 mr-2" />
          Clear Filters
        </motion.button>
      </div>
    </div>
  </motion.div>
  

        {/* LSC Table - Updated Actions Column */}
  <motion.div
    className="table-container p-10 border border-purple-700"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
  >
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <List className="w-6 h-6 mr-2 text-indigo-600" />
        LSC List
      </h2>
      {filteredLscs.length > 0 && (
        <motion.button
          onClick={() => setShowDeleteAll(true)}
          className="px-6 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all duration-300 button-glow flex items-center"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete All
        </motion.button>
      )}
    </div>
    {filteredLscs.length === 0 ? (
      <motion.div
        className="text-gray-600 text-center py-12 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Building className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-xl font-semibold">No Learning Support Centers found.</p>
      </motion.div>
    ) : (
      <>
        <div className="table-wrapper rounded-2xl">
          <table className="min-w-full table-fixed">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">LSC Code</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Centre Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Created At</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLSCs.map((lsc, index) => (
                <motion.tr
                  key={lsc.id}
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-indigo-600" />
                    {lsc.lsc_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-600">
                    {lsc.centre_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-600">
                    {new Date(lsc.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-3">
                    <motion.button
                      onClick={() => {
                        setSelectedLsc(lsc);
                        setShowDetailModal(true);
                      }}
                      className="text-teal-600 hover:text-teal-800"
                      whileHover={{ scale: 1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Details"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={() => handleEdit(lsc)}
                      className="text-indigo-600 hover:text-indigo-800"
                      whileHover={{ scale: 1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit LSC"
                    >
                      <Edit className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setLscToDelete(lsc);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                      whileHover={{ scale: 1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete LSC"
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
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              className="pagination-input"
              placeholder={currentPage.toString()}
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
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </>
    )}
  </motion.div>

  {/* Updated View Details Modal */}
  <AnimatePresence>
    {showDetailModal && selectedLsc && (
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
          >
            <XCircle className="w-7 h-7 text-white" />
          </motion.button>
          <div className="flex items-center mb-8">
            <motion.div
              className="detail-icon"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Building className="w-8 h-8 text-black" />
            </motion.div>
            <h3 className="text-3xl font-extrabold text-gray-900 ml-4" style={{ fontFamily: "'Poppins', sans-serif", textShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              LSC Details
            </h3>
          </div>
          <div className="space-y-6">
            <motion.div className="detail-field" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center">
                <motion.div className="detail-icon" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                  <Search className="w-6 h-6 text-black" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>LSC Code</p>
                  <p className="text-xl font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{selectedLsc.lsc_code}</p>
                </div>
              </div>
            </motion.div>
            <motion.div className="detail-field" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center">
                <motion.div className="detail-icon" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                  <Building className="w-6 h-6 text-black" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Centre Name</p>
                  <p className="text-xl font-medium text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{selectedLsc.centre_name}</p>
                </div>
              </div>
            </motion.div>
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
                  <h3 className="text-xl font-bold text-gray-900">Delete LSC</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete LSC <span className="font-semibold">{lscToDelete?.lsc_code}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-2 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <XCircle className="flex w-5 h-5 mr-2" />
                      Cancel
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <Trash2 className="flex w-5 h-5 mr-2" />
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
                exit={{ scale: 0.8, y: 50 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Delete All LSCs</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold">all LSCs?</span> This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setShowDeleteAll(false)}
                    className="px-6 py-2 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <XCircle className="flex w-5 h-5 mr-2" />
                      Cancel
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleDeleteAll}
                    className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all duration-300 button-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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

export default AddLSC;