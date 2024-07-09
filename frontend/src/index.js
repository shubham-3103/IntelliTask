import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react'
import CreateTask from './pages/CreateTask';
import { useNavigate,BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from './pages/TaskList';

// Import your publishable key
// const PUBLISHABLE_KEY = "pk_test_cG9ldGljLWZvYWwtNjQuY2xlcmsuYWNjb3VudHMuZGV2JA"

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key")
// }

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const ClerkWithRoutes = () =>{
  const navigate = useNavigate()
  return(
    <ClerkProvider 
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
    >
    <Routes>
          <Route path='/' element={<TaskList />} />
          <Route path='/createtask' element={<CreateTask />} />
          <Route path='/alltask' element={<TaskList />} />
          <Route 
            path="/sign-in/*"
            element={<SignIn redirectUrl={'/'} routing="path" path="/sign-in"/>}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp redirectUrl={'/'} routing="path" path="/sign-up" />}
          />
        </Routes>
    </ClerkProvider>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkWithRoutes />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
