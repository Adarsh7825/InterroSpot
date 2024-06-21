import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import './App.css';
import Navbar from './components/common/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Error from './pages/Error';
import MyProfile from './components/core/Dashboard/MyProfile';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Settings from './components/core/Dashboard/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from './utils/constants';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateInteviewByRecruiter from './components/core/Dashboard/RecruiterDashboard/CreateInteviewByRecruiter';
import DataContextProvider from './context/DataContext';
import RoomData from './components/core/Room/RoomData';
import Room from './pages/Room';
import CreateQuestionForm from './components/core/Question/CreateQuestionForm';

function App() {
  const { user } = useSelector((state) => state.profile);
  console.log(user);
  return (
    <DataContextProvider>
      <Router>
        <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
          <Navbar />
          <ToastContainer autoClose={2000} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path='verify-email' element={<VerifyEmail />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/dashboard/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
            <Route element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            {
              user?.accountType === ACCOUNT_TYPE.RECRUITER && (
                <>
                  <Route path="dashboard/form" element={<CreateInteviewByRecruiter />} />
                </>
              )
            }
            {
              user?.accountType === ACCOUNT_TYPE.ADMIN && (
                <>
                  <Route path="dashboard/create-question" element={<CreateQuestionForm />} />
                </>
              )
            }
            <Route path="dashboard/Settings" element={<Settings />} />
            <Route path="/roomdata/:roomId" element={<RoomData />} />
            <Route path='/room/:roomId' element={<Room />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </div>
      </Router>
    </DataContextProvider>
  );
}

export default App;