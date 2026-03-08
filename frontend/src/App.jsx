import { use, useState } from 'react'
import  Signup from './Signup/Signup';
import { Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Navbar from './Navbar/Navbar';
import api from './api/axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import PostPage from './postPage/postPage';
import NewPost from './newPost/newPost';
import Dashboard from './Dashboard/Dashboard';
import DraftsPage from './draftsPage/draftsPage';

function App() {
  const [user, setUser] = useState(null);
  const [logout, setLogout] = useState(false);
   const navigate = useNavigate();
    const location = useLocation();
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);
  async function onLogout() {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      setLogout(true);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
  const hideNavbar =
    location.pathname === '/login' || location.pathname === '/signup';
    


  return (
    <>
      {!hideNavbar && <Navbar user={user} onLogout={onLogout} />}
      <Routes>
        <Route path="/signup" element={<Signup user={user} />} />
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/posts/:id" element={<PostPage user={user} />} />
        <Route path="/newpost" element={<NewPost user={user} />} />
        <Route path="/Dashboard" element={<Dashboard user={user} />} />
        <Route path="/drafts/:id" element={<DraftsPage user={user} />} />
       
      </Routes>
      
    </>
  )
}

export default App
