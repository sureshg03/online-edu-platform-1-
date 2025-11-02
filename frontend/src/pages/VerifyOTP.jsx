import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function VerifyOTP() {
  const [otp, setOTP] = useState("");
  const [errors, setErrors] = useState({});
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

    try {
      const response = await axios.post("http://localhost:8000/api/verify-otp/", { email, otp });
      if (response.data.status === "success") {
        toast.success("✅ OTP verified!", { position: "top-center", transition: Slide });
        setTimeout(() => navigate("/set-password"), 2000);
      } else {
        toast.error(`❌ ${response.data.error}`, { position: "top-center", transition: Slide });
      }
    } catch (error) {
      toast.error("🚫 OTP verification failed! Please try again.", { position: "top-center", transition: Slide });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-pink-300 to-yellow-300 flex justify-center items-center">
      <ToastContainer autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>
        <div>
          <label htmlFor="otp" className="block text-sm font-semibold text-indigo-800 mb-1 tracking-wide">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className={`w-full px-4 py-2 mb-4 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
        </div>
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;