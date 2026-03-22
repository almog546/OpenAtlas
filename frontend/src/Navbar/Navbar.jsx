import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { UserCircle } from 'lucide-react';
import { useState } from 'react';
import { IoIosNotifications } from "react-icons/io";


export default function Navbar({ user, onLogout, notifications }) {
    const [toggleMenu, setToggleMenu] = useState(false);
 
    
   
     
    function handleToggleMenu() {
        setToggleMenu(!toggleMenu);
    }
   
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo}>OpenAtlas</Link>
           

            {!user ? (
                <div className={styles.authLinks}>
                    <Link to="/login" className={styles.link}>Login</Link>
                    <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
                </div>
            ) : (<>
            <div className={styles.userSection}>
                <span className={styles.userName} onClick={handleToggleMenu}> <UserCircle size={30} strokeWidth={1.5} color="var(--primary)" /></span>
                {notifications.length > 0 && notifications.some(n => !n.isRead) ? (
                    <Link to="/notifications" className={styles.notifications}>
                        <IoIosNotifications size={30} color='black' />
                        <span className={styles.notificationCount}>{notifications.filter(n => !n.isRead).length}</span>
                    </Link>
                ) : 
                <Link to="/notifications" className={styles.notifications}><IoIosNotifications size={30} color='black' /></Link>
                }
                 
               </div>

                    {toggleMenu && ( 
                <div className={styles.userInfo}>
                    {user.role === 'ADMIN' ? (
                        <>
                            <Link to="/Dashboard" className={styles.profile}>Dashboard</Link>
                            <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/newpost" className={styles.newpost}>Write Article</Link>
                            <Link to="/Dashboard" className={styles.profile}>Dashboard</Link>
                            <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
                        </>
                    )}
                </div>
                )}
           </> )}
        </nav>
    );
}