import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOxTcEsGV8bewkPjQWJ22LDI6CvEDp4LY",
  authDomain: "gate-cs-tracker.firebaseapp.com",
  projectId: "gate-cs-tracker",
  storageBucket: "gate-cs-tracker.firebasestorage.app",
  messagingSenderId: "759773391344",
  appId: "1:759773391344:web:8069919a835df7141e9535",
  databaseURL:"https://gate-cs-tracker-default-rtdb.firebaseio.com/"
};

export const app= initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);