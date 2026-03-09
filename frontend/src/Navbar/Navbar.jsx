import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { UserCircle } from 'lucide-react';
import { useState } from 'react';


export default function Navbar({ user, onLogout }) {
    const [toggleMenu, setToggleMenu] = useState(false);
    
   
     
    function handleToggleMenu() {
        setToggleMenu(!toggleMenu);
    }
    return (
        <nav className={styles.navbar}>
            <Link to="/home" className={styles.logo}>OpenAtlas</Link>

            {!user ? (
                <div className={styles.authLinks}>
                    <Link to="/login" className={styles.link}>Login</Link>
                    <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
                </div>
            ) : (<>
                <span className={styles.userName} onClick={handleToggleMenu}> <UserCircle size={30} strokeWidth={1.5} color="var(--primary)" /></span>
               

                    {toggleMenu && ( 
                <div className={styles.userInfo}>
                    <Link to="/newpost" className={styles.newpost}>Write Article</Link>
                    <Link to="/Dashboard" className={styles.profile}>
                        Dashboard         
                    </Link>
                    <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
                </div>
                )}
           </> )}
        </nav>
    );
}