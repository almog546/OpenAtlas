import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';


export default function Navbar({ user, onLogout }) {
    return (<>
    {user ? (
        <nav className={styles.navbar}>
            <div className={styles.logo}>OpenAtlas</div>
            <div className={styles.userInfo}>
               <Link to="/home" className={styles.link}>Home</Link>
                <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
            </div>
        </nav>
    ) : 
    (
        <nav className={styles.navbar} >
            <div className={styles.logo}>OpenAtlas</div>
            <div className={styles.userInfo}>
                <Link to="/login" className={styles.link}>Login</Link>
                <Link to="/signup" className={styles.link}>Sign Up</Link>
            </div>
        </nav>
    )}
   
    </>);
}