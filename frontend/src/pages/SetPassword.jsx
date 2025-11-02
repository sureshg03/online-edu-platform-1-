import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';

function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetPassword = async () => {
    if (!validate()) {
      toast.error("🚫 Please fix the errors!", { position: "top-center", transition: Slide });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8000/api/reset-password/", {
        email,
        password,
      });
      if (response.data.status === "success") {
        toast.success("✅ Password reset successfully!", { position: "top-center", transition: Slide });
        localStorage.removeItem("email");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(`❌ ${response.data.error}`, { position: "top-center", transition: Slide });
      }
    } catch (error) {
      toast.error("🚫 Password reset failed! Please try again.", { position: "top-center", transition: Slide });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f5e9ff] to-[#e6d6ff] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
          .gradient-text {
            background: linear-gradient(90deg, #BB53CF, #F9A1F8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .input-underline::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #BB53CF, #F9A1F8);
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }
          .input-underline.focus::after {
            transform: scaleX(1);
            transform-origin: left;
          }
        `}
      </style>
      <ToastContainer autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(187, 83, 207, 0.3) 0%, transparent 60%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-[#BB53CF]/40 to-[#F9A1F8]/40 rounded-full"
            style={{
              width: Math.random() * 50 + 30,
              height: Math.random() * 50 + 30,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-40, 40, -40],
              scale: [1, 1.6, 1],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 6 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ rotate: 1, scale: 1.02 }}
        className="relative z-10 w-full max-w-md bg-[rgba(255,255,255,0.95)] backdrop-blur-3xl rounded-3xl shadow-[0_20px_80px_rgba(187,83,207,0.4)] border-4 border-[rgba(187,83,207,0.6)] overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#BB53CF]/10 to-[#F9A1F8]/10"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="p-8 sm:p-10">
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold text-center gradient-text mb-8"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Poppins', sans-serif", textShadow: "0 2px 8px rgba(187,83,207,0.5)" }}
          >
            Set New Password
          </motion.h1>
          <div className="space-y-8">
            <div>
              <motion.label
                htmlFor="password"
                className="block text-base font-bold text-[#171836] text-left"
                initial={{ y: 0 }}
                animate={{ y: password ? -5 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em" }}
              >
                New Password
              </motion.label>
              <motion.div
                className="relative mt-2 input-underline"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.parentElement.classList.add('focus')}
                  onBlur={(e) => e.target.parentElement.classList.remove('focus')}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3.5 rounded-xl border border-[#BB53CF]/80 bg-white text-[#171836] text-base font-medium focus:outline-none focus:ring-0 transition-all duration-500 ${errors.password ? 'border-red-400' : ''}`}
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em" }}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 right-3 text-[#BB53CF] hover:text-[#F9A1F8]"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {showPassword ? <FaEyeSlash size={19} /> : <FaEye size={19} />}
                </motion.button>
              </motion.div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="text-xs text-red-500 mt-1.5 text-left"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div>
              <motion.label
                htmlFor="confirmPassword"
                className="block text-base font-bold text-[#171836] text-left"
                initial={{ y: 0 }}
                animate={{ y: confirmPassword ? -5 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em" }}
              >
                Confirm Password
              </motion.label>
              <motion.div
                className="relative mt-2 input-underline"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={(e) => e.target.parentElement.classList.add('focus')}
                  onBlur={(e) => e.target.parentElement.classList.remove('focus')}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3.5 rounded-xl border border-[#BB53CF]/80 bg-white text-[#171836] text-base font-medium focus:outline-none focus:ring-0 transition-all duration-500 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em" }}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-3.5 right-3 text-[#BB53CF] hover:text-[#F9A1F8]"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {showConfirmPassword ? <FaEyeSlash size={19} /> : <FaEye size={19} />}
                </motion.button>
              </motion.div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    className="text-xs text-red-500 mt-1.5 text-left"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              onClick={handleSetPassword}
              disabled={isSubmitting}
              className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-[#171836] to-[#F9A1F8] text-white font-medium text-lg shadow-[0_6px_20px_rgba(187,83,207,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-500 overflow-hidden"
              whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 30px rgba(187,83,207,0.7)" }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isSubmitting ? "submitting" : "submit"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <motion.div
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              top: '50%',
                              left: '50%',
                              transformOrigin: '0 10px',
                              transform: `rotate(${i * 60}deg) translateY(-10px)`,
                            }}
                            animate={{
                              rotate: [i * 60, i * 60 + 360],
                              scale: [0.8, 1.2, 0.8],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <span>Setting Password...</span>
                    </>
                  ) : (
                    <span>Set Password</span>
                  )}
                </motion.span>
              </AnimatePresence>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#0f112e]/95 to-[#e58de5]/95"
                initial={{ x: "-100%" }}
                animate={{ x: isSubmitting ? "0%" : "-100%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: 0.3 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'radial-gradient(circle, rgba(187,83,207,0.4) 0%, transparent 70%)',
                }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SetPassword;