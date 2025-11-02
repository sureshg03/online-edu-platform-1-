import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserPlus, Upload } from 'lucide-react';
import axios from 'axios';

const AddCounsellor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    counsellorName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    aadhaar: '',
    qualification: '',
    highestQualification: '',
    programmeAssigned: '',
    mobile: '',
    alternateNumber: '',
    email: '',
    designation: '',
    experience: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pincode: '',
    district: '',
    state: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token and programmes
  useEffect(() => {
    // Fetch CSRF token
    axios.get('/api/get-csrf/')
      .then(response => {
        setCsrfToken(response.data.csrfToken);
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
      })
      .catch(error => console.error('Error fetching CSRF token:', error));

    // Fetch programmes (courses) from backend
    axios.get('/api/courses/list/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
      .then(response => {
        console.log('Programmes response:', response.data);
        setProgrammes(response.data.data || response.data); // Handle both response.data.data and response.data
      })
      .catch(error => {
        console.error('Error fetching programmes:', error.response?.status, error.response?.data);
        toast.error('Failed to load programmes from API, using fallback options');
      });
  }, []);

  // Log programmes state changes
  useEffect(() => {
    console.log('Programmes state:', programmes);
  }, [programmes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('/api/counsellors/create/', data, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'X-CSRFToken': csrfToken,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Counsellor added successfully!');
      setTimeout(() => navigate('/settings'), 2000);
    } catch (error) {
      console.error('Error submitting form:', error.response?.status, error.response?.data);
      toast.error('Failed to add counsellor');
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

          .form-container {
            font-family: 'Manrope', sans-serif;
            background: #f5f7fa; /* Match App.jsx main-content */
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
          }
          .form-card {
            background: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 2.5rem;
            max-width: 600px;
            width: 100%;
          }
          .form-title {
            color: #4C1D95;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .input-field {
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 0.75rem;
            transition: all 0.3s ease;
          }
          .input-field:focus {
            outline: none;
            border-color: #7C3AED;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          }
          .label {
            color: #4B5563;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          .required::after {
            content: '*';
            color: #EF4444;
            margin-left: 0.25rem;
          }
          .submit-button {
            background: #4C1D95;
            color: #ffffff;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
          }
          .submit-button:hover {
            background: #7C3AED;
            transform: translateY(-2px);
          }
          .image-preview {
            border-radius: 0.5rem;
            border: 2px dashed #e2e8f0;
            padding: 0.5rem;
            transition: all 0.3s ease;
          }
          .image-preview:hover {
            border-color: #7C3AED;
          }
        `}
      </style>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        className="form-container"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="form-card">
          <h2 className="form-title text-2xl mb-6">
            <UserPlus className="w-6 h-6" /> Add Counsellor
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Counsellor Name */}
            <div>
              <label className="label required">Counsellor Name (IN CAPITAL LETTERS)</label>
              <input
                type="text"
                name="counsellorName"
                value={formData.counsellorName}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="label required">Father Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Mother Name */}
            <div>
              <label className="label required">Mother Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="label required">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="label required">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Aadhaar Card */}
            <div>
              <label className="label required">Aadhaar Card Number</label>
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="label required">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Highest Qualification */}
            <div>
              <label className="label required">Highest Qualification</label>
              <select
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Highest Qualification</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Programme Assigned */}
            <div>
              <label className="label required">Programme Assigned</label>
              <select
                name="programmeAssigned"
                value={formData.programmeAssigned}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Programme</option>
                {programmes.length > 0 ? (
                  programmes.map(programme => (
                    <option key={programme.id} value={programme.course_short_code}>
                      {programme.course_full_name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="CS101">Computer Science 101</option>
                    <option value="MATH201">Mathematics 201</option>
                    <option value="ENG101">English Literature</option>
                    <option value="PHY201">Physics 201</option>
                  </>
                )}
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="label required">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Alternate Number */}
            <div>
              <label className="label">Alternate Number (Optional)</label>
              <input
                type="tel"
                name="alternateNumber"
                value={formData.alternateNumber}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="label required">E-mail ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Current Designation */}
            <div>
              <label className="label">Current Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="label">Years of Working Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="input-field w-full"
              />
            </div>

            {/* Communication Address */}
            <div>
              <label className="label required">Communication Address</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Line 1"
                className="input-field w-full mb-2"
                required
              />
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Line 2"
                className="input-field w-full mb-2"
                required
              />
              <input
                type="text"
                name="addressLine3"
                value={formData.addressLine3}
                onChange={handleInputChange}
                placeholder="Line 3"
                className="input-field w-full"
                required
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="label required">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="label required">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="label required">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="label">Profile Image</label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field w-full"
                />
                <Upload className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {previewImage && (
                <div className="mt-4">
                  <img src={previewImage} alt="Preview" className="image-preview w-32 h-32 object-cover" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-button w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Counsellor
            </motion.button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default AddCounsellor;