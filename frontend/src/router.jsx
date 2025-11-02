import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetPassword from './pages/SetPassword';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuperAdminControl from './pages/SuperAdminControl';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/super-admin" element={<SuperAdminControl />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
