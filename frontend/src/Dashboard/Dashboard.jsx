import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard({ user }) {
    const [toggleMenu, setToggleMenu] = useState('MyArticles');
    const navigate = useNavigate();
        function handleToggleMenu(menu) {
        setToggleMenu(menu);
    }

    return (<>
    {!user ? (
        navigate('/login')
    ) : (
        <>
        <div className={styles.container}>
              <h2>Dashboard</h2>
                        <ul className={styles.dashboard}>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('MyArticles')}> My Articles </li>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Drafts')}> Drafts </li>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Profile')}>Profile</li>
                            </ul>
            
        </div>
        {toggleMenu === 'MyArticles' && <div className={styles.content}>My Articles Content</div>}
        {toggleMenu === 'Drafts' && <div className={styles.content}>Drafts Content</div>}
        {toggleMenu === 'Profile' && <div className={styles.content}>Profile Content</div>}
        </>

    )}
    </>);
} 