import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { User } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const GOOGLE_CLIENT_ID = '521594802294-v8da4qqdv3cv8o16i9dlj328d6emt8i3.apps.googleusercontent.com';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT credential', e);
    return null;
  }
}

// Configure Google Auth Provider with Scopes
export const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
];

const googleProvider = new GoogleAuthProvider();
SCOPES.forEach((scope) => googleProvider.addScope(scope));
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const STORAGE_KEY = 'sdb_auth_user';

// In-memory token cache (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const DEMO_USERS: User[] = [
  {
    id: 'usr_emmanuel_effiong',
    name: 'Emmanuel Effiong',
    email: 'zeerocodes@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    role: 'Authorized Patron & Developer',
    title: 'Lead Technology Architect',
    organization: 'Mailgun Verified Sandbox Recipient',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'usr_folashade_adeleke',
    name: 'Dr. Folashade Adeleke',
    email: 'folashade.adeleke@lagoscapital.ng',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    role: 'Executive Member',
    title: 'Senior Managing Partner',
    organization: 'Lagos Capital & Advisory, Ikoyi',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'usr_zainab_balogun',
    name: 'Chief (Mrs.) Zainab Balogun',
    email: 'zainab.balogun@ekoventures.com',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=256',
    role: 'VIP Patron',
    title: 'Non-Executive Director & Founder',
    organization: 'Eko Ventures, Victoria Island',
    createdAt: '2024-03-22T14:30:00Z',
  },
  {
    id: 'usr_chioma_nwosu',
    name: 'Chioma Nwosu, CFA',
    email: 'chioma.nwosu@marinawealth.ng',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
    role: 'Bespoke Private Client',
    title: 'Chief Investment Officer',
    organization: 'Marina Private Wealth, Banana Island',
    createdAt: '2024-05-10T11:15:00Z',
  },
];

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.init();
    this.setupFirebaseListener();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Default to Dr. Folashade Adeleke for smooth initial preview experience
        this.currentUser = DEMO_USERS[0];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      }
    } catch {
      this.currentUser = DEMO_USERS[0];
    }
  }

  private setupFirebaseListener() {
    onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const mappedUser: User = {
          id: fbUser.uid,
          email: fbUser.email || 'user@serenadiamondbespoke.com',
          name: fbUser.displayName || 'Executive Patron',
          avatar: fbUser.photoURL || undefined,
          role: 'Executive Patron',
          title: 'Managing Director / Corporate Leader',
          organization: 'Lagos Atelier Member',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        };
        this.currentUser = mappedUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
        this.notify();
      } else {
        cachedAccessToken = null;
        if (!isSigningIn && !this.isDemoUserActive()) {
          // If not demo user, clear
        }
      }
    });
  }

  private isDemoUserActive(): boolean {
    if (!this.currentUser) return false;
    return DEMO_USERS.some((d) => d.id === this.currentUser?.id);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getCachedAccessToken(): string | null {
    return cachedAccessToken;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  /**
   * Google Identity Services Credential Handler (One Tap or GSI button)
   */
  public loginWithGoogleCredential(credentialToken: string): User | null {
    const payload = parseJwt(credentialToken);
    if (!payload || !payload.email) return null;

    const mappedUser: User = {
      id: payload.sub || `usr_google_${Date.now()}`,
      email: payload.email,
      name: payload.name || 'Executive Patron',
      avatar: payload.picture || undefined,
      role: 'Verified Google Patron',
      title: 'Executive Client',
      organization: 'Lagos Atelier Member',
      createdAt: new Date().toISOString(),
    };

    this.currentUser = mappedUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
    this.notify();
    return mappedUser;
  }

  /**
   * Real Google Sign-In with Firebase Auth popup
   */
  public async signInWithGooglePopup(): Promise<{ user: User; accessToken: string }> {
    isSigningIn = true;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
      }

      const fbUser = result.user;
      const mappedUser: User = {
        id: fbUser.uid,
        email: fbUser.email || 'executive@serenadiamondbespoke.com',
        name: fbUser.displayName || 'Executive Patron',
        avatar: fbUser.photoURL || undefined,
        role: 'Verified Google Patron',
        title: 'Executive Client',
        organization: 'Lagos, Nigeria',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };

      this.currentUser = mappedUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
      this.notify();
      return { user: mappedUser, accessToken: cachedAccessToken || '' };
    } catch (error: any) {
      console.warn('Google Popup sign-in error or cancelled:', error);
      throw error;
    } finally {
      isSigningIn = false;
    }
  }

  /**
   * Manual or custom email Google fallback
   */
  public loginWithCustomEmail(email: string, name: string): User {
    const newUser: User = {
      id: `usr_custom_${Date.now()}`,
      email,
      name: name || 'Executive Patron',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      role: 'Registered Patron',
      title: 'Corporate Leader',
      organization: 'Lagos, Nigeria',
      createdAt: new Date().toISOString(),
    };
    this.currentUser = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    this.notify();
    return newUser;
  }

  public loginAsDemoUser(demoUser: User): void {
    this.currentUser = demoUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    this.notify();
  }

  public async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase sign-out note:', e);
    }
    cachedAccessToken = null;
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    this.notify();
  }
}

export const authService = new AuthService();
