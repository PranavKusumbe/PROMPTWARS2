import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCt8qmBgCagofYjzRp0D88wmxLjv0pwCqg",
  authDomain: "promptwars2-bb16b.firebaseapp.com",
  projectId: "promptwars2-bb16b",
  storageBucket: "promptwars2-bb16b.firebasestorage.app",
  messagingSenderId: "224852188719",
  appId: "1:224852188719:web:5763dfcc5399cfe08f30da",
  measurementId: "G-5KC7V4FY2H"
};

const app = initializeApp(firebaseConfig);
let analytics;
let messaging;

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    messaging = getMessaging(app);
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { messaging, analytics };

export default app;
