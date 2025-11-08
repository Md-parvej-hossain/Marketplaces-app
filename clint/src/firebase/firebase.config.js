import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCwfuHe13fcmyBxfHKIQ92byfDaRluSnhc',
  authDomain: 'marketplace-251ad.firebaseapp.com',
  projectId: 'marketplace-251ad',
  storageBucket: 'marketplace-251ad.firebasestorage.app',
  messagingSenderId: '523312170043',
  appId: '1:523312170043:web:2be3cc801afb7578ac481e',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
