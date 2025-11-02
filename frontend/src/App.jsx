import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import SetAdmin from './pages/SetAdmin';
import Login from './pages/Login';
import SetPassword from './pages/SetPassword';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import ApplicationVerification from './pages/ApplicationVerification';
import StudentDetails from './pages/StudentDetails';
import Settings from './pages/Settings';
import AddCounsellor from './pages/AddCounsellor';

const CheckFirstAdmin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:8000/api/check-admin-exists/').then((res) => {
      if (res.data.exists) {
        navigate('/login');
      } else {
        navigate('/set-admin');
      }
    });
  }, [navigate]);
  return <div>Loading...</div>;
};

// Component to conditionally render Sidebar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const noSidebarRoutes = ['/set-admin', '/login', '/verify-otp', '/set-password', '/'];
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && <Sidebar />}
      <div className="flex-1 content-with-sidebar">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
            <Route path="/" element={<CheckFirstAdmin />} />
            <Route path="/set-admin" element={<SetAdmin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application-verification" element={<ApplicationVerification />} />
            <Route path="/student-details" element={<StudentDetails />} />
            <Route path="/verified-students" element={<div>Verified Students Page (Placeholder)</div>} />
            <Route path="/application-payment" element={<div>Application Payment Page (Placeholder)</div>} />
            <Route path="/semester-payment" element={<div>Semester Payment Page (Placeholder)</div>} />
            <Route path="/settings" element={<Settings initialSection="Settings" />} />
            <Route path="/settings/admission-open" element={<Settings initialSection="Admission Open" />} />
            <Route path="/settings/admission-details" element={<Settings initialSection="Admission Opened Details" />} />
            <Route path="/settings/add-lsc" element={<Settings initialSection="Add New LSC" />} />
            <Route path="/settings/add-course" element={<Settings initialSection="Add New Course" />} />
            <Route path="/settings/add-counsellor" element={<AddCounsellor />} />
            <Route path="/settings/add-attendance" element={<Settings initialSection="Add Attendance" />} />
            <Route path="/settings/add-assignment-mark" element={<Settings initialSection="Add Assignment Mark" />} />
            <Route
              path="/settings/add-internal-model-mark"
              element={<Settings initialSection="Add Internal & Model Mark" />}
            />
          </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;