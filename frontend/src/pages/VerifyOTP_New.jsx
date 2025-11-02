import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';

function VerifyOTP() {
  const [otp, setOTP] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const validate = () => {
    const newErrors = {};
    if (!otp) {
      newErrors.otp = "OTP is required.";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be a 6-digit number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOTP = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:8000/api/verify-otp/", { email, otp });
      if (response.data.status === "success") {
        toast.success("✅ OTP verified!", { position: "top-center", transition: Slide });
        setTimeout(() => navigate("/set-password"), 2000);
      } else {
        toast.error(`❌ ${response.data.error}`, { position: "top-center", transition: Slide });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("🚫 OTP verification failed! Please try again.", { position: "top-center", transition: Slide });
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/send-otp/");
      if (response.data.status === "success") {
        toast.success("✅ New OTP sent to email!", { position: "top-center", transition: Slide });
      } else {
        toast.error(`❌ ${response.data.error}`, { position: "top-center", transition: Slide });
      }
    } catch {
      toast.error("🚫 Failed to resend OTP! Please try again.", { position: "top-center", transition: Slide });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center p-4 overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      
      <ToastContainer autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
            style={{
              width: `${Math.random() * 250 + 100}px`,
              height: `${Math.random() * 250 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-40, 40],
              x: [-25, 25],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 7 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 overflow-hidden"
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
            className="text-3xl lg:text-4xl font-extrabold text-center text-purple-900 mb-4"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Verify OTP
          </motion.h1>

          <motion.p
            className="text-center text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We've sent a 6-digit code to your email: <br />
            <span className="font-bold text-purple-700">{email}</span>
          </motion.p>

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enter OTP
              </label>
              <motion.input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.otp ? 'border-red-400' : 'border-purple-300'} bg-white text-gray-900 text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all`}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.5em" }}
                whileFocus={{ scale: 1.01 }}
                required
              />
              <AnimatePresence>
                {errors.otp && (
                  <motion.p
                    className="text-xs text-red-500 mt-1 text-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {errors.otp}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Verify Button */}
            <motion.button
              onClick={handleVerifyOTP}
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Didn't receive the code?
              </p>
              <motion.button
                onClick={handleResendOTP}
                className="text-sm text-purple-600 hover:text-purple-800 font-semibold"
                whileHover={{ scale: 1.05 }}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Resend OTP
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyOTP;
