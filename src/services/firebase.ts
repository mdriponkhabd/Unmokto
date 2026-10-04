import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AdPlacement, SiteSettings } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID if specified
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test as required by Firebase skill
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Check network connection.');
    }
  }
}

// ---------------- CLOUD ADS PERSISTENCE ----------------

const ADS_DOC_REF = doc(db, 'settings', 'ads');
const SITE_DOC_REF = doc(db, 'settings', 'site');

/**
 * Fetch ads configuration from Firebase Cloud Firestore
 */
export async function fetchCloudAds(): Promise<Record<string, AdPlacement> | null> {
  try {
    const snap = await getDoc(ADS_DOC_REF);
    if (snap.exists()) {
      const data = snap.data();
      return (data.placements as Record<string, AdPlacement>) || null;
    }
  } catch (err) {
    console.warn('Could not fetch cloud ads from Firebase:', err);
  }
  return null;
}

/**
 * Save ads configuration to Firebase Cloud Firestore
 * This immediately syncs to all users worldwide in real time
 */
export async function saveCloudAds(ads: Record<string, AdPlacement>): Promise<boolean> {
  try {
    await setDoc(ADS_DOC_REF, {
      placements: ads,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to save ads to Firebase Cloud Firestore:', err);
    return false;
  }
}

/**
 * Subscribe to real-time ad changes from Firebase Cloud Firestore
 */
export function subscribeToCloudAds(
  onUpdate: (ads: Record<string, AdPlacement>) => void
): () => void {
  try {
    return onSnapshot(
      ADS_DOC_REF,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.placements) {
            onUpdate(data.placements as Record<string, AdPlacement>);
          }
        }
      },
      (error) => {
        console.warn('Real-time ads subscription listener warning:', error);
      }
    );
  } catch {
    return () => {};
  }
}

// ---------------- CLOUD SITE SETTINGS PERSISTENCE ----------------

/**
 * Fetch site settings (branding, logo, favicon) from Firebase Cloud Firestore
 */
export async function fetchCloudSettings(): Promise<Partial<SiteSettings> | null> {
  try {
    const snap = await getDoc(SITE_DOC_REF);
    if (snap.exists()) {
      const data = snap.data();
      return data as Partial<SiteSettings>;
    }
  } catch (err) {
    console.warn('Could not fetch cloud settings from Firebase:', err);
  }
  return null;
}

/**
 * Save site settings to Firebase Cloud Firestore
 * Instantly synchronizes company name, logo, and favicon across all visitors
 */
export async function saveCloudSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    await setDoc(SITE_DOC_REF, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to save settings to Firebase Cloud Firestore:', err);
    return false;
  }
}

/**
 * Subscribe to real-time site settings changes from Firebase Cloud Firestore
 */
export function subscribeToCloudSettings(
  onUpdate: (settings: Partial<SiteSettings>) => void
): () => void {
  try {
    return onSnapshot(
      SITE_DOC_REF,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data) {
            onUpdate(data as Partial<SiteSettings>);
          }
        }
      },
      (error) => {
        console.warn('Real-time settings subscription listener warning:', error);
      }
    );
  } catch {
    return () => {};
  }
}
