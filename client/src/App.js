import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import EditorPage from './components/EditorPage';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <>
      <div>
        <Toaster position='top-center'></Toaster>
      </div>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />

        <Route path='/editor/:roomId' element={<EditorPage />} />

      </Routes>
    </>
  );
}

export default App;
