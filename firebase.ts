import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBU0yfIljd-k2ndKTqDe8f_7ZEwSbiX51M",
  authDomain: "spotify-390512.firebaseapp.com",
  projectId: "spotify-390512",
  storageBucket: "spotify-390512.appspot.com",
  messagingSenderId: "708920087221",
  appId: "1:708920087221:web:b6921d4a43ed5fa97f64fc"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export { db, storage }
