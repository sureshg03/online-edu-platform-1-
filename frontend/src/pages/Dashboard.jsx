import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, FileText, DollarSign, Calendar, CheckCircle, AlertTriangle, GraduationCap, TrendingUp, Users } from 'lucide-react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, LineElement, PointElement, RadialLinearScale, Filler, PolarAreaController } from 'chart.js';
import { Pie, Bar, Doughnut, Line, Radar, PolarArea } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ApplicationVerification from './ApplicationVerification';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, LineElement, PointElement, RadialLinearScale, Filler, PolarAreaController, ChartDataLabels);

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60));
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{value.includes('₹') ? `₹${count.toLocaleString()}` : count.toLocaleString()}</span>;
};

// Pulsing Circle Effect for Data Cards
const PulsingCircle = ({ color }) => {
  return (
    <div className="relative w-8 h-8 sm:w-10 sm:h-10">
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} opacity-50`}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${color} absolute top-1.5 sm:top-2 left-1.5 sm:left-2`} />
    </div>
  );
};

const Dashboard = () => {
  const [userEmail] = useState('admin@periyaruniversity.ac.in');

  // Data for Pie Chart (Application Status)
  const pieData = {
    labels: ['Verified', 'Unverified', 'Pending'],
    datasets: [{
      data: [300, 150, 50],
      backgroundColor: ['#4ade80', '#fb923c', '#f87171'],
      hoverBackgroundColor: ['#22c55e', '#f97316', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 30,
    }],
  };

  // Data for Bar Chart (Year-wise Applications)
  const barData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      label: 'Applications',
      data: [200, 350, 400, 600, 750, 900],
      backgroundColor: 'rgba(96, 165, 250, 0.9)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      borderRadius: 16,
      hoverBackgroundColor: '#3b82f6',
    }],
  };

  // Data for Doughnut Chart (Degree Distribution)
  const doughnutData = {
    labels: ['B.Sc', 'B.A', 'B.Com', 'M.Sc', 'M.A'],
    datasets: [{
      data: [120, 80, 60, 40, 20],
      backgroundColor: ['#a78bfa', '#f472b6', '#34d399', '#facc15', '#60a5fa'],
      hoverBackgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#eab308', '#3b82f6'],
      borderWidth: 0,
      hoverOffset: 20,
    }],
  };

  // Data for Line Chart (Payment Trends)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Payments (₹)',
      data: [50000, 75000, 60000, 90000, 120000, 150000],
      borderColor: '#a78bfa',
      backgroundColor: 'rgba(167, 139, 250, 0.4)',
      tension: 0.5,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#a78bfa',
      pointRadius: 6,
      pointHoverRadius: 10,
    }],
  };

  // Data for Radar Chart (Application Metrics)
  const radarData = {
    labels: ['Applications', 'Verifications', 'Payments', 'Degrees', 'Students'],
    datasets: [{
      label: 'Metrics',
      data: [80, 70, 90, 60, 85],
      backgroundColor: 'rgba(52, 211, 153, 0.4)',
      borderColor: '#34d399',
      pointBackgroundColor: '#34d399',
      pointBorderColor: '#10b981',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#10b981',
      pointHoverBorderColor: '#34d399',
    }],
  };

  // Data for Polar Area Chart (Department Performance)
  const polarData = {
    labels: ['IT', 'Admin', 'Accounts', 'HR', 'Support'],
    datasets: [{
      data: [90, 75, 85, 65, 80],
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(251, 146, 60, 0.7)',
        'rgba(34, 197, 94, 0.7)',
      ],
      borderColor: [
        '#6366f1',
        '#8b5cf6',
        '#ec4899',
        '#fb923c',
        '#22c55e',
      ],
      borderWidth: 2,
    }],
  };

  // Card Data with PulsingCircle Effect
  const cardData = [
    { title: 'Total Applications', value: '1,250', trend: '↑ 12% from last month', color: 'from-blue-600 to-indigo-700', icon: FileText, effect: PulsingCircle, effectProps: { color: 'from-blue-600 to-indigo-700' } },
    { title: 'Total Payments', value: '₹5,20,000', trend: '↑ 18% from last month', color: 'from-green-600 to-emerald-700', icon: DollarSign, effect: PulsingCircle, effectProps: { color: 'from-green-600 to-emerald-700' } },
    { title: 'Semester Payments', value: '₹3,10,000', trend: '↑ 8% from last month', color: 'from-purple-600 to-violet-700', icon: Calendar, effect: PulsingCircle, effectProps: { color: 'from-purple-600 to-violet-700' } },
    { title: 'Verified Applications', value: '850', trend: '↑ 15% from last month', color: 'from-teal-600 to-cyan-700', icon: CheckCircle, effect: PulsingCircle, effectProps: { color: 'from-teal-600 to-cyan-700' } },
    { title: 'Unverified Applications', value: '400', trend: '↓ 5% from last month', color: 'from-orange-600 to-amber-700', icon: AlertTriangle, effect: PulsingCircle, effectProps: { color: 'from-orange-600 to-amber-700' } },
    { title: 'Degree Count', value: '320', trend: '↑ 10% from last month', color: 'from-pink-600 to-rose-700', icon: GraduationCap, effect: PulsingCircle, effectProps: { color: 'from-pink-600 to-rose-700' } },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-poppins">
      <div className="flex-1 w-full">
        <div className="max-w-[1920px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 py-4 xs:py-5 sm:py-6 lg:py-8">
          
          {/* Modern Header */}
          <motion.header 
            className="relative bg-gradient-to-r from-purple-900 to-purple-900 rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full  translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-5 lg:gap-6">
              {/* Left: Logo and Title */}
              <div className="flex items-center gap-3 xs:gap-4 sm:gap-5">
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                  <img
                    src="./Logo.png"
                    alt="Logo"
                    className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-3 sm:border-4 border-white shadow-2xl relative z-10 object-cover"
                  />
                </motion.div>
                <div className="text-white">
                  <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold mb-0.5 sm:mb-1 drop-shadow-lg leading-tight">Periyar University</h1>
                  <p className="text-yellow-200 font-semibold text-xs xs:text-sm sm:text-base drop-shadow-md leading-tight">Centre for Distance & Online Education</p>
                  <p className="text-indigo-100 text-[10px] xs:text-xs sm:text-sm mt-0.5 sm:mt-1">Admin Dashboard</p>
                </div>
              </div>

              {/* Right: User Actions */}
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 w-full md:w-auto">
                <motion.div 
                  className="relative p-2 xs:p-2.5 sm:p-3 bg-white/90 rounded-xl sm:rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 text-indigo-600" />
                  <span className="absolute -top-0.5 xs:-top-1 -right-0.5 xs:-right-1 w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] xs:text-xs font-bold rounded-full flex items-center justify-center animate-pulse">3</span>
                </motion.div>
                <div className="flex items-center gap-1.5 xs:gap-2 bg-white/90 px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg flex-1 md:flex-initial">
                  <User className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-gray-800 truncate">{userEmail}</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Welcome Section */}
          <motion.div
            className="mb-6 xs:mb-7 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1.5 sm:mb-2 leading-tight">
              Welcome Back, <span className="bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">Admin!</span>
            </h2>
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg">Here's what's happening with your platform today.</p>
          </motion.div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4 xs:gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
            {cardData.map((card, index) => {
              const EffectComponent = card.effect;
              return (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-xl sm:rounded-2xl p-4 xs:p-4.5 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Top colored accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r ${card.color} rounded-t-xl sm:rounded-t-2xl`} />
                  
                  {/* Subtle gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-xl sm:rounded-2xl`} />
                  
                  {/* Content */}
                  <div className="relative pt-1.5 sm:pt-2">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 flex-1 min-w-0">
                        <div className={`p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br ${card.color} rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 flex-shrink-0`}>
                          <card.icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{card.title}</p>
                          <p className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 truncate">
                            <AnimatedCounter value={card.value} />
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 hidden xs:block">
                        <EffectComponent {...card.effectProps} />
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                      <div className="bg-gray-50 rounded-md sm:rounded-lg p-2 sm:p-2.5">
                        <p className="text-[10px] xs:text-xs text-gray-500 mb-0.5">Target</p>
                        <p className="text-xs xs:text-sm font-bold text-gray-700">1,500</p>
                      </div>
                      <div className="bg-gray-50 rounded-md sm:rounded-lg p-2 sm:p-2.5">
                        <p className="text-[10px] xs:text-xs text-gray-500 mb-0.5">Completed</p>
                        <p className="text-xs xs:text-sm font-bold text-gray-700">85%</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2.5 sm:mb-3">
                      <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                        <span className="text-[10px] xs:text-xs font-medium text-gray-600">Overall Progress</span>
                        <span className="text-[10px] xs:text-xs font-bold text-gray-800">85%</span>
                      </div>
                      <div className="h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${card.color} rounded-full relative`}
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1.2, delay: index * 0.15 + 0.3, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-gray-100">
                      <div className={`inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-semibold ${card.trend.includes('↑') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <span className={`w-1 xs:w-1.5 h-1 xs:h-1.5 rounded-full ${card.trend.includes('↑') ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="truncate">{card.trend}</span>
                      </div>
                      <button className="text-[10px] xs:text-xs font-semibold text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5 xs:gap-1 flex-shrink-0">
                        <span className="hidden sm:inline">Details</span><span className="sm:hidden">→</span><span className="hidden sm:inline text-sm xs:text-base">→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Analytics Section Header */}
          <div className="mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                <span className="w-1 xs:w-1.5 h-7 xs:h-8 sm:h-10 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-lg" />
                Analytics & Insights
              </h3>
              <p className="text-gray-600 text-xs xs:text-sm sm:text-base mt-1 ml-4 xs:ml-5 sm:ml-6">Comprehensive data visualization and performance metrics</p>
            </motion.div>
          </div>

          {/* Charts Section - 2 Row Grid with 3 Charts Each */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 mb-8 sm:mb-10">
            {/* Pie Chart */}
            <motion.div
              className="relative bg-white rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-lg border border-gray-100 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 truncate">Application Status</h3>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">Current distribution</p>
                  </div>
                  <motion.div 
                    className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FileText className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </div>
                <div className="relative w-full h-56 xs:h-64 sm:h-72 lg:h-80">
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#374151', font: { size: 11, weight: '600' }, padding: 12, usePointStyle: true } },
                        tooltip: { backgroundColor: '#1f2937', padding: 10, titleColor: '#fff', bodyColor: '#fff', cornerRadius: 8 },
                        datalabels: { color: '#ffffff', font: { size: 10, weight: 'bold' }, formatter: (value) => `${value}` },
                      },
                      animation: { duration: 1200, easing: 'easeInOutQuart' },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">Year-wise Applications</h3>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">Growth trend analysis</p>
                  </div>
                  <motion.div 
                    className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Calendar className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </div>
                <div className="relative w-full h-56 xs:h-64 sm:h-72 lg:h-80">
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: '#1f2937', padding: 10, cornerRadius: 8 },
                        datalabels: { color: '#3b82f6', font: { size: 10, weight: 'bold' }, anchor: 'end', align: 'top' },
                      },
                      scales: {
                        x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { display: false } },
                        y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
                      },
                      animation: { duration: 1200, easing: 'easeInOutQuart' },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Doughnut Chart */}
            <motion.div
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">Degree Distribution</h3>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">Program enrollment</p>
                  </div>
                  <motion.div 
                    className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </div>
                <div className="relative w-full h-56 xs:h-64 sm:h-72 lg:h-80 mx-auto">
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#374151', font: { size: 11, weight: '600' }, padding: 12, usePointStyle: true } },
                        tooltip: { backgroundColor: '#1f2937', padding: 10, cornerRadius: 8 },
                        datalabels: { color: '#ffffff', font: { size: 10, weight: 'bold' }, formatter: (value) => `${value}` },
                      },
                      animation: { duration: 1200, easing: 'easeInOutQuart' },
                      cutout: '70%',
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Line Chart */}
            <motion.div
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 truncate">Payment Trends (2025)</h3>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">Monthly revenue overview</p>
                  </div>
                  <motion.div 
                    className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <DollarSign className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </div>
                <div className="relative w-full h-56 xs:h-64 sm:h-72 lg:h-80">
                  <Line
                    data={lineData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top', labels: { color: '#374151', font: { size: 11, weight: '600' }, padding: 10, usePointStyle: true } },
                        tooltip: { backgroundColor: '#1f2937', padding: 10, cornerRadius: 8 },
                        datalabels: { display: false },
                      },
                      scales: {
                        x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { display: false } },
                        y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#e5e7eb' }, beginAtZero: true },
                      },
                      animation: { duration: 1200, easing: 'easeInOutQuart' },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 truncate">Application Metrics Overview</h3>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">Multi-dimensional analysis</p>
                  </div>
                  <motion.div 
                    className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingUp className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </div>
                <div className="relative w-full h-56 xs:h-64 sm:h-72 lg:h-80">
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top', labels: { color: '#374151', font: { size: 11, weight: '600' }, padding: 10, usePointStyle: true } },
                        tooltip: { backgroundColor: '#1f2937', padding: 10, cornerRadius: 8 },
                        datalabels: { display: false },
                      },
                      scales: {
                        r: {
                          ticks: { color: '#6b7280', font: { size: 10 } },
                          grid: { color: '#e5e7eb' },
                          angleLines: { color: '#d1d5db' },
                          suggestedMin: 0,
                          suggestedMax: 100,
                        },
                      },
                      animation: { duration: 1200, easing: 'easeInOutQuart' },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* PolarArea Chart */}
            <motion.div
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300 truncate">Department Performance</h3>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">Team efficiency metrics</p>
                  </div>
                  <motion.div 
                    className="p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </div>
                <div className="relative w-full h-56 xs:h-64 sm:h-72 lg:h-80">
                  <PolarArea
                    data={polarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#374151', font: { size: 11, weight: '600' }, padding: 10, usePointStyle: true } },
                        tooltip: { backgroundColor: '#1f2937', padding: 10, cornerRadius: 8 },
                        datalabels: { color: '#ffffff', font: { size: 10, weight: 'bold' }, formatter: (value) => `${value}%` },
                      },
                      scales: {
                        r: {
                          ticks: { color: '#6b7280', font: { size: 10 }, backdropColor: 'transparent' },
                          grid: { color: '#e5e7eb' },
                          angleLines: { color: '#d1d5db' },
                          suggestedMin: 0,
                          suggestedMax: 100,
                        },
                      },
                      animation: { duration: 1200, easing: 'easeInOutQuart' },
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="/application-verification" element={<ApplicationVerification />} />
            <Route path="/verified-students" element={<div className="mt-4 sm:mt-6 bg-white/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-lg border-2 border-gray-200/50">Verified Students Page (Placeholder)</div>} />
            <Route path="/application-payment" element={<div className="mt-4 sm:mt-6 bg-white/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-lg border-2 border-gray-200/50">Application Payment Page (Placeholder)</div>} />
            <Route path="/semester-payment" element={<div className="mt-4 sm:mt-6 bg-white/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-lg border-2 border-gray-200/50">Semester Payment Page (Placeholder)</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;