import styles from './Dashboard.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import { useEffect } from 'react';

export default function Dashboard({ user }) {
    const [toggleMenu, setToggleMenu] = useState('MyArticles');
    const [content, setContent] = useState([]);
    const [drafts, setDrafts] = useState([]);  

    useEffect(() => {
        async function fetchDrafts() {
            try {
                const response = await api.get('/api/drafts');
                setDrafts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch drafts', err);
            }
        }
        fetchDrafts();
    }, []);
   useEffect(() => {
        async function fetchContent() {
            if (!user?.id) return;
            try {
                const response = await api.get('/api/posts');
                setContent(response.data.filter((post) => post.authorId === user.id));
            }
            catch (err) {
                console.error('Failed to fetch content', err);
            }
        }
        fetchContent();
    }, [user?.id]);
        
    const navigate = useNavigate();
        function handleToggleMenu(menu) {
        setToggleMenu(menu);
    }

    return (<>
    {!user ? (
        <Navigate to="/login" replace />
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
        {toggleMenu === 'MyArticles' && 
        <div className={styles.content}>
            {content.length === 0 ? (
                <p>No articles found. Start writing your first article!</p>
            ) : (
                <>
                {content.map(post => (
                    <div key={post.id} className={styles.post} onClick={() => navigate(`/posts/${post.id}`)}>
                        <h3>{post.title}</h3>
                        <div className={styles.postDetails}>
                            <span>·</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))
                }
                </>
            )}
        </div>}


        {toggleMenu === 'Drafts' && <div className={styles.content}>Drafts Content</div>}
        {toggleMenu === 'Profile' && <div className={styles.content}>Profile Content</div>}
        </>

    )}
    </>);
} 