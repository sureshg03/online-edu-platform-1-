import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Settings, Users, ShieldCheck, FileText, Server, 
  Activity, BarChart3, Mail, Key, UserPlus, Building2, 
  BookOpen, GraduationCap, Clock, TrendingUp, AlertTriangle,
  Download, Upload, RefreshCw, Lock, Unlock, Eye, EyeOff,
  Search, Filter, Plus, Edit, Trash2, Save, X, CheckCircle2,
  XCircle, Info, ArrowRight, Layers, Zap, Shield, ChevronRight,
  User, MapPin, Sparkles, Star, Rocket, Target, Award, Crown,
  Globe, PhoneCall, AtSign, Home, Package, Calendar, Bell,
  Copy, Check, ExternalLink, MoreVertical, TrendingDown, Hash
} from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminControl = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalApplications: 0,
    totalLSCs: 0,
    totalCourses: 0,
    activeAdmins: 0,
    pendingVerifications: 0
  });

  // LSC Admin Management State
  const [lscAdmins, setLscAdmins] = useState([]);
  const [showLSCForm, setShowLSCForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingLSC, setEditingLSC] = useState(null);
  const [lscFormData, setLSCFormData] = useState({
    lsc_code: '',
    center_name: '',
    admin_email: '',
    admin_password: '',
    admin_name: '',
    mobile: '',
    address: '',
    district: '',
    state: '',
    pincode: ''
  });

  // Enhanced form handler with proper controlled input
  const handleLSCFormChange = useCallback((field, value) => {
    setLSCFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState([]);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [settingsFormData, setSettingsFormData] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'general',
    description: ''
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('all');

  // Database Backup State
  const [backups, setBackups] = useState([]);

  // Database Management State
  const [databaseTables, setDatabaseTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableStructure, setTableStructure] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('');

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning', // 'warning', 'danger', 'info', 'success'
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    requiresInput: false,
    inputPlaceholder: '',
    expectedInput: ''
  });

  // Maintenance State
  const [systemHealth, setSystemHealth] = useState(null);

  // Security State
  const [securityLogs, setSecurityLogs] = useState([]);
  
  // Email Config State
  const [emailSettings, setEmailSettings] = useState([]);
  const [showEmailTestForm, setShowEmailTestForm] = useState(false);
  const [testEmailData, setTestEmailData] = useState({
    recipient: '',
    subject: 'Test Email',
    message: 'This is a test email from Super Admin Panel'
  });

  // Guidelines State
  const [guidelines, setGuidelines] = useState([]);
  const [showGuidelineForm, setShowGuidelineForm] = useState(false);
  const [guidelineFormData, setGuidelineFormData] = useState({
    key: '',
    title: '',
    content: ''
  });

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  // Custom Confirm Dialog Helper
  const showConfirm = (options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure?',
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        requiresInput: options.requiresInput || false,
        inputPlaceholder: options.inputPlaceholder || '',
        expectedInput: options.expectedInput || '',
        onConfirm: (inputValue) => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          resolve(inputValue !== undefined ? inputValue : true);
        },
        onCancel: () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'lsc-admins') fetchLSCAdmins();
    if (activeTab === 'settings') fetchSystemSettings();
    if (activeTab === 'audit-logs') fetchAuditLogs();
    if (activeTab === 'backups') fetchBackups();
    if (activeTab === 'database') fetchDatabaseTables();
    if (activeTab === 'maintenance') fetchSystemHealth();
    if (activeTab === 'security') fetchSecurityLogs();
    if (activeTab === 'email') fetchEmailSettings();
    if (activeTab === 'guidelines') fetchGuidelines();
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [applications, lscs] = await Promise.all([
        axios.get(`${API_BASE_URL}/applications/`, {
          headers: { Authorization: `Token ${token}` }
        }),
        axios.get(`${API_BASE_URL}/lsc/list/`, {
          headers: { Authorization: `Token ${token}` }
        })
      ]);

      setStats({
        totalStudents: applications.data.length,
        totalApplications: applications.data.length,
        totalLSCs: lscs.data.data?.length || 0,
        totalCourses: 0,
        activeAdmins: 1,
        pendingVerifications: applications.data.filter(app => !app.is_verified).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLSCAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/lsc-admins/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setLscAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching LSC admins:', error);
      toast.error('Failed to load LSC admins');
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/settings/`, {
        headers: { Authorization: `Token ${token}` }
      });
      const settings = response.data.data || [];
      setSystemSettings(settings);
      
      // Check for maintenance mode setting
      const maintenanceSetting = settings.find(s => s.setting_key === 'maintenance_mode');
      if (maintenanceSetting) {
        setMaintenanceMode(maintenanceSetting.setting_value === 'true' || maintenanceSetting.setting_value === '1');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const toggleMaintenanceMode = async () => {
    const newMode = !maintenanceMode;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Check if maintenance_mode setting already exists
      const maintenanceSetting = systemSettings.find(s => s.setting_key === 'maintenance_mode');
      
      if (maintenanceSetting) {
        // Update existing setting
        await axios.put(`${API_BASE_URL}/superadmin/settings/${maintenanceSetting.id}/update/`, {
          setting_key: 'maintenance_mode',
          setting_value: newMode ? 'true' : 'false',
          setting_type: 'system',
          description: 'Website maintenance mode - when enabled, shows maintenance page to all users',
          updated_by: localStorage.getItem('userEmail')
        }, {
          headers: { Authorization: `Token ${token}` }
        });
      } else {
        // Create new setting
        await axios.post(`${API_BASE_URL}/superadmin/settings/create/`, {
          setting_key: 'maintenance_mode',
          setting_value: newMode ? 'true' : 'false',
          setting_type: 'system',
          description: 'Website maintenance mode - when enabled, shows maintenance page to all users'
        }, {
          headers: { Authorization: `Token ${token}` }
        });
      }
      
      setMaintenanceMode(newMode);
      toast.success(`Maintenance mode ${newMode ? 'enabled' : 'disabled'}! 🔧`);
      fetchSystemSettings();
    } catch (error) {
      console.error('Maintenance toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle maintenance mode');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/audit-logs/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setAuditLogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const fetchBackups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/backups/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setBackups(response.data.data || []);
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const handleCreateLSCAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const adminEmail = localStorage.getItem('userEmail');
      
      if (editingLSC) {
        // Update existing LSC Admin
        await axios.put(`${API_BASE_URL}/superadmin/lsc-admins/${editingLSC.id}/update/`, {
          ...lscFormData,
          updated_by: adminEmail
        }, {
          headers: { Authorization: `Token ${token}` }
        });
        toast.success('LSC Admin updated successfully!');
      } else {
        // Create new LSC Admin
        await axios.post(`${API_BASE_URL}/superadmin/lsc-admins/create/`, {
          ...lscFormData,
          created_by: adminEmail
        }, {
          headers: { Authorization: `Token ${token}` }
        });
        toast.success('LSC Admin created successfully!');
      }

      setShowLSCForm(false);
      setEditingLSC(null);
      setLSCFormData({
        lsc_code: '',
        center_name: '',
        admin_email: '',
        admin_password: '',
        admin_name: '',
        mobile: '',
        address: '',
        district: '',
        state: '',
        pincode: ''
      });
      fetchLSCAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${editingLSC ? 'update' : 'create'} LSC Admin`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLSCAdmin = (admin) => {
    setEditingLSC(admin);
    setLSCFormData({
      lsc_code: admin.lsc_code,
      center_name: admin.center_name,
      admin_email: admin.admin_email,
      admin_password: '', // Don't populate password
      admin_name: admin.admin_name,
      mobile: admin.mobile,
      address: admin.address || '',
      district: admin.district || '',
      state: admin.state || '',
      pincode: admin.pincode || ''
    });
    setShowLSCForm(true);
  };

  const handleDeleteLSCAdmin = async (adminId, lscCode) => {
    const confirmed = await showConfirm({
      title: '🗑️ Delete LSC Admin',
      message: `Are you sure you want to delete LSC Admin "${lscCode}"? This action cannot be undone and will permanently remove all data associated with this administrator.`,
      type: 'danger',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel'
    });

    if (!confirmed) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/superadmin/lsc-admins/${adminId}/delete/`, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('LSC Admin deleted successfully! ✅');
      fetchLSCAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete LSC Admin');
    } finally {
      setLoading(false);
    }
  };

  // ===================== DATABASE FUNCTIONS =====================
  const fetchDatabaseTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/database/tables/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setDatabaseTables(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch database tables');
    }
  };

  const fetchTableStructure = async (tableName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/database/table/${tableName}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setTableStructure(response.data.data);
      setSelectedTable(tableName);
    } catch (error) {
      toast.error('Failed to fetch table structure');
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/superadmin/database/query/`, {
        query: sqlQuery
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      // Handle both response.data and response.data.data formats
      const results = response.data.data || response.data.results || response.data;
      setQueryResult(Array.isArray(results) ? results : []);
      toast.success(`Query executed successfully! ${Array.isArray(results) ? results.length : 0} rows returned`);
    } catch (error) {
      console.error('Query error:', error);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Query execution failed');
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ===================== MAINTENANCE FUNCTIONS =====================
  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/maintenance/health/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSystemHealth(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch system health');
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/superadmin/maintenance/clear-cache/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const optimizeDatabase = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/superadmin/maintenance/optimize/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success(`Optimized ${response.data.tables.length} tables`);
    } catch (error) {
      toast.error('Failed to optimize database');
    } finally {
      setLoading(false);
    }
  };

  // ===================== SECURITY FUNCTIONS =====================
  const fetchSecurityLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/security/logs/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSecurityLogs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch security logs');
    }
  };

  // ===================== EMAIL CONFIG FUNCTIONS =====================
  const fetchEmailSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/email/settings/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setEmailSettings(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch email settings');
    }
  };

  const sendTestEmail = async () => {
    if (!testEmailData.recipient) {
      toast.error('Please enter recipient email');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/superadmin/email/test/`, testEmailData, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Test email sent successfully');
      setShowEmailTestForm(false);
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  // ===================== GUIDELINES FUNCTIONS =====================
  const fetchGuidelines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/guidelines/`, {
        headers: { Authorization: `Token ${token}` }
      });
      // Map backend fields to frontend fields
      const mappedGuidelines = response.data.data.map(g => ({
        id: g.id,
        key: g.setting_key,
        title: g.description,
        content: g.setting_value,
        created_at: g.created_at,
        updated_at: g.updated_at,
        updated_by: g.updated_by
      }));
      setGuidelines(mappedGuidelines);
    } catch (error) {
      toast.error('Failed to fetch guidelines');
    }
  };

  const handleCreateGuideline = async () => {
    if (!guidelineFormData.key || !guidelineFormData.title || !guidelineFormData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/superadmin/guidelines/create/`, guidelineFormData, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Guideline created successfully! 📚');
      setShowGuidelineForm(false);
      setGuidelineFormData({ key: '', title: '', content: '' });
      fetchGuidelines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create guideline');
    } finally {
      setLoading(false);
    }
  };

  const deleteGuideline = async (id) => {
    const confirmed = await showConfirm({
      title: '📚 Delete Guideline',
      message: 'Are you sure you want to delete this guideline? This will permanently remove it from the system.',
      type: 'warning',
      confirmText: 'Yes, Delete',
      cancelText: 'Keep It'
    });

    if (!confirmed) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/superadmin/guidelines/${id}/delete/`, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Guideline deleted successfully! ✅');
      fetchGuidelines();
    } catch (error) {
      toast.error('Failed to delete guideline');
    }
  };

  const handleExportAuditLogs = () => {
    try {
      // Filter logs based on current filter
      const logsToExport = logFilter === 'all' 
        ? auditLogs 
        : auditLogs.filter(log => log.action_type === logFilter);

      if (logsToExport.length === 0) {
        toast.error('No logs to export');
        return;
      }

      // Create CSV content
      const headers = ['Timestamp', 'Admin Email', 'Action Type', 'Details', 'IP Address', 'Status', 'Affected Model', 'Affected ID'];
      const csvRows = [headers.join(',')];

      logsToExport.forEach(log => {
        const row = [
          new Date(log.timestamp).toLocaleString(),
          log.admin_email || 'N/A',
          log.action_type || 'N/A',
          `"${(log.details || 'N/A').replace(/"/g, '""')}"`, // Escape quotes in details
          log.ip_address || 'N/A',
          log.status || 'success',
          log.affected_model || 'N/A',
          log.affected_id || 'N/A'
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `audit_logs_${logFilter}_${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${logsToExport.length} logs to ${filename} 📊`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export logs');
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const adminEmail = localStorage.getItem('userEmail');
      
      await axios.post(`${API_BASE_URL}/superadmin/backups/create/`, {
        created_by: adminEmail,
        backup_type: 'full'
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      toast.success('Database backup initiated! 💾');
      fetchBackups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackup = async (backupId) => {
    const confirmed = await showConfirm({
      title: '🗑️ Delete Backup',
      message: 'Are you sure you want to delete this backup file? This action cannot be undone and you will lose this backup permanently.',
      type: 'danger',
      confirmText: 'Yes, Delete Backup',
      cancelText: 'Keep Backup'
    });

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/superadmin/backups/${backupId}/delete/`, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Backup deleted successfully! 🗑️');
      fetchBackups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete backup');
    }
  };

  const handleDownloadBackup = async (backup) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/superadmin/backups/${backup.id}/download/`, {
        headers: { Authorization: `Token ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', backup.backup_name || `backup_${backup.id}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Backup downloaded successfully! ⬇️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download backup');
    }
  };

  const handleRestoreBackup = async (backupId) => {
    const confirmed = await showConfirm({
      title: '⚠️ DANGEROUS: Restore Database',
      message: 'WARNING: Restoring this backup will REPLACE ALL CURRENT DATA in your database. This action is IRREVERSIBLE and will overwrite everything. Make sure you have a recent backup before proceeding!',
      type: 'danger',
      confirmText: 'I Understand, Restore',
      cancelText: 'Cancel (Safe)',
      requiresInput: true,
      inputPlaceholder: 'Type RESTORE to confirm',
      expectedInput: 'RESTORE'
    });

    if (!confirmed) {
      toast.info('Restore cancelled - your data is safe ✅');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/superadmin/backups/${backupId}/restore/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      toast.success('Database restore initiated! Please wait... 🔄');
      setTimeout(() => fetchBackups(), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  const controlCategories = [
    {
      name: 'Dashboard',
      icon: <Activity className="w-5 h-5" />,
      key: 'dashboard',
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      description: 'Overview & Analytics'
    },
    {
      name: 'LSC Admins',
      icon: <UserPlus className="w-5 h-5" />,
      key: 'lsc-admins',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      description: 'Manage LSC Admin Credentials'
    },
    {
      name: 'System Settings',
      icon: <Settings className="w-5 h-5" />,
      key: 'settings',
      color: '#10B981',
      bgColor: '#ECFDF5',
      description: 'Configure System Parameters'
    },
    {
      name: 'Database',
      icon: <Database className="w-5 h-5" />,
      key: 'database',
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      description: 'Database Management & Queries'
    },
    {
      name: 'Backups',
      icon: <Download className="w-5 h-5" />,
      key: 'backups',
      color: '#6366F1',
      bgColor: '#EEF2FF',
      description: 'Backup & Restore'
    },
    {
      name: 'Audit Logs',
      icon: <FileText className="w-5 h-5" />,
      key: 'audit-logs',
      color: '#F97316',
      bgColor: '#FFF7ED',
      description: 'Track All Admin Actions'
    },
    {
      name: 'Security',
      icon: <ShieldCheck className="w-5 h-5" />,
      key: 'security',
      color: '#EF4444',
      bgColor: '#FEF2F2',
      description: 'Security & Permissions'
    },
    {
      name: 'Email Config',
      icon: <Mail className="w-5 h-5" />,
      key: 'email',
      color: '#14B8A6',
      bgColor: '#F0FDFA',
      description: 'Email Templates & SMTP'
    },
    {
      name: 'Maintenance',
      icon: <Server className="w-5 h-5" />,
      key: 'maintenance',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      description: 'System Health & Optimization'
    },
    {
      name: 'Guidelines',
      icon: <BookOpen className="w-5 h-5" />,
      key: 'guidelines',
      color: '#6366F1',
      bgColor: '#EEF2FF',
      description: 'Help & Instructions'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner - Ultra Modern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-purple-900 to-purple-900 rounded-3xl p-8 overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Welcome Back, Super Admin!</h2>
              <p className="text-purple-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                You have full control over the system
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
          >
            <Rocket className="w-5 h-5" />
            Quick Start Guide
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid - Ultra Advanced Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(59, 130, 246, 0.15)' }}
          className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{backgroundColor: '#EFF6FF'}}>
                <Users className="w-7 h-7" style={{color: '#3B82F6'}} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full flex items-center gap-1 border border-blue-200">
                  <Target className="w-3 h-3" />
                  Active
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stats.totalStudents.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Total Students</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12.5%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(139, 92, 246, 0.15)' }}
          className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{backgroundColor: '#F5F3FF'}}>
                <FileText className="w-7 h-7" style={{color: '#8B5CF6'}} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full flex items-center gap-1 border border-purple-200">
                  <Activity className="w-3 h-3" />
                  Live
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stats.totalApplications.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Applications</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8.3%</span>
              </div>
              <span className="text-xs text-gray-500">this week</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(16, 185, 129, 0.15)' }}
          className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{backgroundColor: '#ECFDF5'}}>
                <Building2 className="w-7 h-7" style={{color: '#10B981'}} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-1 border border-green-200">
                  <Globe className="w-3 h-3" />
                  Online
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stats.totalLSCs.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">LSC Centers</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-green-600 font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span>All operational</span>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                100%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(245, 158, 11, 0.15)' }}
          className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{backgroundColor: '#FFFBEB'}}>
                <BookOpen className="w-7 h-7" style={{color: '#F59E0B'}} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full flex items-center gap-1 border border-amber-200">
                  <Package className="w-3 h-3" />
                  Available
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stats.totalCourses.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Courses</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-amber-600 font-semibold">
                <Layers className="w-4 h-4 mr-1" />
                <span>Multiple programs</span>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(99, 102, 241, 0.15)' }}
          className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{backgroundColor: '#EEF2FF'}}>
                <ShieldCheck className="w-7 h-7" style={{color: '#6366F1'}} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1 border border-indigo-200">
                  <Shield className="w-3 h-3" />
                  Secure
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stats.activeAdmins.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Active Admins</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-indigo-600 font-semibold">
                <Key className="w-4 h-4 mr-1" />
                <span>Protected access</span>
              </div>
              <span className="text-xs text-gray-500">24/7</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(249, 115, 22, 0.15)' }}
          className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{backgroundColor: '#FFF7ED'}}>
                <Clock className="w-7 h-7" style={{color: '#F97316'}} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full flex items-center gap-1 border border-orange-200 animate-pulse">
                  <Bell className="w-3 h-3" />
                  Pending
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stats.pendingVerifications.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Pending Verifications</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-orange-600 font-semibold">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>Needs attention</span>
              </div>
              <span className="text-xs text-gray-500">Urgent</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions - Collapsible Design */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Frequently used operations</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="text-sm text-purple-600 font-semibold flex items-center gap-2 px-4 py-2 hover:bg-purple-50 rounded-lg transition-all"
          >
            {showQuickActions ? 'Hide' : 'Show'}
            <motion.div
              animate={{ rotate: showQuickActions ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </motion.button>
        </div>
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('lsc-admins')}
            className="relative p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 group border border-purple-200 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-gray-900 block">Add LSC Admin</span>
              <span className="text-xs text-purple-600 font-medium">Create new</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateBackup}
            disabled={loading}
            className="relative p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 group border border-indigo-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <Download className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-gray-900 block">Create Backup</span>
              <span className="text-xs text-indigo-600 font-medium">Database</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('settings')}
            className="relative p-6 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 group border border-green-200 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-gray-900 block">System Config</span>
              <span className="text-xs text-green-600 font-medium">Settings</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('audit-logs')}
            className="relative p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 group border border-orange-200 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-gray-900 block">View Logs</span>
              <span className="text-xs text-orange-600 font-medium">Audit trail</span>
            </div>
          </motion.button>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderLSCAdmins = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl xs:text-3xl font-bold text-gray-900">LSC Admin Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage learning support center administrators</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingLSC(null);
            setLSCFormData({
              lsc_code: '',
              center_name: '',
              admin_email: '',
              admin_password: '',
              admin_name: '',
              mobile: '',
              address: '',
              district: '',
              state: '',
              pincode: ''
            });
            setShowLSCForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          Add LSC Admin
        </motion.button>
      </div>

      {/* LSC Admins List - Modern Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">LSC Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Center Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lscAdmins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold">No LSC Admins found</p>
                        <p className="text-sm text-gray-500 mt-1">Click "Add LSC Admin" to create one</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                lscAdmins.map((admin) => (
                  <motion.tr 
                    key={admin.id} 
                    whileHover={{ backgroundColor: '#F9FAFB' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-purple-600">{admin.lsc_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{admin.center_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{admin.admin_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{admin.admin_email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{admin.mobile}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        admin.is_active 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {admin.is_active ? (
                          <><CheckCircle2 className="w-3 h-3" /> Active</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditLSCAdmin(admin)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteLSCAdmin(admin.id, admin.lsc_code)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LSC Admin Form Modal - Modern Premium Design */}
      <AnimatePresence>
        {showLSCForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowLSCForm(false);
                setEditingLSC(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-3xl z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {editingLSC ? 'Edit LSC Admin' : 'Create LSC Admin'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingLSC ? 'Update learning support center administrator details' : 'Add a new learning support center administrator'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowLSCForm(false);
                      setEditingLSC(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateLSCAdmin} className="px-8 py-6">
                {/* Basic Information Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        LSC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lscFormData.lsc_code}
                        onChange={(e) => handleLSCFormChange('lsc_code', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                        placeholder="e.g., LSC001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4 text-purple-500" />
                        Center Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lscFormData.center_name}
                        onChange={(e) => handleLSCFormChange('center_name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                        placeholder="Center name"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" />
                    Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-500" />
                        Admin Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lscFormData.admin_name}
                        onChange={(e) => handleLSCFormChange('admin_name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                        placeholder="Administrator name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-purple-500" />
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={lscFormData.mobile}
                        onChange={(e) => handleLSCFormChange('mobile', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                </div>

                {/* Login Credentials Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-500" />
                    Login Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <AtSign className="w-4 h-4 text-purple-500" />
                        Admin Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={lscFormData.admin_email}
                        onChange={(e) => handleLSCFormChange('admin_email', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Key className="w-4 h-4 text-purple-500" />
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={lscFormData.admin_password}
                          onChange={(e) => handleLSCFormChange('admin_password', e.target.value)}
                          className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                          placeholder="Secure password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Location Details
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={lscFormData.address}
                        onChange={(e) => handleLSCFormChange('address', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all resize-none"
                        rows="3"
                        placeholder="Full address"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          District <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lscFormData.district}
                          onChange={(e) => handleLSCFormChange('district', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                          placeholder="District"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-500" />
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lscFormData.state}
                          onChange={(e) => handleLSCFormChange('state', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Hash className="w-4 h-4 text-purple-500" />
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lscFormData.pincode}
                          onChange={(e) => handleLSCFormChange('pincode', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {editingLSC ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {editingLSC ? 'Update LSC Admin' : 'Create LSC Admin'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLSCForm(false);
                      setEditingLSC(null);
                    }}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderComingSoon = (title, description, icon, color) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex flex-col items-center gap-4 max-w-md text-center"
      >
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: color + '20' }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Coming Soon</span>
        </div>
      </motion.div>
    </div>
  );

  // Render Functions for each section
  
  // System Settings Render
  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Settings className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-500">Configure application-wide settings</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettingsForm(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Setting
        </motion.button>
      </div>

      {/* Website Maintenance Mode - Premium Alert Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${maintenanceMode ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600'} rounded-2xl p-6 shadow-lg text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {maintenanceMode ? (
                <Lock className="w-8 h-8" />
              ) : (
                <Unlock className="w-8 h-8" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Website Maintenance Mode</h3>
              <p className="text-white/90 text-sm">
                {maintenanceMode 
                  ? '⚠️ Website is currently in maintenance mode - All users will see maintenance page'
                  : '✅ Website is live and accessible to all users'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMaintenanceMode}
            disabled={loading}
            className={`px-8 py-4 rounded-xl font-bold shadow-lg transition-all ${
              maintenanceMode
                ? 'bg-white text-red-600 hover:bg-gray-100'
                : 'bg-white text-green-600 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : maintenanceMode ? (
              'Disable Maintenance'
            ) : (
              'Enable Maintenance'
            )}
          </motion.button>
        </div>
        {maintenanceMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Maintenance Mode Active:</p>
                <ul className="space-y-1 text-white/90">
                  <li>• All website services are temporarily disabled</li>
                  <li>• Users will see "Website Under Maintenance" page</li>
                  <li>• Only super admins can access the system</li>
                  <li>• Disable maintenance mode to restore normal operations</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-4">
        {systemSettings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No settings configured yet</p>
          </div>
        ) : (
          systemSettings.map((setting) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{setting.setting_key}</h3>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                      {setting.setting_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Value:</span>
                    <code className="px-3 py-1 bg-gray-50 rounded-lg text-purple-600 font-mono">
                      {setting.setting_value}
                    </code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  // Database Management Render
  const renderDatabase = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Database className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
          <p className="text-sm text-gray-500">Execute queries and manage database tables</p>
        </div>
      </div>

      {/* Database Tables */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            Tables
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {databaseTables.length === 0 ? (
              <p className="text-sm text-gray-500">No tables found</p>
            ) : (
              databaseTables.map((table) => (
                <button
                  key={table}
                  onClick={() => fetchTableStructure(table)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedTable === table
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {table}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          {/* Query Builder */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">SQL Query</h3>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM table_name LIMIT 100;"
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <div className="flex items-center gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={executeQuery}
                className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center gap-2 shadow-sm"
              >
                <Zap className="w-5 h-5" />
                Execute Query
              </motion.button>
              <button
                onClick={() => setSqlQuery('')}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Security:</strong> Only SELECT queries are allowed for safety.
              </p>
            </div>
          </div>

          {/* Query Results */}
          {queryResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Query Results ({queryResult.length} rows)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {queryResult.length > 0 && Object.keys(queryResult[0]).map((key) => (
                        <th key={key} className="text-left p-3 font-semibold text-gray-700 bg-gray-50">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="p-3 text-gray-600">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Table Structure */}
          {tableStructure.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Table Structure: {selectedTable}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-3 font-semibold">Column</th>
                      <th className="text-left p-3 font-semibold">Type</th>
                      <th className="text-left p-3 font-semibold">Null</th>
                      <th className="text-left p-3 font-semibold">Key</th>
                      <th className="text-left p-3 font-semibold">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableStructure.map((col, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-mono text-purple-600">{col.Field}</td>
                        <td className="p-3 text-gray-600">{col.Type}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            col.Null === 'YES' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {col.Null}
                          </span>
                        </td>
                        <td className="p-3">
                          {col.Key && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                              {col.Key}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600">{col.Default || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  // Backups Render
  const renderBackups = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Server className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Database Backups</h2>
            <p className="text-sm text-gray-500">Create and manage database backups</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBackups}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 shadow-sm"
            title="Refresh backups list"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateBackup}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Backup
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Backups List */}
      <div className="grid gap-4">
        {backups.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Server className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No backups available</p>
          </div>
        ) : (
          backups.map((backup) => (
            <motion.div
              key={backup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Database className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{backup.backup_name || backup.filename || 'Unknown Backup'}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-500">Created: {new Date(backup.created_at).toLocaleString()}</p>
                      {backup.created_by && (
                        <span className="text-xs text-gray-400">by {backup.created_by}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    backup.status === 'completed' 
                      ? 'bg-green-50 text-green-600' 
                      : backup.status === 'failed'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {backup.status}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {backup.backup_size_mb || ((backup.backup_size || 0) / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDownloadBackup(backup)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Download backup"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRestoreBackup(backup.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    title="Restore from this backup"
                  >
                    <Upload className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteBackup(backup.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete backup"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  // Audit Logs Render
  const renderAuditLogs = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
            <p className="text-sm text-gray-500">Track all system activities and changes</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Activities</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
          </select>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportAuditLogs}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export to CSV
          </motion.button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left p-4 font-semibold text-gray-700">Admin</th>
                <th className="text-left p-4 font-semibold text-gray-700">Action</th>
                <th className="text-left p-4 font-semibold text-gray-700">Details</th>
                <th className="text-left p-4 font-semibold text-gray-700">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-gray-500">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    No audit logs found
                  </td>
                </tr>
              ) : (
                auditLogs
                  .filter(log => logFilter === 'all' || log.action_type === logFilter)
                  .map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{log.admin_email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.action_type === 'create' ? 'bg-green-50 text-green-600' :
                          log.action_type === 'update' ? 'bg-blue-50 text-blue-600' :
                          log.action_type === 'delete' ? 'bg-red-50 text-red-600' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {log.action_type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{log.details}</td>
                      <td className="p-4 text-sm text-gray-500 font-mono">{log.ip_address}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Security Settings Render
  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="text-sm text-gray-500">Manage security policies and access controls</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Security Logs */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Security Logs
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {securityLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No security events</p>
            ) : (
              securityLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-900">{log.event_type}</p>
                      <p className="text-xs text-red-600 mt-1">{log.details}</p>
                    </div>
                    <span className="text-xs text-red-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Settings Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            Security Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Policy
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500">
                <option>Strict (12+ chars, special chars)</option>
                <option>Medium (8+ chars)</option>
                <option>Basic (6+ chars)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                placeholder="30"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Enable
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
            >
              Save Security Settings
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  // Email Configuration Render
  const renderEmail = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
            <Mail className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Email Configuration</h2>
            <p className="text-sm text-gray-500">Configure SMTP settings and email templates</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmailTestForm(!showEmailTestForm)}
          className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center gap-2 shadow-sm"
        >
          <Mail className="w-5 h-5" />
          Send Test Email
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SMTP Settings */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">SMTP Configuration</h3>
          <div className="space-y-4">
            {emailSettings.length === 0 ? (
              <p className="text-sm text-gray-500">Loading email settings...</p>
            ) : (
              emailSettings.map((setting) => (
                <div key={setting.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  <input
                    type={setting.setting_key.includes('password') ? 'password' : 'text'}
                    defaultValue={setting.setting_value}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ))
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium"
            >
              Save SMTP Settings
            </motion.button>
          </div>
        </div>

        {/* Test Email Form */}
        <AnimatePresence>
          {showEmailTestForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Send Test Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={testEmailData.recipient}
                    onChange={(e) => setTestEmailData({...testEmailData, recipient: e.target.value})}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={testEmailData.subject}
                    onChange={(e) => setTestEmailData({...testEmailData, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={testEmailData.message}
                    onChange={(e) => setTestEmailData({...testEmailData, message: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendTestEmail}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send Test Email
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // Maintenance Render
  const renderMaintenance = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
          <Server className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Maintenance</h2>
          <p className="text-sm text-gray-500">Monitor system health and perform maintenance tasks</p>
        </div>
      </div>

      {/* System Health Stats */}
      {systemHealth && (
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">CPU Usage</span>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{systemHealth.cpu_percent}%</p>
            <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${systemHealth.cpu_percent}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Memory Usage</span>
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{systemHealth.memory_percent}%</p>
            <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-600 h-full rounded-full transition-all"
                style={{ width: `${systemHealth.memory_percent}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Disk Usage</span>
              <Server className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{systemHealth.disk_percent}%</p>
            <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${systemHealth.disk_percent}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">System Uptime</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemHealth.uptime}</p>
          </motion.div>
        </div>
      )}

      {/* Maintenance Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearCache}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Clear Cache</h3>
          <p className="text-sm text-gray-500">Remove temporary files and cached data</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={optimizeDatabase}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Optimize Database</h3>
          <p className="text-sm text-gray-500">Improve database performance</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchSystemHealth}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Refresh Stats</h3>
          <p className="text-sm text-gray-500">Update system health metrics</p>
        </motion.button>
      </div>
    </div>
  );

  // Guidelines Render
  const renderGuidelines = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Guidelines</h2>
            <p className="text-sm text-gray-500">Manage help documentation and guidelines</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGuidelineForm(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Guideline
        </motion.button>
      </div>

      {/* Guidelines Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {guidelines.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No guidelines created yet</p>
          </div>
        ) : (
          guidelines.map((guideline) => (
            <motion.div
              key={guideline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {guideline.title || guideline.description || 'Untitled Guideline'}
                      </h3>
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-indigo-600">
                        {guideline.key || guideline.setting_key || 'no-key'}
                      </code>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteGuideline(guideline.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  title="Delete Guideline"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Content with better formatting */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {guideline.content || guideline.setting_value || 'No content available'}
                  </p>
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Added {guideline.created_at ? new Date(guideline.created_at).toLocaleDateString() : 'recently'}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Guideline ID: {guideline.id}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Guideline Form */}
      <AnimatePresence>
        {showGuidelineForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowGuidelineForm(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-7 h-7 text-indigo-600" />
                    Create New Guideline
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Add helpful documentation and instructions</p>
                </div>
                <button
                  onClick={() => setShowGuidelineForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-indigo-600" />
                    Guideline Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guidelineFormData.key}
                    onChange={(e) => setGuidelineFormData({...guidelineFormData, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                    placeholder="e.g., HOW_TO_ADD_LSC"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  />
                  <p className="mt-1 text-xs text-gray-500">Unique identifier in UPPERCASE_WITH_UNDERSCORES format</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guidelineFormData.title}
                    onChange={(e) => setGuidelineFormData({...guidelineFormData, title: e.target.value})}
                    placeholder="e.g., How to Add LSC Admin"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">User-friendly title that describes the guideline</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Edit className="w-4 h-4 text-indigo-600" />
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={guidelineFormData.content}
                    onChange={(e) => setGuidelineFormData({...guidelineFormData, content: e.target.value})}
                    placeholder="Enter detailed step-by-step instructions here...&#10;&#10;You can use multiple lines and paragraphs.&#10;&#10;Example:&#10;1. First, navigate to the section&#10;2. Then click the button&#10;3. Fill in the required fields"
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-normal resize-y"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Write clear, detailed instructions. Use line breaks for better readability.
                  </p>
                </div>

                {/* Preview Section */}
                {guidelineFormData.content && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      Preview
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {guidelineFormData.content}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateGuideline}
                    disabled={!guidelineFormData.key || !guidelineFormData.title || !guidelineFormData.content}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Create Guideline
                  </motion.button>
                  <button
                    onClick={() => {
                      setShowGuidelineForm(false);
                      setGuidelineFormData({ key: '', title: '', content: '' });
                    }}
                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'lsc-admins':
        return renderLSCAdmins();
      case 'settings':
        return renderSystemSettings();
      case 'database':
        return renderDatabase();
      case 'backups':
        return renderBackups();
      case 'audit-logs':
        return renderAuditLogs();
      case 'security':
        return renderSecurity();
      case 'email':
        return renderEmail();
      case 'maintenance':
        return renderMaintenance();
      case 'guidelines':
        return renderGuidelines();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 xs:p-5 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header - Premium Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900">
              Super Admin
            </h1>
            <p className="text-gray-500 text-sm xs:text-base font-medium">Complete system control panel</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation - Modern Pill Style */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {controlCategories.map((category, index) => (
            <motion.button
              key={category.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(category.key)}
              style={{
                backgroundColor: activeTab === category.key ? category.color : 'transparent',
                color: activeTab === category.key ? '#FFFFFF' : '#6B7280'
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === category.key
                  ? 'shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span style={{
                color: activeTab === category.key ? '#FFFFFF' : category.color
              }}>
                {category.icon}
              </span>
              <span>{category.name}</span>
              {activeTab === category.key && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area - Clean Container */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>

      {/* Floating Action Buttons - Expandable Toggle Menu */}
      <div className="fixed bottom-8 right-6 z-30">
        {/* Sub Action Buttons */}
        <AnimatePresence>
          {showFABMenu && (
            <>
              {/* Refresh Button */}
              <motion.button
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: -180 }}
                exit={{ scale: 0, opacity: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  fetchDashboardStats();
                  setShowFABMenu(false);
                }}
                className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-white border-2 border-purple-500 text-purple-600 shadow-lg hover:shadow-xl flex items-center justify-center group transition-all"
                title="Refresh Data"
              >
                <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              </motion.button>

              {/* Quick Add Button */}
              <motion.button
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: -120 }}
                exit={{ scale: 0, opacity: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowLSCForm(true);
                  setShowFABMenu(false);
                }}
                className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-2xl flex items-center justify-center group transition-all"
                title="Quick Add LSC Admin"
              >
                <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>

              {/* Help Button */}
              <motion.button
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: -60 }}
                exit={{ scale: 0, opacity: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  toast.info('Documentation & Help is coming soon!');
                  setShowFABMenu(false);
                }}
                className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-2xl flex items-center justify-center group transition-all"
                title="Help & Documentation"
              >
                <Info className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: showFABMenu ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFABMenu(!showFABMenu)}
          className={`w-10 h-10 rounded-full ${
            showFABMenu 
              ? 'bg-gradient-to-br from-red-500 to-red-600' 
              : 'bg-gradient-to-br from-purple-600 to-blue-600'
          } text-white shadow-2xl hover:shadow-3xl flex items-center justify-center transition-all duration-300`}
          title={showFABMenu ? "Close Menu" : "Quick Actions"}
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {activeTab !== 'dashboard' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-40 transition-all"
            title="Scroll to Top"
          >
            <ArrowRight className="w-5 h-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog - Modern & Beautiful */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) confirmDialog.onCancel();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={`bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden ${
                confirmDialog.type === 'danger' ? 'border-4 border-red-500' :
                confirmDialog.type === 'warning' ? 'border-4 border-yellow-500' :
                confirmDialog.type === 'success' ? 'border-4 border-green-500' :
                'border-4 border-blue-500'
              }`}
            >
              {/* Header with Icon */}
              <div className={`p-6 ${
                confirmDialog.type === 'danger' ? 'bg-gradient-to-br from-red-50 to-red-100' :
                confirmDialog.type === 'warning' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100' :
                confirmDialog.type === 'success' ? 'bg-gradient-to-br from-green-50 to-green-100' :
                'bg-gradient-to-br from-blue-50 to-blue-100'
              }`}>
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      confirmDialog.type === 'danger' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      confirmDialog.type === 'warning' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                      confirmDialog.type === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}
                  >
                    {confirmDialog.type === 'danger' && <AlertTriangle className="w-8 h-8 text-white" />}
                    {confirmDialog.type === 'warning' && <AlertTriangle className="w-8 h-8 text-white" />}
                    {confirmDialog.type === 'success' && <CheckCircle2 className="w-8 h-8 text-white" />}
                    {confirmDialog.type === 'info' && <Info className="w-8 h-8 text-white" />}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{confirmDialog.title}</h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">{confirmDialog.message}</p>
                
                {confirmDialog.requiresInput && (
                  <div className="pt-2">
                    <input
                      type="text"
                      id="confirmInput"
                      placeholder={confirmDialog.inputPlaceholder}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-lg font-semibold"
                      autoFocus
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Type "<span className="font-bold text-red-600">{confirmDialog.expectedInput}</span>" to confirm
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDialog.onCancel}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  {confirmDialog.cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (confirmDialog.requiresInput) {
                      const input = document.getElementById('confirmInput').value;
                      if (input === confirmDialog.expectedInput) {
                        confirmDialog.onConfirm(input);
                      } else {
                        toast.error(`Please type "${confirmDialog.expectedInput}" to confirm`);
                      }
                    } else {
                      confirmDialog.onConfirm();
                    }
                  }}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all ${
                    confirmDialog.type === 'danger' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                    confirmDialog.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
                    confirmDialog.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }`}
                >
                  {confirmDialog.confirmText}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminControl;
