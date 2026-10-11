import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Shield, Lock, Bell, Check, AlertTriangle, 
  Upload, X, Sliders, RefreshCw, Key, Mail, ChevronRight, 
  Trash2, Eye, EyeOff, Globe, Languages, UserCheck, 
  Download, CheckCircle2, AlertCircle, Info, Building, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccountCenterProps {
  currentUser: any;
  onSaveProfile: (updatedProfile: any) => void;
  isProfileDirty: boolean;
  setIsProfileDirty: (dirty: boolean) => void;
  activePlan: any;
  computedStorageMB: number;
}

export default function AccountCenter({
  currentUser,
  onSaveProfile,
  isProfileDirty,
  setIsProfileDirty,
  activePlan,
  computedStorageMB
}: AccountCenterProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'profile' | 'locale' | 'security' | 'preferences'>('profile');

  // Form states initialized from currentUser
  const [editedUser, setEditedUser] = useState<any>(null);
  
  // Validation, save status & loading states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Crop photo states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security password fields
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: 'bg-slate-200' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA walkthrough states
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<1 | 2 | 3>(1);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Export data states
  const [exportingData, setExportingData] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Delete account confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Local user instance update on prop changes
  useEffect(() => {
    if (currentUser) {
      setEditedUser(JSON.parse(JSON.stringify(currentUser)));
    }
  }, [currentUser]);

  // Handle live dirty tracking
  useEffect(() => {
    if (!editedUser || !currentUser) {
      setIsProfileDirty(false);
      return;
    }
    const checkFields = [
      'name', 'displayName', 'username', 'email', 'phone', 'country', 
      'language', 'timezone', 'dateFormat', 'twoFactorEnabled', 'avatar',
      'connectedAccounts', 'notifications', 'sessions'
    ];
    const dirty = checkFields.some(key => {
      return JSON.stringify(editedUser[key]) !== JSON.stringify(currentUser[key]);
    });
    setIsProfileDirty(dirty);
  }, [editedUser, currentUser, setIsProfileDirty]);

  // Handle generic field change
  const handleFieldChange = (key: string, value: any) => {
    if (!editedUser) return;
    setEditedUser((prev: any) => ({
      ...prev,
      [key]: value
    }));
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // Nested property edits
  const handleNestedFieldChange = (parent: string, child: string, value: any) => {
    if (!editedUser) return;
    setEditedUser((prev: any) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [child]: value
      }
    }));
  };

  // Validations
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!editedUser) return false;

    if (!editedUser.name || editedUser.name.trim() === '') {
      errors.name = 'Full name is required';
    }
    if (!editedUser.displayName || editedUser.displayName.trim() === '') {
      errors.displayName = 'Display name is required';
    }
    if (!editedUser.username || editedUser.username.trim() === '') {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,15}$/.test(editedUser.username)) {
      errors.username = 'Username must be 3-15 chars, alphanumeric or underscores';
    }
    if (!editedUser.email || editedUser.email.trim() === '') {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!editedUser.phone || editedUser.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save changes handler
  const handleSaveChanges = async () => {
    if (!editedUser) return;
    if (!validateForm()) {
      setSaveStatus({ type: 'error', message: 'Please fix the errors before saving.' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
      return;
    }

    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      onSaveProfile(editedUser);
      setSaveStatus({ type: 'success', message: 'Account Center configurations updated successfully!' });
      setIsProfileDirty(false);
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'An unexpected issue occurred while saving.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
    }
  };

  // Drag handlers for Crop Modal
  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Image upload selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImageSrc(event.target.result as string);
          setPosition({ x: 0, y: 0 });
          setZoom(1);
          setCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas Crop execution
  const executeCrop = () => {
    if (!uploadedImageSrc) return;
    const img = new Image();
    img.src = uploadedImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 250;
      canvas.height = 250;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 250, 250);
        ctx.translate(125, 125);
        ctx.scale(zoom, zoom);

        const maxDim = Math.max(img.width, img.height);
        const scaleFactor = 250 / maxDim;
        const w = img.width * scaleFactor;
        const h = img.height * scaleFactor;

        ctx.translate(position.x / zoom, position.y / zoom);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);

        const base64Url = canvas.toDataURL('image/jpeg', 0.9);
        handleFieldChange('avatar', base64Url);
      }
      setCropModalOpen(false);
    };
  };

  const triggerFileSelection = () => {
    fileInputRef.current?.click();
  };

  // Password fields strength calculation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPasswords(prev => ({ ...prev, new: val }));

    let score = 0;
    if (val.length >= 8) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    let label = 'Very Weak';
    let color = 'bg-rose-500';

    if (score === 1) {
      label = 'Weak';
      color = 'bg-rose-400';
    } else if (score === 2) {
      label = 'Fair';
      color = 'bg-amber-400';
    } else if (score === 3) {
      label = 'Strong';
      color = 'bg-slate-700';
    } else if (score === 4) {
      label = 'Excellent';
      color = 'bg-emerald-500';
    }

    if (val.length === 0) {
      score = 0;
      label = '';
      color = 'bg-slate-200';
    }

    setPasswordStrength({ score, label, color });
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setSaveStatus({ type: 'error', message: 'All password fields are required.' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setSaveStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (passwords.new.length < 8) {
      setSaveStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsChangingPassword(false);
    
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordStrength({ score: 0, label: '', color: 'bg-slate-200' });
    setSaveStatus({ type: 'success', message: 'Password updated successfully!' });
    setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
  };

  // 2FA handlers
  const handleTwoFactorToggle = () => {
    if (editedUser?.twoFactorEnabled) {
      handleFieldChange('twoFactorEnabled', false);
      setSaveStatus({ type: 'success', message: 'Two-Factor Authentication (2FA) disabled.' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    } else {
      setTwoFactorStep(1);
      setTwoFactorCode('');
      setTwoFactorError('');
      const codes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase());
      setBackupCodes(codes);
      setTwoFactorModalOpen(true);
    }
  };

  const verifyTwoFactorCode = () => {
    if (twoFactorCode.trim().length !== 6 || !/^\d+$/.test(twoFactorCode)) {
      setTwoFactorError('Please enter a valid 6-digit numeric code.');
      return;
    }
    setTwoFactorStep(2);
  };

  const finishTwoFactorSetup = () => {
    handleFieldChange('twoFactorEnabled', true);
    setTwoFactorModalOpen(false);
    setSaveStatus({ type: 'success', message: 'Two-Factor Authentication (2FA) activated!' });
    setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
  };

  // Export User data archive
  const handleExportData = async () => {
    setExportingData(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const userDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editedUser, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute("href", userDataStr);
          dlAnchor.setAttribute("download", `kava-account-${editedUser?.username || 'user'}.json`);
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();

          setExportingData(false);
          setSaveStatus({ type: 'success', message: 'Account data archive downloaded successfully.' });
          setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
          return 100;
        }
        return p + 25;
      });
    }, 250);
  };

  // Account Delete handler
  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() !== 'delete account') {
      alert("Verification text is incorrect.");
      return;
    }
    setDeleteModalOpen(false);
    localStorage.removeItem('kava_active_user');
    window.location.reload();
  };

  if (!editedUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-6 h-6 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left max-w-7xl mx-auto pb-16">
      
      {/* Standard KAVA Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider mb-1">
            <span>Workspace Settings</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-extrabold">Account Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">Account Center</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage your personal identity, login credentials, localization preferences, and security settings.
          </p>
        </div>

        {/* Global Save / Action Buttons in Header */}
        <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-center">
          {isProfileDirty && (
            <button
              type="button"
              onClick={() => setEditedUser(JSON.parse(JSON.stringify(currentUser)))}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer min-h-[40px]"
            >
              Discard Changes
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || !isProfileDirty}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 min-h-[40px] shadow-xs transition-all cursor-pointer ${
              isProfileDirty 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      {saveStatus.type && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-start space-x-3 border shadow-xs transition-all ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800' 
              : 'bg-rose-50/70 border-rose-200/80 text-rose-800'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5 font-mono">
              {saveStatus.type === 'success' ? 'Update Saved' : 'Action Required'}
            </h4>
            <p className="text-xs font-medium">{saveStatus.message}</p>
          </div>
        </motion.div>
      )}

      {/* Horizontal Nav Bar (Matching KAVA Tabs) */}
      <div className="border-b border-slate-200/80 overflow-x-auto scrollbar-none snap-x snap-mandatory flex space-x-2 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`snap-start min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'profile' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Contact</span>
          {(validationErrors.name || validationErrors.email || validationErrors.username) && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('locale')}
          className={`snap-start min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'locale' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Locale & Regional</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`snap-start min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'security' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Password & Security</span>
          {editedUser.twoFactorEnabled && (
            <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded font-mono uppercase">2FA On</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`snap-start min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'preferences' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferences & Data</span>
        </button>
      </div>

      {/* TAB CONTENT PANES */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: PROFILE & CONTACT */}
        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {/* Card 1: Profile Photo */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group shrink-0">
                    <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-2xl border-2 border-slate-200 shadow-xs relative">
                      {editedUser.avatar ? (
                        <img src={editedUser.avatar} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span>
                          {editedUser.name ? editedUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileSelection}
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md cursor-pointer transition-transform hover:scale-105"
                      title="Upload photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-slate-900 font-sans">Profile Photo</h3>
                      <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        Square 1:1
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium max-w-md leading-relaxed">
                      Upload a JPEG or PNG profile picture. Ideal size is 250×250 pixels. Adjust zoom and crop before saving.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={triggerFileSelection}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer min-h-[40px]"
                  >
                    Upload New Image
                  </button>
                  {editedUser.avatar && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('avatar', '')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer min-h-[40px]"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Personal Information */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Personal Identity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your display credentials visible across co-hosted capsules and workspace logs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Full Legal Name</label>
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`mt-1.5 w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none transition-all ${
                      validationErrors.name ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:bg-white'
                    }`}
                    placeholder="First and last name"
                  />
                  {validationErrors.name && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Display Name</label>
                  <input
                    type="text"
                    value={editedUser.displayName || ''}
                    onChange={(e) => handleFieldChange('displayName', e.target.value)}
                    className={`mt-1.5 w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none transition-all ${
                      validationErrors.displayName ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:bg-white'
                    }`}
                    placeholder="Public nickname"
                  />
                  {validationErrors.displayName && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.displayName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Username Handle</label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
                    <input
                      type="text"
                      value={editedUser.username || ''}
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none transition-all ${
                        validationErrors.username ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:bg-white'
                      }`}
                      placeholder="username"
                    />
                  </div>
                  {validationErrors.username && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.username}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Workspace Role</label>
                  <div className="mt-1.5 w-full bg-slate-100/70 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 flex items-center justify-between select-none">
                    <span>{editedUser.role || 'Workspace Owner'}</span>
                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded uppercase">Default</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Contact Details */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Contact Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Primary communication pathways for workspace notifications and emergency recovery.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center space-x-0.5 uppercase tracking-wider border border-emerald-100">
                      <Check className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`mt-1.5 w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none transition-all ${
                      validationErrors.email ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:bg-white'
                    }`}
                    placeholder="email@domain.com"
                  />
                  {validationErrors.email && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Mobile Phone</label>
                  <input
                    type="text"
                    value={editedUser.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={`mt-1.5 w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none transition-all ${
                      validationErrors.phone ? 'border-rose-300 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:bg-white'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {validationErrors.phone && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LOCALE & REGIONAL */}
        {activeTab === 'locale' && (
          <motion.div 
            key="locale"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Localization & Regional Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize time zones, date formats, and language presets across host dashboards.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Country / Region</label>
                  <select
                    value={editedUser.country || 'United States'}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Indonesia</option>
                    <option>Singapore</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Preferred Language</label>
                  <select
                    value={editedUser.language || 'English (United States)'}
                    onChange={(e) => handleFieldChange('language', e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option>English (United States)</option>
                    <option>Deutsch (Deutschland)</option>
                    <option>Bahasa Indonesia</option>
                    <option>Français (France)</option>
                    <option>Español (España)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Time Zone</label>
                  <select
                    value={editedUser.timezone || 'UTC -07:00 (Pacific Standard Time)'}
                    onChange={(e) => handleFieldChange('timezone', e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option>UTC -08:00 (Alaska Daylight Time)</option>
                    <option>UTC -07:00 (Pacific Standard Time)</option>
                    <option>UTC +00:00 (Greenwich Mean Time)</option>
                    <option>UTC +01:00 (Central European Time)</option>
                    <option>UTC +07:00 (Western Indonesian Time)</option>
                    <option>UTC +08:00 (Singapore Standard Time)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Date & Time Format</label>
                  <select
                    value={editedUser.dateFormat || 'MM/DD/YYYY (12-hour)'}
                    onChange={(e) => handleFieldChange('dateFormat', e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option>MM/DD/YYYY (12-hour)</option>
                    <option>DD/MM/YYYY (24-hour)</option>
                    <option>YYYY-MM-DD (24-hour)</option>
                    <option>DD MMM YYYY (12-hour)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: PASSWORD & SECURITY */}
        {activeTab === 'security' && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {/* Card 1: Change Password */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Change Password</h3>
                <p className="text-xs text-slate-500 mt-0.5">Update your password regularly to safeguard your account and workspace data.</p>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Current Password</label>
                    <div className="relative mt-1.5">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">New Password</label>
                    <div className="relative mt-1.5">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                        placeholder="Min 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Confirm New Password</label>
                    <div className="relative mt-1.5">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                        placeholder="Confirm matches"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwords.new && (
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Complexity Strength</span>
                      <span className={`font-black uppercase tracking-wider ${
                        passwordStrength.score >= 3 ? 'text-emerald-600' : passwordStrength.score === 2 ? 'text-amber-600' : 'text-rose-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 4) * 100}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 cursor-pointer transition-all min-h-[40px]"
                  >
                    {isChangingPassword ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Card 2: 2FA */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-slate-800" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Require an authenticator app code in addition to your password for extra security.</p>
                </div>

                <button
                  type="button"
                  onClick={handleTwoFactorToggle}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] shrink-0 ${
                    editedUser.twoFactorEnabled 
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                  }`}
                >
                  {editedUser.twoFactorEnabled ? 'Disable 2FA' : 'Activate 2FA'}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3 text-xs text-slate-600">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p>
                  When enabled, you will be prompted for a 6-digit verification code from Google Authenticator, Authy, or Microsoft Authenticator whenever you log in.
                </p>
              </div>
            </div>

            {/* Card 3: Connected Accounts */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Connected Accounts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Link third-party social identities for single sign-on verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center font-black text-xs font-sans text-slate-700">
                      G
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Google Workspace</h4>
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center space-x-0.5">
                        <Check className="w-3 h-3" />
                        <span>Connected</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNestedFieldChange('connectedAccounts', 'google', !editedUser.connectedAccounts?.google)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    {editedUser.connectedAccounts?.google ? 'Unlink' : 'Link'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-900 text-white shadow-xs flex items-center justify-center font-black text-xs font-sans">
                      A
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Sign in with Apple</h4>
                      <p className={`text-[10px] font-bold ${editedUser.connectedAccounts?.apple ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {editedUser.connectedAccounts?.apple ? 'Connected' : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNestedFieldChange('connectedAccounts', 'apple', !editedUser.connectedAccounts?.apple)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    {editedUser.connectedAccounts?.apple ? 'Unlink' : 'Link'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: PREFERENCES & DATA */}
        {activeTab === 'preferences' && (
          <motion.div 
            key="preferences"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {/* Card 1: Preferences */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Account Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Opt into early feature previews and developer telemetry reporting.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Participate in Beta Features</h4>
                    <p className="text-[10px] text-slate-500">Get early access to upcoming host tools and live projector themes.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded text-slate-900 focus:ring-slate-200 h-4 w-4 border-slate-300"
                    defaultChecked
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Send Diagnostic Telemetry</h4>
                    <p className="text-[10px] text-slate-500">Help improve performance by sending anonymous crash logs.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded text-slate-900 focus:ring-slate-200 h-4 w-4 border-slate-300"
                    defaultChecked
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Export Data Archive */}
            <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">Data Portability Archive</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Download a complete structured JSON archive of your personal profile and host logs.</p>
                </div>

                <button
                  type="button"
                  onClick={handleExportData}
                  disabled={exportingData}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer min-h-[40px] shrink-0 flex items-center space-x-2"
                >
                  {exportingData ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Exporting ({exportProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Archive</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card 3: Danger Zone */}
            <div className="bg-white border border-rose-200/80 p-5 sm:p-6 rounded-[24px] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-rose-600 uppercase font-mono tracking-wider flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Danger Zone</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Permanently deactivate your account and wipe all associated memory capsules.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmText('');
                    setDeleteModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer min-h-[40px] shrink-0"
                >
                  Deactivate Account
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-700/90 leading-relaxed">
                Deleting your account is permanent. All events, photo contributions, guest messages, and domain mappings will be wiped immediately.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CROP PHOTO MODAL */}
      <AnimatePresence>
        {cropModalOpen && uploadedImageSrc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCropModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-slate-800" />
                  <h3 className="text-sm font-extrabold text-slate-900">Crop Profile Picture</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center my-3">
                <div 
                  ref={containerRef}
                  onMouseMove={onDrag}
                  onMouseDown={startDrag}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  className="w-52 h-52 rounded-full overflow-hidden bg-slate-900 relative cursor-grab active:cursor-grabbing shadow-inner select-none flex items-center justify-center border-4 border-slate-100"
                >
                  <img
                    src={uploadedImageSrc}
                    alt="Uploaded candidate crop"
                    draggable="false"
                    className="absolute max-w-none transition-transform pointer-events-none"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                  <div className="absolute inset-0 border-[12px] border-slate-200 pointer-events-none rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5 px-2 mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
                  <span>Zoom Out</span>
                  <span>Zoom In ({zoom.toFixed(1)}x)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              <div className="flex gap-2 mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeCrop}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Apply Crop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TWO-FACTOR ACTIVATE MODAL */}
      <AnimatePresence>
        {twoFactorModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTwoFactorModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl text-slate-800"
            >
              {twoFactorStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900">Setup 2FA Authenticator</h3>
                    <button type="button" onClick={() => setTwoFactorModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scan the QR code with your authenticator app (Google Authenticator or Authy), then enter the 6-digit verification code below.
                  </p>

                  <div className="flex justify-center py-2">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
                      <div className="w-32 h-32 bg-slate-900 flex items-center justify-center rounded-xl p-2">
                        <div className="w-full h-full border border-dashed border-slate-700 p-1 flex flex-wrap gap-1">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className={`w-3.5 h-3.5 rounded-xs ${
                              (i * 7 + 3) % 2 === 0 ? 'bg-white' : 'bg-transparent'
                            }`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-2">Secret: KV2A-8821-AUTH</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">6-Digit Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => {
                        setTwoFactorCode(e.target.value);
                        setTwoFactorError('');
                      }}
                      placeholder="000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-sm font-black font-mono tracking-widest text-slate-800 focus:outline-none focus:border-slate-400"
                    />
                    {twoFactorError && (
                      <p className="text-[10px] font-bold text-rose-500 flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{twoFactorError}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTwoFactorModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={verifyTwoFactorCode}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              )}

              {twoFactorStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900">Backup Recovery Codes</h3>
                    <button type="button" onClick={() => setTwoFactorModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Save these emergency backup codes in a safe place. You can use them if you lose access to your phone.
                  </p>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs font-mono font-bold text-slate-700 select-all">
                    {backupCodes.map((code, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-400">{idx + 1}.</span>
                        <span>{code}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTwoFactorStep(1)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={finishTwoFactorSetup}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Finish Activation
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEACTIVATE ACCOUNT CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-rose-100 text-slate-800"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <h3 className="text-sm font-extrabold text-rose-600 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Deactivate Account</span>
                  </h3>
                  <button type="button" onClick={() => setDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  This action is permanent. All events, guest photos, videos, and subscription records linked to your account will be deleted immediately.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Type <strong className="text-rose-600 font-mono">"delete account"</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                    placeholder="delete account"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText.toLowerCase() !== 'delete account'}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      deleteConfirmText.toLowerCase() === 'delete account'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Confirm Deactivation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
