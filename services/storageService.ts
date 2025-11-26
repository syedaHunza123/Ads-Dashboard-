import { Ad, User } from '../types';

const STORAGE_KEYS = {
  USER: 'adgenius_user',
  ADS: 'adgenius_ads',
};

// --- Auth Mock ---
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (email.includes('@') && password.length >= 6) {
    const user: User = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }
  throw new Error("Invalid credentials (mock: use any email & password > 6 chars)");
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const user: User = {
    id: 'u_' + Date.now(),
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = (): User | null => {
  const u = localStorage.getItem(STORAGE_KEYS.USER);
  return u ? JSON.parse(u) : null;
};

// --- Ads CRUD ---
export const getAds = (): Ad[] => {
  const ads = localStorage.getItem(STORAGE_KEYS.ADS);
  return ads ? JSON.parse(ads) : [];
};

export const createAd = (adData: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>): Ad => {
  const ads = getAds();
  const newAd: Ad = {
    ...adData,
    id: 'ad_' + Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  ads.unshift(newAd);
  localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  return newAd;
};

export const updateAd = (id: string, updates: Partial<Ad>): Ad => {
  const ads = getAds();
  const index = ads.findIndex(a => a.id === id);
  if (index === -1) throw new Error("Ad not found");
  
  const updatedAd = { ...ads[index], ...updates, updatedAt: Date.now() };
  ads[index] = updatedAd;
  localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  return updatedAd;
};

export const deleteAd = (id: string): void => {
  const ads = getAds();
  const newAds = ads.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(newAds));
};