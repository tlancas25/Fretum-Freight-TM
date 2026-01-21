/**
 * Firestore Client Configuration - Fretum-Freight TMS
 * 
 * This module initializes the Firestore client SDK for database operations.
 * All data is tenant-scoped for multi-tenancy support.
 * 
 * Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.
 */

import { 
  getFirestore, 
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseApp, isFirebaseConfigured } from './config';

let db: Firestore;

/**
 * Get Firestore instance
 */
export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

/**
 * Check if Firestore is available
 */
export function isFirestoreConfigured(): boolean {
  return isFirebaseConfigured();
}

// Re-export Firestore utilities for convenience
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
};
