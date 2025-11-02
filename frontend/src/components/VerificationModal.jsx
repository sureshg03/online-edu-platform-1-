import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

const VerificationModal = ({ isOpen, onClose, onSubmit, email, isEditMode, initialData }) => {
  const [formData, setFormData] = useState({
    email: email || '',
    temp_register_no: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        email: initialData.email || email,
        temp_register_no: initialData.temp_register_no || '',
        password: initialData.password || '',
      });
    } else {
      setFormData({
        email: email || '',
        temp_register_no: '',
        password: '',
      });
    }
    setErrors({});
  }, [isEditMode, initialData, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.temp_register_no) newErrors.temp_register_no = 'Temporary Register Number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel="Verify Student Modal"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isEditMode ? 'Update Student Verification' : 'Verify Student'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full p-2 border rounded disabled:bg-gray-100"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="temp_register_no">
              Temporary Register Number
            </label>
            <input
              type="text"
              name="temp_register_no"
              value={formData.temp_register_no}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.temp_register_no && (
              <p className="text-red-500 text-sm mt-1">{errors.temp_register_no}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditMode ? 'Update' : 'Verify'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default VerificationModal;