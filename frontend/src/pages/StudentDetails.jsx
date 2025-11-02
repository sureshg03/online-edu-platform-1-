import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Modal from 'react-modal';
import { pdfjs } from 'react-pdf';
import StudentDetailsUI from './StudentDetailsUI';
import VerificationModal from '../components/VerificationModal';

// Set the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Bind modal to app element for accessibility
Modal.setAppElement('#root');

// Debounce function to limit toast notifications
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Utility to construct proxy URLs
const getDirectGoogleDriveUrl = (url, isImage = true, fieldName = 'unknown') => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return isImage ? '/default-image.png' : { proxyUrl: '#', directUrl: '#' };
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return isImage ? '/default-image.png' : { proxyUrl: '#', directUrl: '#' };
  }

  if (url.includes('drive.google.com')) {
    const patterns = [
      /\/file\/d\/([^/]+)\/?/,
      /id=([^&]+)/,
      /\/d\/([^/]+)\/?/,
    ];
    let fileId = null;
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }
    if (fileId) {
      const proxyUrl = isImage
        ? `/api/proxy-image/${fileId}?token=${encodeURIComponent(token)}`
        : `/api/proxy-file/${fileId}?token=${encodeURIComponent(token)}`;
      const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      return { proxyUrl, directUrl };
    }
  }
  return isImage ? '/default-image.png' : { proxyUrl: '#', directUrl: '#' };
};

// Validate if blob is likely a PDF by checking magic number
const isPdfBlob = async (blob) => {
  try {
    const arrayBuffer = await blob.slice(0, 5).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfMagicNumber = [37, 80, 68, 70]; // %PDF
    return pdfMagicNumber.every((byte, i) => uint8Array[i] === byte);
  } catch (err) {
    return false;
  }
};

