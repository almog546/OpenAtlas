import { useState } from 'react'
import  Signup from './Signup/Signup';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
      
    </>
  )
}

export default App
