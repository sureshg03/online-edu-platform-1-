import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  HomeIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';

const StudentDetailsUI = ({
  previewData,
  paymentDetails,
  paymentLoading,
  paymentError,
  printRef,
  loading,
  error,
  imageLoading,
  isVerified,
  modalIsOpen,
  modalContent,
  isFileLoading,
  fileLoadError,
  numPages,
  pdfBlobUrl,
  documentVerification,
  documentInvalidReasons,
  eligibilityStatus,
  setEligibilityStatus,
  notEligibleReason,
  setNotEligibleReason,
  admissionStatus,
  setAdmissionStatus,
  notAdmittedReason,
  setNotAdmittedReason,
  enrollmentNumber,
  setEnrollmentNumber,
  handleRetry,
  handleImageLoad,
  handleImageError,
  handleDocumentVerify,
  handleDocumentInvalidate,
  handleSave,
  handleSendInvalidCertificatesMail,
  handleSendInvalidDocumentMail,
  openModal,
  closeModal,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  navigate,
}) => {
  const { student, application, student_details } = previewData || {};


  const [emailSent, setEmailSent] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  // State for invalidation modal
  const [invalidateModalIsOpen, setInvalidateModalIsOpen] = useState(false);
  const [invalidateDocumentKey, setInvalidateDocumentKey] = useState('');
  const [invalidateDocumentLabel, setInvalidateDocumentLabel] = useState('');
  const [invalidateReason, setInvalidateReason] = useState('');

  // State for request upload modal
  const [requestUploadModalIsOpen, setRequestUploadModalIsOpen] = useState(false);
  const [requestDocumentKey, setRequestDocumentKey] = useState('');
  const [requestDocumentLabel, setRequestDocumentLabel] = useState('');
  const [requestQuery, setRequestQuery] = useState('');

  // Store invalid reasons and upload requests
  const [invalidReasons, setInvalidReasons] = useState({});
  const [uploadRequests, setUploadRequests] = useState({});

  const openInvalidateModal = (key, label) => {
    setInvalidateDocumentKey(key);
    setInvalidateDocumentLabel(label);
    setInvalidateReason('');
    setInvalidateModalIsOpen(true);
  };

  const closeInvalidateModal = () => {
    setInvalidateModalIsOpen(false);
    setInvalidateDocumentKey('');
    setInvalidateDocumentLabel('');
    setInvalidateReason('');
  };

 const handleInvalidateSubmit = () => {
    if (invalidateReason.trim()) {
      // Update local state only
      setInvalidReasons((prev) => ({
        ...prev,
        [invalidateDocumentKey]: { label: invalidateDocumentLabel, reason: invalidateReason },
      }));
      closeInvalidateModal();
    }
  };

  const openRequestUploadModal = (key, label) => {
    setRequestDocumentKey(key);
    setRequestDocumentLabel(label);
    setRequestQuery('');
    setRequestUploadModalIsOpen(true);
  };

  const closeRequestUploadModal = () => {
    setRequestUploadModalIsOpen(false);
    setRequestDocumentKey('');
    setRequestDocumentLabel('');
    setRequestQuery('');
  };

const handleRequestUploadSubmit = () => {
    if (requestQuery.trim()) {
      // Update local state only
      setUploadRequests((prev) => ({
        ...prev,
        [requestDocumentKey]: { label: requestDocumentLabel, query: requestQuery },
      }));
      closeRequestUploadModal();
    }
  };



{/* Add handlePrint function before the return statement */}
const handlePrint = () => {
  if (printRef.current) {
    window.print();
  } else {
    toast.error('Print content not available.', {
      duration: 4000,
      style: {
        background: '#F43F5E',
        color: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      },
    });
  }
};
  



 const handleSendEmail = async () => {
    try {
      console.log('paymentDetails:', paymentDetails);
      console.log('invalidReasons:', invalidReasons);
      console.log('uploadRequests:', uploadRequests);

      if (!paymentDetails?.application_id || typeof paymentDetails.application_id !== 'string' || paymentDetails.application_id.trim() === '') {
        toast.error('Validation failed: Application ID is missing or invalid.', {
          duration: 4000,
          style: {
            background: '#F43F5E',
            color: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        });
        return;
      }
      if (!student?.email || typeof student.email !== 'string' || student.email.trim() === '') {
        toast.error('Cannot send email: Student email is missing or invalid.', {
          duration: 4000,
          style: {
            background: '#F43F5E',
            color: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        });
        return;
      }

      const invalidDocs = Object.values(invalidReasons)
        .map((item) => `${item.label}: ${item.reason}`)
        .join('; ');
      const uploadDocs = Object.values(uploadRequests)
        .map((item) => `${item.label}: ${item.query}`)
        .join('; ');
      const statusReasons = [];
      if (eligibilityStatus === 'Not Eligible' && notEligibleReason) {
        statusReasons.push(`Eligibility Not Eligible: ${notEligibleReason}`);
      }
      if (admissionStatus === 'Not Confirmed' && notAdmittedReason) {
        statusReasons.push(`Admission Not Confirmed: ${notAdmittedReason}`);
      }
      if (admissionStatus === 'Cancelled' && notAdmittedReason) {
        statusReasons.push(`Admission Cancelled: ${notAdmittedReason}`);
      }
      const subjectParts = [];
      if (invalidDocs) subjectParts.push(`Invalid Documents - ${invalidDocs}`);
      if (uploadDocs) subjectParts.push(`Upload Requests - ${uploadDocs}`);
      if (statusReasons.length) subjectParts.push(statusReasons.join('; '));
      const emailSubject = subjectParts.join(' | ') || 'Invalid Certificates Notification';

      if (!emailSubject || emailSubject.trim() === '') {
        toast.error('Cannot send email: Email subject is missing.', {
          duration: 4000,
          style: {
            background: '#F43F5E',
            color: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        });
        return;
      }

      const emailData = {
        email: student.email,
        studentName: student?.name || 'N/A',
        subject: emailSubject,
        invalidReasons: Object.keys(invalidReasons).length ? invalidReasons : {},
        uploadRequests: Object.keys(uploadRequests).length ? uploadRequests : {},
        eligibilityStatus: eligibilityStatus || '',
        notEligibleReason: notEligibleReason || '',
        admissionStatus: admissionStatus || '',
        notAdmittedReason: notAdmittedReason || '',
        applicationId: paymentDetails.application_id,
      };

      console.log('Sending email with payload:', emailData);

      const response = await axios.post('http://localhost:8000/api/send-email/', emailData, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      toast.success('Email sent successfully!', {
        duration: 4000,
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      });
      setEmailSent(true);
      setInvalidReasons({});
      setUploadRequests({});
      setNotEligibleReason('');
    } catch (err) {
      console.error('Error sending email:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send email. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#F43F5E',
          color: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      });
    }
  };

  const handleSaveStatus = async () => {
    try {
      if (!paymentDetails?.application_id || !student?.email || !admissionStatus) {
        toast.error('Cannot save status: Missing required fields.', {
          duration: 4000,
          style: {
            background: '#F43F5E',
            color: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        });
        return;
      }

      const statusData = {
        application_id: paymentDetails.application_id,
        student_email: student.email,
        status: admissionStatus,
        reason: notAdmittedReason || '',
      };

      console.log('Saving application status with payload:', statusData);

      const response = await axios.post('http://localhost:8000/api/save-application-status/', statusData, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      toast.success('Application status saved successfully!', {
        duration: 4000,
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      });
      setStatusSaved(true);
      setNotAdmittedReason('');
      setAdmissionStatus(admissionStatus);
    } catch (err) {
      console.error('Error saving application status:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save application status. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#F43F5E',
          color: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      });
    }
  };

  const getButtonProps = () => {
    if (statusSaved) {
      return {
        text: `Saved as ${admissionStatus}`,
        onClick: () => {},
        disabled: true,
      };
    }
    if (emailSent && admissionStatus === 'Not Confirmed') {
      return {
        text: 'Save as Not Confirmed',
        onClick: handleSaveStatus,
        disabled: false,
      };
    }
    if (emailSent && admissionStatus === 'Cancelled') {
      return {
        text: 'Save as Cancelled',
        onClick: handleSaveStatus,
        disabled: false,
      };
    }
    return {
      text: 'Send Mail for Invalid Certificates',
      onClick: handleSendEmail,
      disabled:
        !paymentDetails?.application_id ||
        !student?.email ||
        (Object.keys(invalidReasons).length === 0 &&
         Object.keys(uploadRequests).length === 0 &&
         eligibilityStatus !== 'Not Eligible' &&
         admissionStatus !== 'Not Confirmed' &&
         admissionStatus !== 'Cancelled'),
    };
  };

  const { text, onClick, disabled } = getButtonProps();

return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
          .card {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(229, 231, 235, 0.3);
            backdrop-filter: blur(10px);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .section-title {
            font-weight: 700;
            font-size: 2.1rem;
            color: #1E293B;
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 10px;
            position: relative;
          }
          .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, #A855F7, #3B82F6);
            border-radius: 2px;
            transition: width 0.4s ease;
          }
          .section-container:hover .section-title::after {
            width: 80px;
          }
          .section-container {
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 28px;
            position: relative;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.9);
          }
          .section-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05));
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: -1;
          }
          .section-container:hover::before {
            opacity: 1;
          }
          .section-container.personal {
            border-left: 4px solid #A855F7;
          }
          .section-container.application {
            border-left: 4px solid #3B82F6;
          }
          .section-container.education {
            border-left: 4px solid #22C55E;
          }
          .section-container.documents {
            border-left: 4px solid #F43F5E;
          }
          .section-container.address {
            border-left: 4px solid #14B8A6;
          }
          .section-container.additional {
            border-left: 4px solid #F59E0B;
          }
          .section-container.status {
            border-left: 4px solid #6366F1;
          }
          .section-icon {
            padding: 8px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.4s ease, background 0.4s ease;
          }
          .section-icon:hover {
            transform: scale(1.2) rotate(360deg);
            background: rgba(255, 255, 255, 1);
          }
          .field-label {
            color: #1E293B;
            font-weight: 500;
            font-size: 1.05rem;
            margin-bottom: 4px;
            transition: color 0.3s ease;
          }
          .field-value {
            color: #475569;
            font-size: 1.1rem;
            font-weight: 400;
            transition: color 0.3s ease;
          }
          .field-container:hover .field-label {
            color: #A855F7;
          }
          .field-container:hover .field-value {
            color: #1E293B;
          }
          .btn-back {
            background: linear-gradient(135deg, #3B82F6, #60A5FA);
            border-radius: 12px;
            color: white;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-verify {
            background: linear-gradient(135deg, #22C55E, #4ADE80);
            border-radius: 12px;
            color: white;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-invalid {
            background: linear-gradient(135deg, #F43F5E, #FB7185);
            border-radius: 12px;
            color: white;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(244, 63, 94, 0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-save {
            background: linear-gradient(135deg, #A855F7, #D8B4FE);
            border-radius: 12px;
            color: white;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-send-mail {
            background: linear-gradient(135deg, #E11D48, #F43F5E);
            border-radius: 12px;
            color: white;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-request-upload {
            background: linear-gradient(135deg, #10B981, #34D399);
            border-radius: 12px;
            color: white;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-back::before, .btn-verify::before, .btn-invalid::before, .btn-save::before, .btn-send-mail::before, .btn-request-upload::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
          }
          .btn-back:hover::before, .btn-verify:hover::before, .btn-invalid:hover::before, .btn-save:hover::before, .btn-send-mail:hover::before, .btn-request-upload:hover::before {
            left: 100%;
          }
          .btn-back:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5);
            background: linear-gradient(135deg, #2563EB, #3B82F6);
          }
          .btn-verify:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.5);
            background: linear-gradient(135deg, #16A34A, #22C55E);
          }
          .btn-invalid:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(244, 63, 94, 0.5);
            background: linear-gradient(135deg, #E11D48, #F43F5E);
          }
          .btn-save:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(168, 85, 247, 0.5);
            background: linear-gradient(135deg, #9333EA, #A855F7);
          }
          .btn-send-mail:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
            background: linear-gradient(135deg,rgb(201, 4, 63),rgb(138, 0, 57));
          }
          .btn-request-upload:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5);
            background: linear-gradient(135deg, #059669, #10B981);
          }
          .marksheet-img {
            border-radius: 12px;
            border: 1px solid rgba(229, 231, 235, 0.3);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          .marksheet-img:hover {
            transform: scale(1.15);
          }
      .header-section {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(229, 231, 235, 0.3);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .main-title {
      font-weight: 800;
      font-size: 1.8rem;
      color: #A855F7;
      text-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
    }
    .application-title {
      font-weight: 700;
      font-size: 1.834rem; 
      color:rgb(76, 0, 126);
      text-align: center;
      margin-top:60px;
      margin-bottom: 3rem;
    }
    .application-details-container {
      margin-bottom: 5rem;
    }
    .application-details-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 0.75rem;
      margin-left:20px;
      margin-right:60px;
    }
    .application-detail-label {
      font-weight: 600;
      font-size: 1.312rem; /* text-xl equivalent */
      color: #1E293B;
    }
    .application-detail-value {
      font-weight: 400;
      font-size: 1.312em; /* text-lg equivalent */
      color: #475569;
      margin-left: 0.5rem;
      
    }
    .lsc-container {
      margin-top: 1rem;
      margin-bottom: 2rem;
      margin-left:20px;
    }
    @media (max-width: 640px) {
      .header-section {
        flex-direction: column;
        align-items: center;
        padding: 16px;
      }
      .main-title {
        font-size: 1.5rem;
      }
      .application-title {
        font-size: 1.875rem; /* text-3xl equivalent */
      }
      .application-details-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.2rem;
      }
      .application-detail-label {
        font-size: 1.125rem; /* text-lg */
      }
      .application-detail-value {
        font-size: 1rem; /* text-base */
      }
      .application-details-container {
        margin-bottom: 1.5rem;
      }

    }
     .modal-content {
            max-width: 95vw;
            max-height: 92vh;
            overflow: auto;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 24px 72px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(229, 231, 235, 0.3);
            backdrop-filter: blur(12px);
          }
          .modal-form {
            max-width: 600px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(229, 231, 235, 0.3);
            backdrop-filter: blur(12px);
          }
          .modal-button {
            background: linear-gradient(135deg,rgb(249, 22, 22),rgb(167, 3, 3));
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
            position: relative;
            overflow: hidden;
          }
          .modal-submit-button {
            background: linear-gradient(135deg, #A855F7, #D8B4FE);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
            position: relative;
            overflow: hidden;
          }
          .modal-button::before, .modal-submit-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
          }
          .modal-button:hover::before, .modal-submit-button:hover::before {
            left: 100%;
          }
          .modal-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
            background: linear-gradient(135deg,rgb(234, 27, 12),rgb(114, 10, 10));
          }
          .modal-submit-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(168, 85, 247, 0.5);
            background: linear-gradient(135deg, #9333EA, #A855F7);
          }
          .modal-input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #D1D5DB;
            background: #FFFFFF;
            font-size: 1rem;
            color: #1E293B;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .modal-input:focus {
            border-color: #A855F7;
            outline: none;
            box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
          }
          .download-button {
            background: linear-gradient(135deg, #14B8A6, #2DD4BF);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(20, 184, 166, 0.4);
            position: relative;
            overflow: hidden;
          }
          .download-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
          }
          .download-button:hover::before {
            left: 100%;
          }
          .download-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(20, 184, 166, 0.5);
            background: linear-gradient(135deg, #0D9488, #14B8A6);
          }
          .view-button {
            background: linear-gradient(135deg, #6366F1, #A78BFA);
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 3px 12px rgba(99, 102, 241, 0.4);
            position: relative;
            overflow: hidden;
          }
          .view-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
          }
          .view-button:hover::before {
            left: 100%;
          }
          .view-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 18px rgba(99, 102, 241, 0.5);
            background: linear-gradient(135deg, #4F46E5, #9333EA);
          }
          .document-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            padding: 20px;
            border: 1px solid rgba(229, 231, 235, 0.3);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
          }
          .document-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
          }
          .document-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05));
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: -1;
          }
          .document-card:hover::before {
            opacity: 1;
          }
          .verification-button {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 12px;
            right: 12px;
            transition: all 0.3s ease;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(229, 231, 235, 0.3);
          }
          .verified .verification-button {
            background: linear-gradient(135deg, #22C55E, #4ADE80);
            box-shadow: 0 4px 16px rgba(34, 197, 94, 0.5);
          }
          .not-verified .verification-button {
            background: linear-gradient(135deg, #F43F5E, #FB7185);
            box-shadow: 0 4px 16px rgba(244, 63, 94, 0.5);
          }
          .verified .verification-button:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #16A34A, #22C55E);
          }
          .not-verified .verification-button:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #E11D48, #F43F5E);
          }
          .tick-mark, .cross-mark {
            width: 28px;
            height: 28px;
            position: relative;
            display: inline-block;
            overflow: visible;
          }
          .tick-mark::before, .tick-mark::after, .cross-mark::before, .cross-mark::after {
            content: '';
            position: absolute;
            background: #FFFFFF;
            border-radius: 3px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
          }
          .tick-mark::before {
            width: 6px;
            height: 10px;
            top: 6px;
            left: 10px;
            transform: rotate(-50deg);
            transform-origin: bottom right;
            opacity: 0;
            animation: draw-stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .tick-mark::after {
            width: 6px;
            height: 16px;
            left: 10px;
            transform: rotate(40deg);
            transform-origin: bottom left;
            opacity: 0;
            animation: draw-stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.15s;
          }
          .cross-mark::before, .cross-mark::after {
            background: #FFFFFF;
          }
          .cross-mark::before {
            width: 18px;
            height: 6px;
            top: 11px;
            left: 5px;
            transform: rotate(45deg);
            opacity: 0;
            animation: draw-stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .cross-mark::after {
            width: 18px;
            height: 6px;
            top: 11px;
            left: 5px;
            transform: rotate(-45deg);
            opacity: 0;
            animation: draw-stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.15s;
          }
          @keyframes draw-stroke {
            0% {
              opacity: 0;
              clip-path: inset(0 100% 0 0);
            }
            100% {
              opacity: 1;
              clip-path: inset(0 0 0 0);
            }
          }
          .form-field {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 12px;
            border: 1px solid rgba(229, 231, 235, 0.3);
            transition: all 0.3s ease;
          }
          .form-field:hover {
            background: rgba(255, 255, 255, 1);
            border-color: #A855F7;
            box-shadow: 0 4px 16px rgba(168, 85, 247, 0.3);
          }
          .select-field, .input-field {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #D1D5DB;
            background: #FFFFFF;
            font-size: 1rem;
            color: #1E293B;
            transition: border-color 0.3s ease;
          }
          .select-field:focus, .input-field:focus {
            border-color: #A855F7;
            outline: none;
            box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
          }
          .document-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
            margin-top: auto;
          }
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 16px;
            margin-top: 8rem;
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: conic-gradient(
              from 0deg,
              #A855F7 0%,
              #3B82F6 33%,
              #22C55E 66%,
              #A855F7 100%
            );
            animation: spin 1.5s linear infinite, pulse 2s ease-in-out infinite;
            position: relative;
          }
          .loading-spinner::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            background: #FFFFFF;
            border-radius: 50%;
          }
          .loading-text {
            font-size: 1.2rem;
            font-weight: 500;
            color: #1E293B;
            display: flex;
            gap: 4px;
          }
          .loading-text span {
            animation: wave 1.2s ease-in-out infinite;
            display: inline-block;
          }
          .loading-text span:nth-child(1) { animation-delay: 0s; }
          .loading-text span:nth-child(2) { animation-delay: 0.1s; }
          .loading-text span:nth-child(3) { animation-delay: 0.2s; }
          .loading-text span:nth-child(4) { animation-delay: 0.3s; }
          .loading-text span:nth-child(5) { animation-delay: 0.4s; }
          .loading-text span:nth-child(6) { animation-delay: 0.5s; }
          .loading-text span:nth-child(7) { animation-delay: 0.6s; }
          .loading-text span:nth-child(8) { animation-delay: 0.7s; }
          .loading-text span:nth-child(9) { animation-delay: 0.8s; }
          .loading-text span:nth-child(10) { animation-delay: 0.9s; }
          .loading-text span:nth-child(11) { animation-delay: 1s; }
          .loading-text span:nth-child(12) { animation-delay: 1.1s; }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }
          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @media (max-width: 640px) {
            .section-title {
              font-size: 1.8rem;
            }
            .field-label {
              font-size: 0.95rem;
            }
            .field-value {
              font-size: 1rem;
            }
            .btn-back, .btn-verify, .btn-invalid, .btn-save, .btn-send-mail, .btn-request-upload {
              padding: 10px 18px;
              font-size: 0.9rem;
            }
            .view-button {
              padding: 6px 12px;
              font-size: 0.8rem;
            }
            .header-section {
              flex-direction: column;
              align-items: center;
              gap: 12px;
              padding: 20px;
            }
            .print-logo, .print-photo {
              width: 60px;
            }
            .main-title {
              font-size: 2.1rem;
            }
            .sub-title {
              font-size: 1.5rem;
            }
            .application-title {
              font-size: 1.9rem;
            }
            .modal-content, .modal-form {
              max-width: 100vw;
              max-height: 90vh;
              padding: 20px;
            }
            .modal-input {
              padding: 10px;
              font-size: 0.9rem;
            }
            .document-card {
              padding: 16px;
              min-height: 160px;
            }
            .section-container {
              padding: 20px;
            }
            .marksheet-img {
              width: 60px;
              height: 60px;
            }
            .verification-button {
              width: 28px;
              height: 28px;
            }
            .tick-mark, .cross-mark {
              width: 16px;
              height: 16px;
            }
            .tick-mark::before {
              width: 4px;
              height: 10px;
              top: 5px;
              left: 7px;
            }
            .tick-mark::after {
              width: 4px;
              height: 6px;
              top: 7px;
              left: 3px;
            }
            .cross-mark::before, .cross-mark::after {
              width: 10px;
              height: 4px;
              top: 6px;
              left: 3px;
            }
            .loading-spinner {
              width: 36px;
              height: 36px;
            }
            .loading-spinner::before {
              top: 3px;
              left: 3px;
              right: 3px;
              bottom: 3px;
            }
            .loading-text {
              font-size: 1rem;
            }
          }
       @media print {
     
      body {
        font-size: 12pt;
      }
      .card {
        background: none;
        border: none;
        box-shadow: none;
        padding: 15px;
      }
      .header-section {
        background: none;
        border: none;
        box-shadow: none;
        padding: 10mm 0;
        page-break-after: avoid;
      }
      .main-title {
        font-size: 1.5rem;
      }
      .application-title {
        font-size: 1.5rem;
        margin-top: 10mm;
        margin-bottom: 10mm;
      }
        .section-container {
        background: none;
    
        padding: 0;
        margin-bottom: 2mm;
      
      }
      .no-print, .section-icon {
        display: none;
      }

     
      .section-container::before, .section-title::after {
        display: none;

      }
    }
      .payment-status {
        position:relative;
        left:10px;
      }
      .section-title{
      font-size: 1.5rem;
      }
     .print-logo {
        left:10px;
        position:relative;
      }
      .print-photo {
        right:20px;
        position:relative;
      }
      .btn-print {
      background: linear-gradient(135deg, #14B8A6, #2DD4BF);
      border-radius: 12px;
      color: white;
      padding: 12px 24px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(20, 184, 166, 0.4);
      position: relative;
      overflow: hidden;
    }
    .btn-print::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    .btn-print:hover::before {
      left: 100%;
    }
    .btn-print:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(20, 184, 166, 0.5);
      background: linear-gradient(135deg, #0D9488, #14B8A6);
    }
    @media (max-width: 640px) {
      .btn-print {
        padding: 10px 18px;
        font-size: 0.9rem;
      }
    }
    .btn-send-mail {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #EF4444;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-send-mail:hover:not(.btn-disabled) {
  background-color: #DC2626;
}

.btn-send-mail.btn-disabled {
  background-color: #D1D5DB;
  color: #6B7280;
  cursor: not-allowed;
  opacity: 0.7;
}
        `}
      </style>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex justify-start mb-6 no-print"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/application-verification')}
          className="btn-back "
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Applications
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-container"
          >
            <div className="loading-spinner" />
            <p className="loading-text">
              <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span>
              <span> </span><span>s</span><span>t</span><span>u</span><span>d</span><span>e</span><span>n</span><span>t</span>
              <span> </span><span>d</span><span>a</span><span>t</span><span>a</span><span>.</span><span>.</span><span>.</span>
            </p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center mt-8 card p-8 w-full max-w-sm"
          >
            <p className="text-lg font-medium text-red-500">Error: {error}</p>
            <button onClick={handleRetry} className="ml-4 btn-back">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    
<motion.div
  ref={printRef}
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: 'easeOut' }}
  className="w-full max-w-7xl card p-8 sm:p-12 lg:p-10 print-border"
>
  <div className="header-section mb-10">
    <div className="flex items-center space-x-6">
      {imageLoading.logo && (
        <div className="w-20 h-20 rounded-xl bg-gray-100 animate-pulse flex items-center justify-center no-print">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      <motion.img
        src="/Logo.png"
        alt="Periyar University Logo"
        className={`w-20 h-20 print-logo rounded-xl object-cover border border-gray-200 ${imageLoading.logo ? 'hidden' : ''}`}
        onLoad={() => handleImageLoad('logo')}
        onError={(e) => handleImageError(e, 'logo', '/default-image.png')}
        transition={{ type: 'spring', stiffness: 500 }}
      />
      <div>
        <h1 className="main-title">Periyar University</h1>
        <p className="text-base text-gray-600 mt-2">Salem-636 011, Tamil Nadu, India</p>
        <p className="text-sm text-gray-500">NAAC A++ | NIRF Rank 56 | State Public University Rank 25</p>
      </div>
    </div>
    {student_details?.photo.proxyUrl && student_details.photo.proxyUrl !== '/default-image.png' && (
      <div className="relative">
        {imageLoading.photo && (
          <div className="w-24 h-32 rounded-xl bg-gray-100 animate-pulse flex items-center justify-center no-print">
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        )}
        <img
          src={student_details.photo.proxyUrl}
          alt="Student Photo"
          className={`w-24 h-32 print-photo rounded-xl object-cover border border-gray-200 ${imageLoading.photo ? 'hidden' : ''}`}
          onLoad={() => handleImageLoad('photo')}
          onError={(e) => handleImageError(e, 'photo', '/default-image.png')}
        />
      </div>
    )}
  </div>
  <div className="mb-6">
    <h2 className="application-title mb-9">Online Learning Programme (OL) Admission for the Calendar Year 2025</h2>
    <div className="application-details-row">
      <p>
        <span className="application-detail-label">Application No: </span>
        <span className="application-detail-value">{paymentDetails?.application_id || 'N/A'}</span>
      </p>
      <p>
        <span className="application-detail-label">Applied Date: </span>
        <span className="application-detail-value mr-10">
          {paymentDetails?.created_at ? moment(paymentDetails.created_at).format('DD-MM-YYYY') : 'N/A'}
        </span>
      </p>
    </div>
    <div className="lsc-container">
      <p>
        <span className="application-detail-label">LSC: </span>
        <span className="application-detail-value">CDOE - Centre for Distance and Online Education (LC2101)</span>
      </p>
    </div>
  </div>

        {/* Personal Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="section-container personal"
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div whileHover={{ rotate: 360 }} className="section-icon">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </motion.div>
            <h3 className="section-title">Personal Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Name', value: student?.name },
              { label: 'Email', value: student?.email },
              { label: 'Phone', value: student?.phone },
              { label: 'Name as per Aadhaar', value: application?.name_as_aadhaar },
              { label: 'Aadhaar Number', value: application?.aadhaar_no },
              { label: 'Date of Birth', value: application?.dob },
              { label: "Father's Name", value: application?.father_name },
              { label: "Father's Occupation", value: application?.father_occupation },
              { label: "Mother's Name", value: application?.mother_name },
              { label: "Mother's Occupation", value: application?.mother_occupation },
              { label: "Guardian's Name", value: application?.guardian_name },
              { label: "Guardian's Occupation", value: application?.guardian_occupation },
              { label: 'Nationality', value: application?.nationality },
              { label: 'Religion', value: application?.religion },
              { label: 'Community', value: application?.community },
              { label: 'Mother Tongue', value: application?.mother_tongue },
            ].map((field, index) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                className="form-field field-container"
              >
                <span className="field-label block">{field.label}</span>
                <span className="field-value">{field.value || 'N/A'}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

          {/* Application Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="section-container application mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <motion.div whileHover={{ rotate: 360 }} className="section-icon">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </motion.div>
              <h3 className="section-title text-xl font-semibold text-gray-800">Application Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Mode of Study', value: application?.mode_of_study },
                { label: 'Programme Applied', value: application?.programme_applied },
                { label: 'Course', value: application?.course },
                { label: 'Medium', value: application?.medium },
                { label: 'Academic Year', value: application?.academic_year },
                { label: 'DEB ID', value: application?.deb_id },
                { label: 'ABC ID', value: application?.abc_id },
              ].map((field, index) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                  className="form-field field-container"
                >
                  <span className="field-label block text-gray-600">{field.label}</span>
                  <span className="field-value text-gray-800">{field.value || 'N/A'}</span>
                </motion.div>
              ))}
            </div>
            {/* Payment Status Section */}
            <div className="mt-6">
              <h4 className="text-lg payment-status font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Payment Status</h4>
              {paymentLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner" />
                  <p className="loading-text">
                    {['L', 'o', 'a', 'd', 'i', 'n', 'g', ' ', 'p', 'a', 'y', 'm', 'e', 'n', 't', ' ', 'd', 'e', 't', 'a', 'i', 'l', 's', '.', '.', '.'].map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </p>
                </div>
              ) : paymentError ? (
                <p className="text-red-500 text-base">{paymentError}</p>
              ) : paymentDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Order ID', value: paymentDetails.transaction_id },
                    { label: 'Amount', value: `₹${paymentDetails.amount}` },
                    { label: 'Status', value: paymentDetails.payment_status },
                    { label: 'Payment Mode', value: paymentDetails.payment_mode },
                    { label: 'Bank Name', value: paymentDetails.bank_name },
                    { label: 'Transaction Date & Time', value: new Date(paymentDetails.created_at).toLocaleString() },
                  ].map((field, index) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * (index + 10), duration: 0.4 }}
                      className="form-field field-container"
                    >
                      <span className="field-label block text-gray-600">{field.label}</span>
                      <span className="field-value text-gray-800">{field.value || 'N/A'}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-base">No payment details available.</p>
              )}
            </div>
          </motion.div>
        {/* Educational Qualifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="section-container education"
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div whileHover={{ rotate: 360 }} className="section-icon">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </motion.div>
            <h3 className="section-title">Educational Qualifications</h3>
          </div>
          {student_details?.qualifications?.length > 0 ? (
            student_details.qualifications.map((qual, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b border-gray-200 pb-4 mb-4"
              >
                <div className="form-field field-container">
                  <span className="field-label block">Course</span>
                  <span className="field-value">{qual.course || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Institute</span>
                  <span className="field-value">{qual.institute_name || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Board</span>
                  <span className="field-value">{qual.board || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Subjects Studied</span>
                  <span className="field-value">{qual.subject_studied || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Register Number</span>
                  <span className="field-value">{qual.reg_no || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Percentage</span>
                  <span className="field-value">{qual.percentage || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Month/Year</span>
                  <span className="field-value">{qual.month_year || 'N/A'}</span>
                </div>
                <div className="form-field field-container">
                  <span className="field-label block">Mode of Study</span>
                  <span className="field-value">{qual.mode_of_study || 'N/A'}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 text-base">No qualifications provided.</p>
          )}
          {student_details?.semester_marks?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Semester Marks</h4>
              {student_details.semester_marks.map((semester, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                  className="mt-4 border-t border-gray-200 pt-4"
                >
                  <p className="font-semibold text-base text-gray-800">Semester: {semester.semester || 'N/A'}</p>
                  {semester.subjects?.map((subject, subIndex) => (
                    <div key={subIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-2 mt-2">
                      <div className="form-field field-container">
                        <span className="field-label block">Subject</span>
                        <span className="field-value">{subject.subject_name || 'N/A'}</span>
                      </div>
                      <div className="form-field field-container">
                        <span className="field-label block">Category</span>
                        <span className="field-value">{subject.category || 'N/A'}</span>
                      </div>
                      <div className="form-field field-container">
                        <span className="field-label block">Max Marks</span>
                        <span className="field-value">{subject.max_marks || 'N/A'}</span>
                      </div>
                      <div className="form-field field-container">
                        <span className="field-label block">Obtained Marks</span>
                        <span className="field-value">{subject.obtained_marks || 'N/A'}</span>
                      </div>
                      <div className="form-field field-container">
                        <span className="field-label block">Month/Year</span>
                        <span className="field-value">{subject.month_year || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[
              { label: 'Total Max Marks', value: student_details?.total_max_marks },
              { label: 'Total Obtained Marks', value: student_details?.total_obtained_marks },
              { label: 'Percentage', value: student_details?.percentage },
              { label: 'CGPA', value: student_details?.cgpa },
              { label: 'Overall Grade', value: student_details?.overall_grade },
              { label: 'Class Obtained', value: student_details?.class_obtained },
              { label: 'Current Designation', value: student_details?.current_designation },
              { label: 'Current Institute', value: student_details?.current_institute },
              { label: 'Years of Experience', value: student_details?.years_experience },
              { label: 'Annual Income', value: student_details?.annual_income },
            ].map((field, index) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                className="form-field field-container"
              >
                <span className="field-label block">{field.label}</span>
                <span className="field-value">{field.value || 'N/A'}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Uploaded Documents Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="section-container documents no-print"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ rotate: 360 }} className="section-icon">
                <DocumentTextIcon className="h-6 w-6 text-rose-600" />
              </motion.div>
              <h3 className="section-title">Uploaded Documents</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'photo', label: 'Photo', isImage: true },
              { key: 'signature', label: 'Signature', isImage: true },
              { key: 'sslc_marksheet', label: 'SSLC Marksheet', isImage: false },
              { key: 'hsc_marksheet', label: 'HSC Marksheet', isImage: false },
              { key: 'ug_marksheet', label: 'UG Marksheet', isImage: false },
              { key: 'semester_marksheet', label: 'Semester Marksheet', isImage: false },
              { key: 'community_certificate', label: 'Community Certificate', isImage: false },
              { key: 'aadhaar', label: 'Aadhaar Card', isImage: false },
              { key: 'transfer_certificate', label: 'Transfer Certificate', isImage: false },
            ].map(({ key, label, isImage }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.5 }}
                className={`document-card ${documentVerification[key] ? 'verified' : 'not-verified'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                  <span className="text-base font-semibold text-gray-800">{label}</span>
                </div>
                {student_details?.[key].proxyUrl && student_details[key].proxyUrl !== (isImage ? '/default-image.png' : '#') ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDocumentVerify(key, label)}
                      className="verification-button"
                      aria-label={documentVerification[key] ? 'Unverify Document' : 'Verify Document'}
                      title={documentVerification[key] ? 'Click to Unverify' : 'Click to Verify'}
                    >
                      {documentVerification[key] ? (
                        <span className="tick-mark" />
                      ) : (
                        <span className="cross-mark" />
                      )}
                    </motion.div>
                    <div className="flex flex-col gap-4">
                      {isImage && (
                        <>
                          {imageLoading[key] && (
                            <div className="w-16 h-16 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center no-print">
                              <span className="text-gray-400 text-sm">Loading...</span>
                            </div>
                          )}
                          <motion.img
                            src={student_details[key].proxyUrl}
                            alt={label}
                            className={`marksheet-img w-16 h-16 object-cover ${imageLoading[key] ? 'hidden' : ''}`}
                            onLoad={() => handleImageLoad(key)}
                            onError={(e) => handleImageError(e, key, '/default-image.png')}
                            whileHover={{ scale: 1.15 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          />
                        </>
                      )}
                      <div className="document-actions">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(student_details[key], isImage, label)}
                          className="view-button"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </motion.button>
                        {!documentVerification[key] && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openInvalidateModal(key, label)}
                            className="btn-invalid"
                          >
                            <XCircleIcon className="h-4 w-4" />
                            Invalid
                          </motion.button>
                        )}
                      </div>
                      {invalidReasons[key] && (
                        <div className="mt-2 text-sm text-red-600">
                          Invalid Reason: {invalidReasons[key].reason}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <span className="text-gray-500 text-base mt-auto">Not Uploaded</span>
                    <div className="document-actions">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openRequestUploadModal(key, label)}
                        className="btn-request-upload"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                        Request Upload
                      </motion.button>
                    </div>
                    {uploadRequests[key] && (
                      <div className="mt-2 text-sm text-blue-600">
                        Request Query: {uploadRequests[key].query}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Address Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="section-container address"
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div whileHover={{ rotate: 360 }} className="section-icon">
              <HomeIcon className="h-6 w-6 text-teal-600" />
            </motion.div>
            <h3 className="section-title">Address Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Communication Town', value: application?.comm_town },
              { label: 'Communication District', value: application?.comm_district },
              { label: 'Communication State', value: application?.comm_state },
              { label: 'Communication Country', value: application?.comm_country },
              { label: 'Communication Pincode', value: application?.comm_pincode },
              { label: 'Communication Area', value: application?.comm_area },
            ].map((field, index) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                className="form-field field-container"
              >
                <span className="field-label block">{field.label}</span>
                <span className="field-value">{field.value || 'N/A'}</span>
              </motion.div>
            ))}
            {application?.same_as_comm ? (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * 6, duration: 0.4 }}
                className="form-field field-container col-span-full"
              >
                <span className="field-label block">Permanent Address</span>
                <span className="field-value">Same as Communication Address</span>
              </motion.div>
            ) : (
              [
                { label: 'Permanent Town', value: application?.perm_town },
                { label: 'Permanent District', value: application?.perm_district },
                { label: 'Permanent State', value: application?.perm_state },
                { label: 'Permanent Country', value: application?.perm_country },
                { label: 'Permanent Pincode', value: application?.perm_pincode },
                { label: 'Permanent Area', value: application?.perm_area },
              ].map((field, index) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * (index + 6), duration: 0.4 }}
                  className="form-field field-container"
                >
                  <span className="field-label block">{field.label}</span>
                  <span className="field-value">{field.value || 'N/A'}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Additional Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="section-container additional"
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div whileHover={{ rotate: 360 }} className="section-icon">
              <InformationCircleIcon className="h-6 w-6 text-amber-600" />
            </motion.div>
            <h3 className="section-title">Additional Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Differently Abled', value: application?.differently_abled },
              ...(application?.differently_abled === 'Yes' ? [{ label: 'Disability Type', value: application?.disability_type }] : []),
              { label: 'Blood Group', value: application?.blood_group },
              { label: 'Access to Internet', value: application?.access_internet },
            ].map((field, index) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                className="form-field field-container"
              >
                <span className="field-label block">{field.label}</span>
                <span className="field-value">{field.value || 'N/A'}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Declaration Section */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.6 }}
    className="section-container additional mt-8"
  >
    <div className="flex items-center space-x-4 mb-6">
      <motion.div whileHover={{ rotate: 360 }} className="section-icon">
        <DocumentTextIcon className="h-6 w-6 text-amber-600" />
      </motion.div>
      <h3 className="section-title">Declaration</h3>
    </div>
    <div className="form-field field-container">
      <p className="field-value text-gray-800">
        I declare that the information given above is true to the best of my knowledge and that I shall, if admitted abide by the rules of the University.
      </p>
      <div className="mt-8 flex flex-row justify-between items-start space-x-4 ">
        <div className="flex flex-col items-start space-y-2">
          <p className="field-label">Date: {moment().format('DD-MM-YYYY')}</p>
          <p className="field-label">Place: {application?.comm_town || 'N/A'}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <p className="field-label mt-4">Signature of the Applicant</p>
          {student_details?.signature?.proxyUrl && student_details.signature?.proxyUrl !== '/default-image.png' && (
            <motion.img
              src={student_details.signature.proxyUrl}
              alt="Signature"
              className={`w-32 h-20 object-contain ${imageLoading.signature ? 'hidden' : ''}`}
              onLoad={() => handleImageLoad('signature')}
              onError={(e) => handleImageError(e, 'signature', '/default-image.png')}
              transition={{ type: 'spring', stiffness: 500 }}
            />
          )}
        </div>
      </div>
    </div>
  </motion.div>

        {/* Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="section-container status no-print"
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div whileHover={{ rotate: 360 }} className="section-icon">
              <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
            </motion.div>
            <h3 className="section-title">Status</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
            <div className="form-field field-container">
              <label className="field-label block">Eligibility Status</label>
              <select
                className="select-field"
                value={eligibilityStatus}
                onChange={(e) => setEligibilityStatus(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>
            {eligibilityStatus === 'Not Eligible' && (
              <div className="form-field field-container">
                <label className="field-label block">If Not Eligible (Reason)</label>
                <input
                  type="text"
                  className="input-field"
                  value={notEligibleReason}
                  onChange={(e) => setNotEligibleReason(e.target.value)}
                  placeholder="Enter reason"
                />
              </div>
            )}
            <div className="form-field field-container no-print">
              <label className="field-label block">Admission Status</label>
              <select
                className="select-field"
                value={admissionStatus}
                onChange={(e) => setAdmissionStatus(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Not Confirmed">Not Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            {admissionStatus === 'Not Confirmed' && (
              <div className="form-field field-container">
                <label className="field-label block">If Admission is not Confirmed (Reason)</label>
                <input
                  type="text"
                  className="input-field"
                  value={notAdmittedReason}
                  onChange={(e) => setNotAdmittedReason(e.target.value)}
                  placeholder="Enter reason"
                />
              </div>
            )}
            {eligibilityStatus === 'Eligible' && admissionStatus === 'Confirmed' && (
              <div className="form-field field-container">
                <label className="field-label block">Enrollment No. Allotted</label>
                <input
                  type="text"
                  className="input-field"
                  value={enrollmentNumber}
                  readOnly
                />
              </div>
            )}
          </div>
        </motion.div>

        

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex flex-wrap justify-between gap-4 no-print"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/application-verification')}
            className="btn-back"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Applications
          </motion.button>

             <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handlePrint}
    className="btn-print"
  >
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>
    Print
  </motion.button>
      
          {eligibilityStatus === 'Eligible' && admissionStatus === 'Confirmed' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="btn-save"
              disabled={!enrollmentNumber}
            >
              <CheckCircleIcon className="h-5 w-5" />
              Save
            </motion.button>
          ) : (
           <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onClick}
        className={`btn-send-mail ${disabled ? 'btn-disabled' : ''}`}
        disabled={disabled}
      >
        {text === 'Send Mail for Invalid Certificates' && <XCircleIcon className="h-5 w-5 mr-2" />}
        {text}
      </motion.button>
         )}
        </motion.div>

        {/* Document Viewer Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal-content"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          aria-label="Document Viewer Modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {modalContent ? (modalContent.isImage ? 'Image Viewer' : 'Document Viewer') : 'Viewer'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              className="modal-button"
            >
              Close
            </motion.button>
          </motion.div>
          {modalContent && modalContent.proxyUrl ? (
            modalContent.isImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                <img
                  src={modalContent.proxyUrl}
                  alt={modalContent.fileName || 'Document'}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl border border-gray-200"
                />
                <div className="flex gap-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={modalContent.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 text-base font-medium"
                  >
                    Open in New Tab
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={modalContent.proxyUrl}
                    download
                    className="download-button"
                    onClick={() => console.log(`Downloading ${modalContent.fileName} from ${modalContent.proxyUrl}`)}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </motion.a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                {isFileLoading ? (
                  <div className="flex items-center justify-center h-[65vh]">
                    <p className="loading-text">
                      <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span>
                      <span> </span><span>d</span><span>o</span><span>c</span><span>u</span><span>m</span><span>e</span><span>n</span><span>t</span><span>.</span><span>.</span><span>.</span>
                    </p>
                  </div>
                ) : fileLoadError ? (
                  <div className="flex flex-col items-center justify-center h-[65vh]">
                    <p className="text-red-500 text-lg font-medium">Error: {fileLoadError}</p>
                    <div className="flex gap-4 mt-4">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={modalContent.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 text-base font-medium"
                      >
                        Open in New Tab
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={modalContent.proxyUrl}
                        download
                        className="download-button"
                        onClick={() => console.log(`Downloading ${modalContent.fileName} from ${modalContent.proxyUrl}`)}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </motion.a>
                    </div>
                  </div>
                ) : pdfBlobUrl ? (
                  <>
                    <Document
                      file={pdfBlobUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={
                        <div className="flex items-center justify-center h-[65vh]">
                          <p className="loading-text">
                            <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span>
                            <span> </span><span>P</span><span>D</span><span>F</span><span>.</span><span>.</span><span>.</span>
                          </p>
                        </div>
                      }
                    >
                      {numPages &&
                        Array.from(new Array(numPages), (el, index) => (
                          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </Document>
                    <div className="flex gap-4">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={modalContent.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 text-base font-medium"
                      >
                        Open in New Tab
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={modalContent.proxyUrl}
                        download
                        className="download-button"
                        onClick={() => console.log(`Downloading ${modalContent.fileName} from ${modalContent.proxyUrl}`)}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </motion.a>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[65vh]">
                    <div className="loading-spinner" />
                    <p className="loading-text">
                      <span>F</span><span>e</span><span>t</span><span>c</span><span>h</span><span>i</span><span>n</span><span>g</span>
                      <span> </span><span>P</span><span>D</span><span>F</span><span>.</span><span>.</span><span>.</span>
                    </p>
                  </div>
                )}
              </motion.div>
            )
          ) : (
            <p className="text-gray-600 text-base">No document available.</p>
          )}
        </Modal>
        {/* Invalidate Modal */}
  <Modal
    isOpen={invalidateModalIsOpen}
    onRequestClose={closeInvalidateModal}
    className="modal-content"
    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    aria-label="Invalidate Document Modal"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="modal-form"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Invalidate {invalidateDocumentLabel}
      </h2>
      <div className="mb-6">
        <label className="field-label block mb-2">Reason for Invalidation</label>
        <textarea
          className="modal-input resize-none h-32"
          value={invalidateReason}
          onChange={(e) => setInvalidateReason(e.target.value)}
          placeholder="Enter the reason for invalidation..."
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(168, 85, 247, 0.1)',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
      <div className="flex justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={closeInvalidateModal}
          className="modal-button"
        >
          Cancel
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInvalidateSubmit}
          className="modal-submit-button"
          disabled={!invalidateReason.trim()}
        >
          Save
        </motion.button>
      </div>
    </motion.div>
  </Modal>

  {/* Request Upload Modal */}
  <Modal
    isOpen={requestUploadModalIsOpen}
    onRequestClose={closeRequestUploadModal}
    className="modal-content"
    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    aria-label="Request Upload Modal"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="modal-form"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Request Upload for {requestDocumentLabel}
      </h2>
      <div className="mb-6">
        <label className="field-label block mb-2">Upload Query</label>
        <textarea
          className="modal-input resize-none h-32"
          value={requestQuery}
          onChange={(e) => setRequestQuery(e.target.value)}
          placeholder="Enter the query for document upload..."
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(16, 185, 129, 0.1)',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
      <div className="flex justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={closeRequestUploadModal}
          className="modal-button"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRequestUploadSubmit}
          className="modal-submit-button"
          disabled={!requestQuery.trim()}
        >
          Save
        </motion.button>
        
      </div>
    </motion.div>
  </Modal>
      </motion.div>
    </div>
  );
};

export default StudentDetailsUI;