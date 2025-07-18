import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBSbrbKNZz4JlcQETzGvTAsUczoYj_70Wg",
  authDomain: "pancharatna-128de.firebaseapp.com",
  projectId: "pancharatna-128de",
  storageBucket: "pancharatna-128de.appspot.com",
  messagingSenderId: "186773935035",
  appId: "1:186773935035:web:5360c46fe412f582406a9e",
  measurementId: "G-EPYXVYVQTM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); 