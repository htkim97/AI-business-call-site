import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBOPjMJA-89KYisLlWIlrq2XLhUpbJQaI0",
  authDomain: "my-react-572b7.firebaseapp.com",
  projectId: "my-react-572b7",
  storageBucket: "my-react-572b7.appspot.com",
  messagingSenderId: "49957160168",
  appId: "1:49957160168:web:564787ab7a86e3234a755d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