// Fetch PDF with authentication, retry logic
const fetchPdfFile = async (proxyUrl, directUrl, fileName, retries = 3, delay = 2000) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(proxyUrl, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: '*/*',
        },
        responseType: 'blob',
        timeout: 120000,
      });

      const contentType = response.headers['content-type'] || 'application/octet-stream';
      if (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
        throw new Error(`Invalid content type received: ${contentType}`);
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      if (contentType.includes('application/octet-stream')) {
        const isValidPdf = await isPdfBlob(blob);
        if (!isValidPdf) {
          throw new Error(`Received application/octet-stream but blob is not a valid PDF`);
        }
      }

      return URL.createObjectURL(blob);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw new Error('Authentication failed. Please log in again.');
      }
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  try {
    const response = await axios.get(directUrl, {
      responseType: 'blob',
      timeout: 120000,
      headers: {
        Accept: '*/*',
      },
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    if (contentType.includes('text/html')) {
      throw new Error('Direct URL returned an HTML page instead of a PDF');
    }

    if (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
      throw new Error(`Invalid content type received from direct URL: ${contentType}`);
    }

    const blob = new Blob([response.data], { type: 'application/pdf' });
    if (contentType.includes('application/octet-stream')) {
      const isValidPdf = await isPdfBlob(blob);
      if (!isValidPdf) {
        throw new Error(`Direct URL returned application/octet-stream but blob is not a valid PDF`);
      }
    }

    return URL.createObjectURL(blob);
  } catch (err) {
    throw new Error(`Failed to fetch PDF after ${retries} attempts and direct URL fallback: ${err.message}`);
  }
};

// Utility to generate enrollment number
const generateEnrollmentNumber = (identifier, programmeCode = 'UG') => {
  const year = new Date().getFullYear().toString().slice(-2);
  const idNumber = identifier ? identifier.toString().padStart(4, '0') : '0000';
  return `${year}${programmeCode}${idNumber}`;
};

const StudentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const printRef = useRef(null);
  const email = new URLSearchParams(location.search).get('email');
  const studentId = location.state?.id;

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState({
    logo: true,
    photo: true,
    signature: true,
    sslc_marksheet: true,
    hsc_marksheet: true,
    ug_marksheet: true,
    semester_marksheet: true,
    community_certificate: true,
    aadhaar: true,
    transfer_certificate: true,
  });
  const [isVerified, setIsVerified] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    proxyUrl: '',
    directUrl: '',
    isImage: true,
    fileName: '',
  });
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [fileLoadError, setFileLoadError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [documentVerification, setDocumentVerification] = useState({
    photo: false,
    signature: false,
    sslc_marksheet: false,
    hsc_marksheet: false,
    ug_marksheet: false,
    semester_marksheet: false,
    community_certificate: false,
    aadhaar: false,
    transfer_certificate: false,
  });
  const [documentInvalidReasons, setDocumentInvalidReasons] = useState({});
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [eligibilityStatus, setEligibilityStatus] = useState('');
  const [notEligibleReason, setNotEligibleReason] = useState('');
  const [admissionStatus, setAdmissionStatus] = useState('');
  const [notAdmittedReason, setNotAdmittedReason] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  const debouncedToast = useCallback(
    debounce((message, type = 'error') => {
      if (type === 'success') {
        toast.success(message, { position: 'top-right' });
      } else {
        toast.error(message, { position: 'top-right' });
      }
    }, 1000),
    [],
  );

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    setPaymentError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      if (!email) {
        throw new Error('Email parameter is missing.');
      }

      const headers = { Authorization: `Token ${token}` };
      const response = await axios.get(
        `/api/student-details-preview/?email=${encodeURIComponent(email)}`,
        { headers, timeout: 30000 },
      );
      console.log('Student details preview response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to fetch student data.');
      }

      const data = response.data.data;
      const studentDetails = data.student_details || {};
      const paymentData = data.payment || {};
      const combinedData = {
        student: data.student || {},
        application: data.application || {},
        student_details: {
          qualifications: studentDetails.qualifications || [],
          semester_marks: studentDetails.semester_marks || [],
          total_max_marks: studentDetails.total_max_marks || '',
          total_obtained_marks: studentDetails.total_obtained_marks || '',
          percentage: studentDetails.percentage || '',
          cgpa: studentDetails.cgpa || '',
          overall_grade: studentDetails.overall_grade || '',
          class_obtained: studentDetails.class_obtained || '',
          current_designation: studentDetails.current_designation || '',
          current_institute: studentDetails.current_institute || '',
          years_experience: studentDetails.years_experience || '',
          annual_income: studentDetails.annual_income || '',
          photo: getDirectGoogleDriveUrl(studentDetails.photo_url, true, 'photo_url'),
          signature: getDirectGoogleDriveUrl(studentDetails.signature_url, true, 'signature_url'),
          sslc_marksheet: getDirectGoogleDriveUrl(studentDetails.sslc_marksheet_url, false, 'sslc_marksheet_url'),
          hsc_marksheet: getDirectGoogleDriveUrl(studentDetails.hsc_marksheet_url, false, 'hsc_marksheet_url'),
          ug_marksheet: getDirectGoogleDriveUrl(studentDetails.ug_marksheet_url, false, 'ug_marksheet_url'),
          semester_marksheet: getDirectGoogleDriveUrl(studentDetails.semester_marksheet_url, false, 'semester_marksheet_url'),
          community_certificate: getDirectGoogleDriveUrl(studentDetails.community_certificate_url, false, 'community_certificate_url'),
          aadhaar: getDirectGoogleDriveUrl(studentDetails.aadhaar_url, false, 'aadhaar_url'),
          transfer_certificate: getDirectGoogleDriveUrl(studentDetails.transfer_certificate_url, false, 'transfer_certificate_url'),
        },
      };

      setPreviewData(combinedData);
      setIsVerified(combinedData.student?.is_verified || false);
      setDocumentVerification({
        photo: studentDetails.photo_verified || false,
        signature: studentDetails.signature_verified || false,
        sslc_marksheet: studentDetails.sslc_marksheet_verified || false,
        hsc_marksheet: studentDetails.hsc_marksheet_verified || false,
        ug_marksheet: studentDetails.ug_marksheet_verified || false,
        semester_marksheet: studentDetails.semester_marksheet_verified || false,
        community_certificate: studentDetails.community_certificate_verified || false,
        aadhaar: studentDetails.aadhaar_verified || false,
        transfer_certificate: studentDetails.transfer_certificate_verified || false,
      });
      setEligibilityStatus(studentDetails.eligibility_status || '');
      setNotEligibleReason(studentDetails.not_eligible_reason || '');
      setAdmissionStatus(studentDetails.admission_status || '');
      setNotAdmittedReason(studentDetails.not_admitted_reason || '');
      setEnrollmentNumber(studentDetails.enrollment_number || '');
      setDocumentInvalidReasons(studentDetails.document_invalid_reasons || {});

      if (Object.keys(paymentData).length > 0) {
        console.log('Payment data received:', paymentData);
        setPaymentDetails({
          application_id: paymentData.application_id || 'N/A',
          transaction_id: paymentData.transaction_id || 'N/A',
          amount: paymentData.amount || '0.00',
          payment_status: paymentData.payment_status ? paymentData.payment_status.toUpperCase() : 'UNKNOWN',
          payment_mode: paymentData.payment_mode || 'UPI',
          created_at: paymentData.created_at || new Date().toISOString(),
          bank_name: paymentData.bank_name || '',
        });
      } else {
        console.warn('No payment data found in response');
        setPaymentError('No payment details available for this student');
        debouncedToast('No payment details available for this student');
      }
      if (!studentDetails.photo_url || !studentDetails.signature_url) {
        debouncedToast('Some documents (photo or signature) are missing for this student.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load student data.';
      console.error('Student data fetch error:', err);
      setError(errorMessage);
      setPaymentError('Failed to load payment details due to student data error');
      debouncedToast(errorMessage);
      if (errorMessage.includes('token') || errorMessage.includes('Authentication')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    async function fetchApplicationStatus() {
      if (!previewData?.student?.email || !paymentDetails?.application_id) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-student-details-admin/?email=${encodeURIComponent(previewData.student.email)}`,
          { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
        );
        const appStatus = response.data.data.application_status;
        if (appStatus && ['Not Confirmed', 'Cancelled'].includes(appStatus.status)) {
          setEmailSent(true);
          setStatusSaved(true);
          setAdmissionStatus(appStatus.status);
          setNotAdmittedReason(appStatus.reason || '');
          console.log('Application status loaded:', appStatus);
        }
      } catch (err) {
        console.error('Error fetching application status:', err);
        toast.error('Failed to load application status.', {
          duration: 4000,
          style: {
            background: '#F43F5E',
            color: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        });
      }
    }

    fetchApplicationStatus();
  }, [previewData?.student?.email, paymentDetails?.application_id]);

  useEffect(() => {
    if (!email) {
      setError('Email parameter is missing. Please select a student from the list.');
      setLoading(false);
      debouncedToast('Email parameter is missing.');
      navigate('/application-verification');
      return;
    }
    fetchStudentData();
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [email, navigate, debouncedToast, pdfBlobUrl]);

  const handleRetry = async () => {
    fetchStudentData();
  };

  const handleImageLoad = (key) => {
    setImageLoading((prev) => ({ ...prev, [key]: false }));
  };

  const handleImageError = (e, key, fallback) => {
    e.target.src = fallback;
    setImageLoading((prev) => ({ ...prev, [key]: false }));
    debouncedToast(`Failed to load ${key}. Using placeholder image.`);
    if (e.target.status === 401 || e.target.status === 403) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      if (!email) {
        throw new Error('Email parameter is missing.');
      }

      const response = await axios.get(`/api/student-info/${encodeURIComponent(email)}/`, {
        headers: { Authorization: `Token ${token}` },
        timeout: 30000 },
      );

      if (response.data.status === 'success') {
        setInitialData(response.data.data);
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }

      setIsVerificationModalOpen(true);
    } catch (err) {
      debouncedToast(err.message || 'Failed to fetch student info.');
      if (err.response?.status === 404) {
        setIsEditMode(false);
        setIsVerificationModalOpen(true);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleVerificationSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const payload = {
        email: formData.email,
        temp_register_no: formData.temp_register_no,
        password: formData.password,
      };
      let response;
      if (isEditMode) {
        response = await axios.put(
          `/api/update-student-info/${encodeURIComponent(email)}/`,
          payload,
          {
            headers: { Authorization: `Token ${token}` },
            timeout: 30000,
          },
        );
      } else {
        response = await axios.post(
          '/api/verify-student/',
          payload,
          {
            headers: { Authorization: `Token ${token}` },
            timeout: 30000,
          },
        );
      }
      if (response.status === 200 || response.data.status === 'success') {
        debouncedToast(isEditMode ? 'Student info updated successfully!' : 'Student verified successfully!', 'success');
        setIsVerified(true);
        setIsVerificationModalOpen(false);
        setInitialData(null);
        setIsEditMode(false);
        fetchStudentData();
      } else {
        throw new Error(response.data.message || 'Operation failed.');
      }
    } catch (err) {
      debouncedToast(err.message || `Failed to ${isEditMode ? 'update' : 'verify'} student.`);
    }
  };

  const handleDocumentVerify = async (docKey, fileName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      if (!email) {
        throw new Error('Email parameter is missing.');
      }

      const isCurrentlyVerified = documentVerification[docKey];
      const headers = { Authorization: `Token ${token}` };
      const response = await axios.post(
        '/api/verify-document/',
        { email, document_type: docKey, verify: !isCurrentlyVerified },
        { headers, timeout: 30000 },
      );

      if (response.status === 200) {
        setDocumentVerification((prev) => ({ ...prev, [docKey]: !isCurrentlyVerified }));
        if (isCurrentlyVerified) {
          setDocumentInvalidReasons((prev) => {
            const newReasons = { ...prev };
            delete newReasons[docKey];
            return newReasons;
          });
          debouncedToast(`${fileName} unverified successfully!`, 'success');
        } else {
          setDocumentInvalidReasons((prev) => {
            const newReasons = { ...prev };
            delete newReasons[docKey];
            return newReasons;
          });
          debouncedToast(`${fileName} verified successfully!`, 'success');
        }
      } else {
        throw new Error(response.data.message || `Failed to ${isCurrentlyVerified ? 'unverify' : 'verify'} ${fileName}.`);
      }
    } catch (err) {
      debouncedToast(err.message || `Failed to ${documentVerification[docKey] ? 'unverify' : 'verify'} ${fileName}.`);
    }
  };

  const handleDocumentInvalidate = async (key, label) => {
    const reason = prompt(`Please enter the reason for marking ${label} as invalid:`);
    if (reason) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found.');
        }
        const response = await axios.post(
          '/api/invalidate-document/',
          { email, document_key: key, reason },
          { headers: { Authorization: `Token ${token}` }, timeout: 30000 },
        );
        setDocumentInvalidReasons((prev) => ({ ...prev, [key]: reason }));
        setDocumentVerification((prev) => ({ ...prev, [key]: false }));
        debouncedToast(`${label} marked as invalid`, 'success');
      } catch (err) {
        debouncedToast(`Failed to mark ${label} as invalid`);
      }
    }
  };

  const handleSendInvalidDocumentMail = async (key, label, reason) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const response = await axios.post(
        '/api/send-invalid-document-mail/',
        { email, document_key: key, document_name: label, reason },
        { headers: { Authorization: `Token ${token}` }, timeout: 30000 },
      );
      debouncedToast(`Email sent for invalid ${label}`, 'success');
    } catch (err) {
      debouncedToast(`Failed to send email for ${label}`);
    }
  };

  const handleSave = async () => {
    if (!enrollmentNumber && admissionStatus === 'Confirmed') {
      debouncedToast('Enrollment number is required for confirmed admission');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const payload = {
        eligibility_status: eligibilityStatus,
        not_eligible_reason: notEligibleReason,
        admission_status: admissionStatus,
        not_admitted_reason: notAdmittedReason,
        enrollment_number: enrollmentNumber,
        document_verification: documentVerification,
        document_invalid_reasons: documentInvalidReasons,
      };
      const response = await axios.patch(
        `/api/student-info/${encodeURIComponent(email)}/`,
        payload,
        { headers: { Authorization: `Token ${token}` }, timeout: 30000 },
      );
      debouncedToast('Student details saved successfully', 'success');
      navigate('/application-verification');
    } catch (err) {
      debouncedToast('Failed to save student details');
    }
  };

  const handleSendInvalidCertificatesMail = async () => {
    if (!eligibilityStatus && !admissionStatus) {
      debouncedToast('Please set eligibility or admission status');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const payload = {
        email,
        eligibility_status: eligibilityStatus,
        not_eligible_reason: notEligibleReason,
        admission_status: admissionStatus,
        not_admitted_reason: notAdmittedReason,
        document_invalid_reasons: documentInvalidReasons,
      };
      const response = await axios.post(
        '/api/send-invalid-certificates-mail/',
        payload,
        { headers: { Authorization: `Token ${token}` }, timeout: 30000 },
      );
      debouncedToast('Email sent for invalid certificates', 'success');
    } catch (err) {
      debouncedToast('Failed to send invalid certificates email');
    }
  };

  const handleVerifyAllDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      if (!email) {
        throw new Error('Email parameter is missing.');
      }

      const documentsToVerify = [
        { key: 'photo', label: 'Photo' },
        { key: 'signature', label: 'Signature' },
        { key: 'sslc_marksheet', label: 'SSLC Marksheet' },
        { key: 'hsc_marksheet', label: 'HSC Marksheet' },
        { key: 'ug_marksheet', label: 'UG Marksheet' },
        { key: 'semester_marksheet', label: 'Semester Marksheet' },
        { key: 'community_certificate', label: 'Community Certificate' },
        { key: 'aadhaar', label: 'Aadhaar Card' },
        { key: 'transfer_certificate', label: 'Transfer Certificate' },
      ];

      const unverifiedDocs = documentsToVerify.filter(
        ({ key }) =>
          !documentVerification[key] &&
          previewData?.student_details?.[key]?.proxyUrl &&
          previewData.student_details[key].proxyUrl !==
            (key.includes('marksheet') || key.includes('certificate') || key === 'aadhaar'
              ? '#'
              : '/default-image.png'),
      );

      if (unverifiedDocs.length === 0) {
        debouncedToast('All documents are already verified or not uploaded.', 'success');
        return;
      }

      for (const { key, label } of unverifiedDocs) {
        await handleDocumentVerify(key, label);
      }

      debouncedToast('All documents verified successfully!', 'success');
    } catch (err) {
      debouncedToast(err.message || 'Failed to verify all documents.');
    }
  };

  const handleUnverifyStudent = async () => {
    if (!previewData?.student?.email) {
      debouncedToast('Cannot unverify student: Student email not available.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const response = await axios.post(
        '/api/unverify-student/',
        { email: previewData.student.email },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      if (response.status === 200) {
        debouncedToast('Student unverified successfully', 'success');
        setIsVerified(false);
        fetchStudentData();
      } else {
        debouncedToast('Failed to unverify student.');
      }
    } catch (err) {
      debouncedToast('An error occurred while unverifying the student.');
    }
  };

  const openModal = async (urlObj, isImage, fileName) => {
    if (!urlObj.proxyUrl || urlObj.proxyUrl === '#' || urlObj.proxyUrl === '/default-image.png') {
      debouncedToast('No valid document URL provided.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      debouncedToast('Authentication required. Please log in.');
      navigate('/login');
      return;
    }

    setModalContent({ proxyUrl: urlObj.proxyUrl, directUrl: urlObj.directUrl, isImage, fileName });
    setIsFileLoading(!isImage);
    setFileLoadError(null);
    setNumPages(null);
    setPdfBlobUrl(null);
    if (!isImage) {
      try {
        const blobUrl = await fetchPdfFile(urlObj.proxyUrl, urlObj.directUrl, fileName);
        setPdfBlobUrl(blobUrl);
        setIsFileLoading(false);
      } catch (err) {
        const errorMessage = err.message.includes('Network')
          ? `Network error loading ${fileName}. Check your connection or try downloading the file.`
          : `Failed to load ${fileName}: ${err.message}. Please try the direct link or download the file.`;
        setFileLoadError(errorMessage);
        debouncedToast(errorMessage);
        setIsFileLoading(false);
      }
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent({ proxyUrl: '', directUrl: '', isImage: true, fileName: '' });
    setIsFileLoading(false);
    setFileLoadError(null);
    setNumPages(null);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setFileLoadError(null);
    setIsFileLoading(false);
  };

  const onDocumentLoadError = (error) => {
    const errorMessage = `Failed to render ${modalContent.fileName}: ${error.message}. Please try downloading the file.`;
    setFileLoadError(errorMessage);
    debouncedToast(errorMessage);
    setIsFileLoading(false);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <StudentDetailsUI
        printRef={printRef}
        loading={loading}
        error={error}
        previewData={previewData}
        imageLoading={imageLoading}
        isVerified={isVerified}
        modalIsOpen={modalIsOpen}
        modalContent={modalContent}
        isFileLoading={isFileLoading}
        fileLoadError={fileLoadError}
        numPages={numPages}
        pdfBlobUrl={pdfBlobUrl}
        documentVerification={documentVerification}
        documentInvalidReasons={documentInvalidReasons}
        eligibilityStatus={eligibilityStatus}
        setEligibilityStatus={setEligibilityStatus}
        notEligibleReason={notEligibleReason}
        setNotEligibleReason={setNotEligibleReason}
        admissionStatus={admissionStatus}
        setAdmissionStatus={setAdmissionStatus}
        notAdmittedReason={notAdmittedReason}
        setNotAdmittedReason={setNotAdmittedReason}
        enrollmentNumber={enrollmentNumber}
        setEnrollmentNumber={setEnrollmentNumber}
        handleRetry={handleRetry}
        handleImageLoad={handleImageLoad}
        handleImageError={handleImageError}
        handleDocumentVerify={handleDocumentVerify}
        handleDocumentInvalidate={handleDocumentInvalidate}
        handleSave={handleSave}
        handleSendInvalidCertificatesMail={handleSendInvalidCertificatesMail}
        handleSendInvalidDocumentMail={handleSendInvalidDocumentMail}
        openModal={openModal}
        closeModal={closeModal}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onDocumentLoadError={onDocumentLoadError}
        navigate={navigate}
        paymentDetails={paymentDetails}
        paymentLoading={paymentLoading}
        paymentError={paymentError}
        student={previewData?.student}
        invalidReasons={documentInvalidReasons}
        setInvalidReasons={setDocumentInvalidReasons}
        emailSent={emailSent}
        setEmailSent={setEmailSent}
        statusSaved={statusSaved}
        setStatusSaved={setStatusSaved}
      />
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setInitialData(null);
          setIsEditMode(false);
        }}
        onSubmit={handleVerificationSubmit}
        email={email}
        isEditMode={isEditMode}
        initialData={initialData}
      />
    </>
  );
};

export default StudentDetails;