/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../firebase-applet-config.json';

// Configuration object with fallbacks to firebase-applet-config.json for absolute out-of-the-box reliability in sandboxed preview
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use the custom database ID if specified in env, or fall back to local provisioned DB ID if custom project ID is not active.
// Otherwise, call getFirestore(app) to default to standard multi-tenant production DB.
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || (!import.meta.env.VITE_FIREBASE_PROJECT_ID ? firebaseConfigJson.firestoreDatabaseId : undefined);

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export default app;
