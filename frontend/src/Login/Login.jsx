import styles from './Login.module.css';
import { useState } from 'react';
import api from '../api/axios';
import { Navigate, useNavigate } from 'react-router-dom';



export default function Login( { user }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
   
    

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/api/auth/login', { username, password });
            setSuccess(true);
            setError(false);
            navigate('/');
        }
        catch (err) {
            setError('Login failed');
            setSuccess(false);
        }
    }
  
    return (
        <>
        {!user ? (
           
        <div className={styles.container} >
            <h1>Login</h1>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>Login successful!</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    className={styles.input}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
        ) : (
            <Navigate to="/" replace />
        )}
        

   </> );
}
    