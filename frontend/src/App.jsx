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
import MyPosts from './myPosts/myPosts';
import OtherProfile from './otherProfile/otherProfile';
import EditedHistoryPage from './EditedHistoryPage/EditedHistoryPage';
import Notification from './notification/notification';


function App() {
  const [user, setUser] = useState(null);
  const [logout, setLogout] = useState(false);
    const [notifications, setNotifications] = useState([]);
   const navigate = useNavigate();
    const location = useLocation();

useEffect(() => {
    async function fetchNotifications() {
        try {
           const { data } = await api.get('/api/notifications');
           setNotifications(data);
        }
        catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    }
    fetchNotifications();
   }, []);


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
      {!hideNavbar && <Navbar user={user} onLogout={onLogout} notifications={notifications} />}
      <Routes>
        <Route path="/signup" element={<Signup user={user} />} />
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/posts/:id" element={<PostPage user={user} />} />
        <Route path="/newpost" element={<NewPost user={user} />} />
        <Route path="/Dashboard" element={<Dashboard user={user} />} />
        <Route path="/drafts/:id" element={<DraftsPage user={user} />} />
        <Route path="/myposts/:id" element={<MyPosts user={user} />} />
        <Route path="/profile/:id" element={<OtherProfile user={user} />} />
        <Route path="/posts/myposts/:id/history/:historyId" element={<EditedHistoryPage user={user} />} />
        <Route path="/notifications" element={<Notification user={user} />} />
       
      </Routes>
      
    </>
  )
}

export default App
