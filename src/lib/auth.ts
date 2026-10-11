export interface HostUser {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  emailVerified?: boolean;
  username?: string;
  phone?: string;
  country?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  twoFactorEnabled?: boolean;
  role?: string;
  avatar?: string;
  status?: 'Active' | 'Suspended';
  plan?: 'Free' | 'Starter' | 'Premium' | 'Enterprise';
  createdAt?: string;
  connectedAccounts?: { google?: boolean; apple?: boolean };
  notifications?: { email?: boolean; push?: boolean; sms?: boolean; marketing?: boolean };
  sessions?: any[];
}

export const DEFAULT_HOST_USER: HostUser = {
  id: 'usr-default',
  name: 'Artha Wibawa',
  displayName: 'Artha',
  email: 'arthawibawa777@gmail.com',
  emailVerified: true,
  username: 'arthawibawa',
  phone: '+1 (555) 019-2834',
  country: 'United States',
  language: 'English (United States)',
  timezone: 'UTC -07:00 (Pacific Standard Time)',
  dateFormat: 'MM/DD/YYYY (12-hour)',
  twoFactorEnabled: false,
  role: 'Workspace Owner',
  avatar: '',
  status: 'Active',
  plan: 'Premium',
  createdAt: new Date().toISOString(),
  connectedAccounts: { google: true, apple: false },
  notifications: { email: true, push: true, sms: false, marketing: false },
  sessions: [
    { id: 'sess-1', device: 'Chrome on macOS (MacBook Pro)', ip: '192.168.1.45', lastActive: 'Active now', current: true },
    { id: 'sess-2', device: 'Safari on iPhone 15 Pro', ip: '172.56.21.9', lastActive: '2 hours ago', current: false }
  ]
};

export const getActiveUser = (): HostUser | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('kava_active_user');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && parsed.email) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse kava_active_user', e);
  }
  return null;
};

export const setActiveUser = (user: HostUser | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('kava_active_user', JSON.stringify(user));
    try {
      const savedUsersStr = localStorage.getItem('kava_admin_users');
      const savedUsers: HostUser[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      const idx = savedUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx >= 0) {
        savedUsers[idx] = { ...savedUsers[idx], ...user };
      } else {
        savedUsers.push(user);
      }
      localStorage.setItem('kava_admin_users', JSON.stringify(savedUsers));
    } catch (e) {
      console.error('Failed to sync to kava_admin_users', e);
    }
  } else {
    localStorage.removeItem('kava_active_user');
  }
  window.dispatchEvent(new CustomEvent('kava_active_user_updated', { detail: user }));
};

export const logoutUser = (): void => {
  setActiveUser(null);
};

export const authenticateWithCredentials = (
  email: string,
  password?: string,
  name?: string
): HostUser => {
  const cleanEmail = email.trim().toLowerCase();
  const savedUsersStr = localStorage.getItem('kava_admin_users');
  const savedUsers: HostUser[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
  
  let existing = savedUsers.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    const updated = {
      ...DEFAULT_HOST_USER,
      ...existing,
      status: existing.status || 'Active'
    };
    setActiveUser(updated);
    return updated;
  }

  // Create new user profile
  const resolvedName = name?.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Host User';
  const newUser: HostUser = {
    ...DEFAULT_HOST_USER,
    id: `usr-${Date.now()}`,
    name: resolvedName,
    displayName: resolvedName.split(' ')[0],
    email: cleanEmail,
    username: cleanEmail.split('@')[0],
    createdAt: new Date().toISOString(),
    plan: 'Starter'
  };

  setActiveUser(newUser);
  return newUser;
};

export const authenticateWithGoogle = (): HostUser => {
  // Simulates Google OAuth login
  const sampleGoogleUsers: HostUser[] = [
    {
      ...DEFAULT_HOST_USER,
      id: 'usr-google-1',
      name: 'Artha Wibawa',
      displayName: 'Artha',
      email: 'arthawibawa777@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      connectedAccounts: { google: true, apple: false }
    }
  ];
  const user = sampleGoogleUsers[0];
  setActiveUser(user);
  return user;
};

export const authenticateWithApple = (): HostUser => {
  // Simulates Apple OAuth login
  const sampleAppleUser: HostUser = {
    ...DEFAULT_HOST_USER,
    id: 'usr-apple-1',
    name: 'Sophia Chen',
    displayName: 'Sophia',
    email: 'sophia.chen@privaterelay.appleid.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    connectedAccounts: { google: false, apple: true }
  };
  setActiveUser(sampleAppleUser);
  return sampleAppleUser;
};

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return true;
};
