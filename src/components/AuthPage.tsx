import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle2,
  Tv,
  Users,
  QrCode,
  Globe,
  Heart,
  Camera,
  Mic,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  KeyRound,
  Send
} from 'lucide-react';
import { 
  HostUser, 
  getActiveUser, 
  authenticateWithCredentials, 
  authenticateWithGoogle,
  authenticateWithApple,
  requestPasswordReset
} from '../lib/auth';
import { useTranslation } from '../lib/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import KavaLogo from './KavaLogo';

interface AuthPageProps {
  mode: 'signup' | 'login';
  onAuthSuccess?: (user: HostUser) => void;
}

export default function AuthPage({ mode, onAuthSuccess }: AuthPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine redirect URL from query string or location state
  const redirectParam = searchParams.get('redirect') || (location.state as any)?.from;
  const intendedAction = searchParams.get('intendedAction') || (redirectParam?.includes('create-capsule') ? 'create_capsule' : 'dashboard');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Forgot Password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-amber-400', textColor: 'text-amber-600' };
    if (score <= 4) return { score: 2, label: 'Good', color: 'bg-teal-500', textColor: 'text-teal-600' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  }, [password]);

  // If user is already authenticated, automatically redirect away from /signup or /login
  useEffect(() => {
    const active = getActiveUser();
    if (active) {
      const destination = redirectParam || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [redirectParam, navigate]);

  // Construct search query for tab switching links to preserve redirect parameters
  const currentQuery = searchParams.toString();
  const signupLink = `/signup${currentQuery ? `?${currentQuery}` : ''}`;
  const loginLink = `/login${currentQuery ? `?${currentQuery}` : ''}`;

  const handleSuccessRedirect = (user: HostUser) => {
    setIsSuccess(true);
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    
    // Smooth transition before redirect
    setTimeout(() => {
      const destination = redirectParam || (intendedAction === 'create_capsule' ? '/create-capsule/step/1' : '/dashboard');
      navigate(destination, { replace: true });
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(t('auth.error_invalid_email', 'Please enter a valid email address.'));
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage(t('auth.error_missing_name', 'Please enter your full name to setup your host account.'));
      return;
    }

    if (!password) {
      setErrorMessage(t('auth.error_missing_password', 'Please enter your password.'));
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMessage(t('auth.error_short_password', 'Password must be at least 6 characters.'));
      return;
    }

    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage(t('auth.error_agree_terms', 'Please agree to the Terms of Service and Privacy Policy to continue.'));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const user = authenticateWithCredentials(cleanEmail, password, fullName);
        setIsLoading(false);
        handleSuccessRedirect(user);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err?.message || t('auth.error_generic', 'Authentication failed. Please try again.'));
      }
    }, 450);
  };

  const handleGoogleAuth = () => {
    setSocialLoading('google');
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const user = authenticateWithGoogle();
        setSocialLoading(null);
        handleSuccessRedirect(user);
      } catch (err: any) {
        setSocialLoading(null);
        setErrorMessage(t('auth.error_google', 'Google authentication failed. Please try again.'));
      }
    }, 550);
  };

  const handleAppleAuth = () => {
    setSocialLoading('apple');
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const user = authenticateWithApple();
        setSocialLoading(null);
        handleSuccessRedirect(user);
      } catch (err: any) {
        setSocialLoading(null);
        setErrorMessage(t('auth.error_apple', 'Apple authentication failed. Please try again.'));
      }
    }, 550);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const clean = resetEmail.trim();
    if (!clean || !clean.includes('@')) {
      setResetError(t('auth.error_invalid_email', 'Please enter a valid email address.'));
      return;
    }

    setResetLoading(true);
    try {
      await requestPasswordReset(clean);
      setResetLoading(false);
      setResetSent(true);
    } catch (err) {
      setResetLoading(false);
      setResetError(t('auth.error_reset_failed', 'Failed to send reset link. Please try again.'));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between selection:bg-slate-900 selection:text-white font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between z-20">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2.5 group cursor-pointer focus:outline-none"
          id="auth-logo-btn"
        >
          <KavaLogo variant="wordmark" size="md" showPetalBadge />
        </button>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <LanguageSwitcher />

          {/* Quick Switch Button (Desktop) */}
          <Link
            to={mode === 'signup' ? loginLink : signupLink}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200/80 px-4 py-2 rounded-full transition-all shadow-2xs cursor-pointer min-h-[38px]"
            id="header-switch-mode-btn"
          >
            <span>
              {mode === 'signup' 
                ? t('auth.header_have_account', 'Already have an account?') 
                : t('auth.header_no_account', 'New to KAVA?')}
            </span>
            <span className="font-bold text-teal-600 hover:underline">
              {mode === 'signup' ? t('auth.tab_signin', 'Log In') : t('auth.tab_signup', 'Sign Up')}
            </span>
          </Link>

          {/* Back to Home Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-600 hover:text-slate-950 bg-white border border-slate-200/80 hover:bg-slate-50 px-3.5 py-2 rounded-full transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer min-h-[38px]"
            id="back-home-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('common.back_to_home', 'Back to Home')}</span>
            <span className="md:hidden">{t('common.home', 'Home')}</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ========================================================================= */}
          {/* Left Column: Emotional Visual / Brand Storytelling Panel */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0A1828] to-[#04101E] text-white rounded-3xl p-8 lg:p-9 flex-col justify-between relative overflow-hidden shadow-2xl border border-slate-800/80">
            
            {/* Ambient Lighting & Shapes inside storytelling card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Tag & Emotional Brand Headline */}
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-teal-300 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>{t('auth.story_platform_tag', 'Collaborative Memory Capsules')}</span>
              </div>

              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {t('auth.story_hero_title', 'Where every moment finds its forever home.')}
                </h2>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed font-light">
                  {t('auth.story_hero_sub', 'Preserve raw photos, unscripted videos, voicenotes, and heartfelt guestbook messages in one collaborative space.')}
                </p>
              </div>
            </div>

            {/* Visual Floating Memory Showcase Stack */}
            <div className="my-6 relative z-10 space-y-3">
              
              {/* Floating Memory Card 1: Wedding Photo */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 shadow-lg flex items-center space-x-3 hover:bg-white/15 transition-all"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 relative shadow-xs">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200" 
                    alt="Wedding memory" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Camera className="w-3 h-3 text-white absolute bottom-1 right-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white truncate">Sofia & Leo Wedding</span>
                    <span className="text-[10px] text-teal-300 font-mono">Live now</span>
                  </div>
                  <p className="text-[11px] text-slate-300/90 truncate">Elena C. uploaded 3 candid photos</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">2 mins ago • Capsule #SOFIA-LEO</p>
                </div>
              </motion.div>

              {/* Floating Memory Card 2: Voice Note Audio Capsule */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 shadow-lg flex items-center space-x-3 hover:bg-white/15 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/30 to-emerald-500/30 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30 shadow-xs">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white truncate">Aunt Maria's Toast</span>
                    <span className="text-[10px] text-emerald-300 font-mono">0:28</span>
                  </div>
                  {/* Simulated audio waveform */}
                  <div className="flex items-center space-x-0.5 my-1">
                    {[40, 75, 100, 60, 85, 30, 90, 100, 50, 70, 95, 45, 80, 65, 90, 40].map((h, i) => (
                      <span 
                        key={i} 
                        className="w-1 bg-teal-400/80 rounded-full" 
                        style={{ height: `${h * 0.14}px` }} 
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono">Lossless Audio Note • Saved</p>
                </div>
              </motion.div>

              {/* Capsule Live Status Pill */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">184 Live Contributions</span>
                </span>
                <span className="text-teal-300 font-mono text-[10px]">60fps Projection Ready</span>
              </div>
            </div>

            {/* Three Key Trust & Value Indicators */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 relative z-10">
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{t('auth.trust_secure_title', 'Private & Host-Controlled')}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{t('auth.trust_secure_sub', 'Password protection, unlisted capsules, and full moderation controls.')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <QrCode className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{t('auth.trust_qr_title', 'Zero Guest App Friction')}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{t('auth.trust_qr_sub', 'Guests scan QR stands to upload in seconds without downloading apps.')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Tv className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{t('auth.trust_vault_title', 'Memories That Last')}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{t('auth.trust_vault_sub', 'Pristine 4K media vaults and real-time live venue projection.')}</p>
                </div>
              </div>
            </div>

            {/* Bottom Host Quote */}
            <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-slate-300/80 italic font-light relative z-10 flex items-center justify-between">
              <span>"KAVA captured 300+ candid memories our photographer couldn't possibly be everywhere for."</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Right Column: Authentication Card & Forms */}
          {/* ========================================================================= */}
          <div className="col-span-1 lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/40 flex flex-col justify-between text-left relative overflow-hidden">
            
            <div className="space-y-6">
              
              {/* Context Banner if user came from Create Capsule or specific action */}
              {intendedAction === 'create_capsule' && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-teal-50/90 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-left"
                >
                  <div className="p-2 bg-teal-600 text-white rounded-xl shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-teal-950">
                      {t('auth.create_capsule_prompt', 'Authentication required to create capsule')}
                    </p>
                    <p className="text-[11px] text-teal-800 leading-relaxed">
                      {t('auth.create_capsule_desc', 'Your capsule will be linked directly to your host workspace account so you can customize QR stands and manage live screens.')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Title & Subtitle Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {mode === 'signup'
                    ? t('auth.signup_title', 'Create your Host Account')
                    : t('auth.signin_title', 'Welcome back!')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {mode === 'signup'
                    ? t('auth.signup_sub', 'Join thousands of hosts building collaborative memory vaults and live screens.')
                    : t('auth.signin_sub', 'Sign in to access your memory capsules, guest lounge settings, and live projection.')}
                </p>
              </div>

              {/* Seamless Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl text-xs font-semibold text-center border border-slate-200/60">
                <Link
                  to={loginLink}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    mode === 'login'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                  id="tab-btn-login"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('auth.tab_signin', 'Log In')}</span>
                </Link>
                <Link
                  to={signupLink}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    mode === 'signup'
                      ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                  id="tab-btn-signup"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('auth.tab_signup', 'Sign Up')}</span>
                </Link>
              </div>

              {/* Social OAuth Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading || socialLoading !== null || isSuccess}
                  className="w-full bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2.5 shadow-2xs cursor-pointer min-h-[44px] disabled:opacity-50"
                  id="btn-google-auth"
                >
                  {socialLoading === 'google' ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{t('auth.continue_google', 'Continue with Google')}</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={handleAppleAuth}
                  disabled={isLoading || socialLoading !== null || isSuccess}
                  className="w-full bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2.5 shadow-2xs cursor-pointer min-h-[44px] disabled:opacity-50"
                  id="btn-apple-auth"
                >
                  {socialLoading === 'apple' ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.65-2.8 1.45-.6.7-1.13 1.84-.99 2.95 1.08.08 2.14-.52 2.8-1.3" />
                    </svg>
                  )}
                  <span>{t('auth.continue_apple', 'Continue with Apple')}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400">
                  {t('auth.or_email', 'or continue with email')}
                </span>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-700 font-medium flex items-start space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="flex-1">{errorMessage}</span>
                  <button 
                    type="button" 
                    onClick={() => setErrorMessage(null)} 
                    className="text-rose-500 hover:text-rose-800 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              {/* Success Banner */}
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-800 font-semibold flex items-center space-x-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('auth.success_redirecting', 'Authentication successful! Redirecting to your workspace...')}</span>
                </motion.div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name field (Sign Up only) */}
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700" htmlFor="input-fullname">
                      {t('auth.full_name', 'Full Name')}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="input-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sophia Chen"
                        autoComplete="name"
                        autoCapitalize="words"
                        className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all min-h-[44px]"
                        required={mode === 'signup'}
                      />
                    </div>
                  </div>
                )}

                {/* Email Address field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700" htmlFor="input-email">
                    {t('auth.email', 'Email Address')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="host@example.com"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700" htmlFor="input-password">
                      {t('auth.password', 'Password')}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setResetSent(false);
                          setResetError(null);
                          setIsForgotPasswordOpen(true);
                        }}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer hover:underline"
                        id="btn-forgot-password"
                      >
                        {t('auth.forgot_password', 'Forgot password?')}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="input-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all min-h-[44px]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Sign Up only) */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">{t('auth.strength', 'Password Strength')}:</span>
                        <span className={`font-bold ${passwordStrength.textColor}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                          }`}
                          style={{ width: '33.3%' }}
                        />
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                          }`}
                          style={{ width: '33.3%' }}
                        />
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                          }`}
                          style={{ width: '33.3%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Login: Remember Me checkbox */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500 cursor-pointer"
                        id="checkbox-remember-me"
                      />
                      <span>{t('auth.remember_me', 'Remember me on this device')}</span>
                    </label>
                  </div>
                )}

                {/* Sign Up: Agree to Terms Checkbox */}
                {mode === 'signup' && (
                  <div className="pt-1">
                    <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500 cursor-pointer shrink-0"
                        id="checkbox-agree-terms"
                      />
                      <span className="leading-snug">
                        {t('auth.agree_terms_label', 'I agree to KAVA\'s')}{' '}
                        <a href="#terms" onClick={(e) => e.preventDefault()} className="text-teal-600 hover:underline font-semibold">
                          {t('auth.terms_service', 'Terms of Service')}
                        </a>{' '}
                        {t('auth.and', 'and')}{' '}
                        <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-teal-600 hover:underline font-semibold">
                          {t('auth.privacy_policy', 'Privacy Policy')}
                        </a>.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading || socialLoading !== null || isSuccess}
                  className="w-full mt-3 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B1A2C] hover:from-slate-900 hover:to-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 px-5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer min-h-[48px] disabled:opacity-50 active:scale-[0.99]"
                  id="btn-auth-submit"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === 'signup'
                          ? t('auth.btn_signup', 'Create Free Host Account & Continue')
                          : t('auth.btn_signin', 'Sign In to Workspace & Continue')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security & Privacy Guarantee Footnote */}
              <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{t('auth.encryption_badge', '256-bit SSL encrypted • Your memories are always private & never sold.')}</span>
              </div>
            </div>

            {/* Bottom Switching Navigation Link */}
            <div className="pt-5 mt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
              {mode === 'signup' ? (
                <p>
                  {t('auth.already_account_prompt', 'Already have a KAVA host account?')}{' '}
                  <Link to={loginLink} className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
                    {t('auth.tab_signin', 'Log In')}
                  </Link>
                </p>
              ) : (
                <p>
                  {t('auth.no_account_prompt', 'Don\'t have a KAVA account yet?')}{' '}
                  <Link to={signupLink} className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
                    {t('auth.create_account_link', 'Create Free Account')}
                  </Link>
                </p>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Forgot Password Modal Dialog */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100">
                <KeyRound className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('auth.reset_password_title', 'Reset your password')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('auth.reset_password_desc', 'Enter the email address associated with your KAVA host workspace and we will send you instructions to reset your password.')}
              </p>

              {resetSent ? (
                <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('auth.reset_link_sent', 'Reset instructions sent!')}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    We sent an email to <strong className="text-emerald-950">{resetEmail}</strong> with a secure link to update your password. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {t('auth.done_return', 'Done, return to login')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 my-6">
                  {resetError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700" htmlFor="reset-email">
                      {t('auth.email', 'Email Address')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="host@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      {t('common.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {resetLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{t('auth.send_reset_link', 'Send Link')}</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-[11px] text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} KAVA Memory Capsules Inc. • All rights reserved.
      </footer>
    </div>
  );
}

