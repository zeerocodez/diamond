import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { authService, DEMO_USERS, GOOGLE_CLIENT_ID } from '../services/auth';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Initialize Google Identity Services (GIS) button if available
  useEffect(() => {
    if (!isOpen) return;
    let timer: any;
    const initGsi = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              if (response.credential) {
                const user = authService.loginWithGoogleCredential(response.credential);
                if (user) {
                  onSuccess(user);
                  onClose();
                }
              }
            },
          });

          const btnContainer = document.getElementById('gsi-official-button');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: 380,
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google Identity Services render note:', e);
        }
      }
    };

    timer = setTimeout(initGsi, 200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignInPopup = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { user } = await authService.signInWithGooglePopup();
      setIsLoading(false);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google Sign-In popup was closed. Please try again or select an executive patron profile below.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Browser popup was blocked. Please allow popups for this site or use the executive patron profiles.');
      } else {
        setErrorMsg(err.message || 'Unable to complete Google Sign-In.');
      }
    }
  };

  const handleSelectDemoUser = (user: User) => {
    authService.loginAsDemoUser(user);
    onSuccess(user);
    onClose();
  };

  const handleGoogleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const user = authService.loginWithCustomEmail(customEmail, customName || 'Executive Patron');
    onSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-lg rounded-sm border border-[#E7E2D5] shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
            Serena Diamond Bespoke &bull; Atelier Portal
          </div>
          <h3 className="font-serif text-2xl text-stone-900 font-medium">
            Executive Authentication
          </h3>
          <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
            Sign in with your Google account to access private bespoke fittings, order records, and white-glove concierge checkout in Lagos.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Official Google Identity Services Container */}
        <div className="space-y-3 mb-6">
          <div id="gsi-official-button" className="flex justify-center min-h-[44px]" />

          {/* Primary Direct Google Sign-In Button */}
          <button
            onClick={handleGoogleSignInPopup}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white border border-stone-300 hover:border-stone-500 rounded-xs flex items-center justify-center gap-3 transition-colors shadow-2xs group cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#064E3B]" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span className="text-xs font-semibold text-stone-800 tracking-wide group-hover:text-stone-900">
              {isLoading ? 'Connecting with Google...' : 'Sign In with Google Popup'}
            </span>
          </button>
        </div>

        {/* Executive Patron Profiles */}
        <div className="pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
            <span>Or Quick Access as Executive Patron</span>
            <span className="text-[10px] text-[#C5A059] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Instant Access</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectDemoUser(user)}
                className="w-full p-3 bg-white border border-[#E7E2D5] hover:border-[#064E3B] rounded-xs flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C5A059] bg-stone-100 shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 group-hover:text-[#064E3B]">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-stone-500">{user.title}</div>
                    <div className="text-[10px] text-stone-400">{user.organization}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#064E3B] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Login Drawer */}
        <div className="mt-4 pt-3 border-t border-stone-200">
          {!isCustomMode ? (
            <button
              onClick={() => setIsCustomMode(true)}
              className="text-center w-full text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Sign in with custom executive email &rarr;
            </button>
          ) : (
            <form onSubmit={handleGoogleCustomLogin} className="space-y-3 pt-2">
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#064E3B]"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Executive Google Email Address"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#064E3B]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B]"
              >
                Sign In to Atelier Portal
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
