// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  where,
  query,
  updateDoc,
  deleteField,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'

import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAGGPtRSqlXV7unws6r6UWqnUOr5zTtg3k',
  authDomain: 'buysellapp-ad7f2.firebaseapp.com',
  projectId: 'buysellapp-ad7f2',
  storageBucket: 'buysellapp-ad7f2.appspot.com',
  messagingSenderId: '282183687634',
  appId: '1:282183687634:web:720fae7412aa9f2fb03c0b'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {
  db,
  getStorage,
  sRef,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  onSnapshot,
  where,
  query,
  deleteField,
  updateDoc,
  deleteDoc,
  serverTimestamp
}
