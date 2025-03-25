// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJ-pMtfXRuX8lqebbqB0FkOl2eYmdsYlQ",
  authDomain: "appfirebaseauth-e60c1.firebaseapp.com",
  databaseURL: "https://appfirebaseauth-e60c1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "appfirebaseauth-e60c1",
  storageBucket: "appfirebaseauth-e60c1.appspot.com",
  messagingSenderId: "469377124112",
  appId: "1:469377124112:web:08a218f17ef8bbce070795",
  measurementId: "G-0BSX41ZCL9",
};

const app = initializeApp(firebaseConfig);

// Khởi tạo Realtime Database
const database = getDatabase(app);

//Khởi tạo Authentication
const auth = getAuth(app);

//Khoi tao firestore
const db = getFirestore(app);


// Export đối tượng database
export { database, auth, db };