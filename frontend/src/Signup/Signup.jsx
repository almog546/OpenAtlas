import styles from './Signup.module.css';
import { useState } from 'react';
import api from '../api/axios';
import * as yup from "yup"
import { useNavigate } from 'react-router-dom';


export default function Signup( { user }) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const signupSchema = yup.object({
        username: yup
            .string()
            .min(3, 'Username must be at least 3 characters')
            .required('Username is required'),
        name: yup
            .string()
            .min(2, 'Name must be at least 3 characters')
            .required('Name is required'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await signupSchema.validate({ username, name, password });
            await api.post('/api/auth/signup', { username, name, password });
            setSuccess(true);
            setError(false);
            navigate('/login');
        } catch (err) {
            setError(err.message);
            setSuccess(false);
        }
    }

    return (<>
            {!user ? (

        <div className={styles.container}>
            <h1>Sign Up</h1>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>Signup successful!</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name'
                        className={styles.input}
                    />
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
                        placeholder="Password"
                        className={styles.input}
                    />
    
                <button type="submit" className={styles.button}>Sign Up</button>
            </form>
        </div>
        ) : (
            navigate('/home')
        )}
   </> );
}
