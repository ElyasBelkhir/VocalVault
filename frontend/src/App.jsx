import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp.jsx';
import SignIn from "./SignIn.jsx";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPFPRCkDm0lbeLQOvym-bp0K9pI8JJI5Y",
  authDomain: "aim-project-cd9e0.firebaseapp.com",
  projectId: "aim-project-cd9e0",
  storageBucket: "aim-project-cd9e0.appspot.com",
  messagingSenderId: "644788453808",
  appId: "1:644788453808:web:e35c4695086b51bc6e5675",
  measurementId: "G-ECBERP0P8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn/>}>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App
