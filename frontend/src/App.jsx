import { useState } from 'react'
import  Signup from './Signup/Signup';
import { Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      
    </>
  )
}

export default App
