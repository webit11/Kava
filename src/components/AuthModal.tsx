import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { HostUser, authenticateWithCredentials, authenticateWithGoogle } from '../lib/auth';
import { useTranslation } from '../lib/useTranslation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: HostUser, intendedAction?: string) => void;
  intendedAction?: 'create_capsule' | 'dashboard' | 'checkout' | 'general';
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  intendedAction = 'create_capsule',
  initialMode = 'signup'
}: AuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(t('auth.error_invalid_email', 'Please enter a valid email address.'));
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage(t('auth.error_missing_name', 'Please enter your name to set up your host workspace.'));
      return;
    }

    if (!password && mode === 'signin') {
      setErrorMessage(t('auth.error_missing_password', 'Please enter your password or sign in with Google.'));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const user = authenticateWithCredentials(email, password, fullName);
        setIsLoading(false);
        onClose();
        onSuccess(user, intendedAction);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err?.message || 'Authentication failed. Please try again.');
      }
    }, 400);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const user = authenticateWithGoogle();
      setIsLoading(false);
      onClose();
      onSuccess(user, intendedAction);
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative text-left"
        >
          {/* Top Banner / Close button */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-black font-mono text-sm tracking-tight">
                K
              </div>
              <span className="font-extrabold text-sm tracking-wide text-slate-900 font-mono uppercase">
                KAVA HOST AUTH
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close authentication modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Context Badge */}
            {intendedAction === 'create_capsule' && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start space-x-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-slate-900">
                    {t('auth.create_capsule_prompt', 'Authentication required to create capsule')}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {t('auth.create_capsule_desc', 'Capsules are linked directly to your host workspace account for memory security and live display ownership.')}
                  </p>
                </div>
              </div>
            )}

            {/* Header Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                {mode === 'signup'
                  ? t('auth.signup_title', 'Create your Host Account')
                  : t('auth.signin_title', 'Sign In to KAVA')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {mode === 'signup'
                  ? t('auth.signup_sub', 'Get instant access to memory capsules, guest QR stands, and live venue screens.')
                  : t('auth.signin_sub', 'Welcome back! Access your existing memory vaults and workspace settings.')}
              </p>
            </div>

            {/* Sign In vs Sign Up Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); }}
                className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
                  mode === 'signup'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('auth.tab_signup', 'Sign Up')}
              </button>
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); }}
                className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
                  mode === 'signin'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('auth.tab_signin', 'Log In')}
              </button>
            </div>

            {/* Google Authentication Option */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-bold text-xs py-3 rounded-2xl transition-all flex items-center justify-center space-x-2.5 shadow-2xs cursor-pointer min-h-[44px]"
            >
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
              <span>{t('auth.continue_google', 'Continue with Google')}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/70" />
              </div>
              <span className="relative bg-white px-3 text-[10px] font-mono uppercase font-bold text-slate-400">
                {t('auth.or_email', 'or continue with email')}
              </span>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Form inputs */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                    {t('auth.full_name', 'Full Name')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Sophia Chen"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                  {t('auth.email', 'Email Address')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="host@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                  {t('auth.password', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 hover:from-slate-900 hover:to-slate-800 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer min-h-[44px]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'signup'
                        ? t('auth.btn_signup', 'Create Host Account & Continue')
                        : t('auth.btn_signin', 'Sign In & Continue')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Trust Note */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero guest friction guaranteed</span>
              </span>
              <span>KAVA v2.4</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
