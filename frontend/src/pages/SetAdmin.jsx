import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';

function SetAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetAdmin = async () => {
    if (!validate()) {
      toast.error("🚫 Please fix the errors!", { position: "top-center", transition: Slide });
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/api/create-admin/", { email, password });
      toast.success("✅ Admin created successfully! Redirecting to login...", { position: "top-center", transition: Slide });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("🚫 Failed to create admin. Please try again.", { position: "top-center", transition: Slide });
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSetAdmin();
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100 flex items-center justify-center overflow-hidden">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
        
        {/* Static Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Static Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-36 h-36 bg-sky-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-blue-300/40 rounded-lg rotate-45"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-blue-300/40 rounded-full"></div>
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo with Animated Rings */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-purple-500"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-purple-400/30"
              animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <img
              src="/Logo.png"
              alt="Periyar Logo"
              className="w-32 h-32 rounded-full shadow-2xl border-4 border-white relative z-10"
            />
          </div>

          <motion.h2
            className="text-4xl font-extrabold text-purple-900 mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CDOE Admin Portal
          </motion.h2>

          <div className="w-64 h-2 bg-purple-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-700"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <motion.p
            className="mt-4 text-purple-700 font-semibold"
            style={{ fontFamily: "'Inter', sans-serif" }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing Portal...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-blue-80 to-sky-100 flex items-center justify-center p-4 overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      
      <ToastContainer autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      
      {/* Static Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Static Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl"></div>
        
        {/* Geometric accents */}
        <div className="absolute top-20 right-32 w-32 h-32 border-4 border-blue-300/30 rounded-2xl rotate-12"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 border-4 border-blue-300/30 rounded-full"></div>
        <div className="absolute top-1/3 left-20 w-20 h-20 bg-blue-300/20 rounded-lg rotate-45"></div>
        <div className="absolute bottom-1/3 right-20 w-16 h-16 bg-blue-300/20 rounded-full"></div>
        
        {/* Dotted patterns */}
        <div className="absolute top-40 left-1/4 w-2 h-2 bg-blue-400/50 rounded-full"></div>
        <div className="absolute top-48 left-1/4 w-2 h-2 bg-blue-400/50 rounded-full ml-6"></div>
        <div className="absolute top-56 left-1/4 w-2 h-2 bg-blue-400/50 rounded-full ml-12"></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-blue-400/50 rounded-full"></div>
        <div className="absolute bottom-48 right-1/4 w-2 h-2 bg-blue-400/50 rounded-full mr-6"></div>
        <div className="absolute bottom-56 right-1/4 w-2 h-2 bg-blue-400/50 rounded-full mr-12"></div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-200/50 overflow-hidden"
      >
        <div className="p-8 lg:p-10">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/Logo.png"
              alt="Periyar Logo"
              className="w-20 h-20 rounded-full border-4 border-yellow-300 shadow-xl"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl lg:text-4xl font-extrabold text-center text-indigo-900 mb-8"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Setup Admin
          </motion.h1>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email Address
              </label>
              <motion.input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="admin@example.com"
                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-400' : 'border-purple-300'} bg-white text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all`}
                style={{ fontFamily: "'Inter', sans-serif" }}
                whileFocus={{ scale: 1.01 }}
                required
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    className="text-xs text-red-500 mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password (min 8 characters)"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.password ? 'border-red-400' : 'border-purple-300'} bg-white text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  whileFocus={{ scale: 1.01 }}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800"
                  whileHover={{ scale: 1.1 }}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="text-xs text-red-500 mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSetAdmin}
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-purple-800 transition-all"
              whileHover={{ scale: isSubmitting ? 1 : 1.02, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Admin...
                </span>
              ) : (
                "Set Admin"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SetAdmin;
