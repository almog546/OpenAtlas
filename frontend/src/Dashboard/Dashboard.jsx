import styles from './Dashboard.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { use, useState } from 'react';
import api from '../api/axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            try {
                const response = await api.get('/api/posts/myposts');
                setContent(response.data);
            }
            catch (err) {
                console.error('Failed to fetch content', err);
            }
        }
        fetchContent();
    }, []);
        
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
                            <Link to="/newpost" className={styles.dashboardItem}>Write Article</Link>
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
                    <div key={post.id} className={styles.post} onClick={() => navigate(`/myposts/${post.id}`)}>
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


        {toggleMenu === 'Drafts' && <div className={styles.content}>
            {drafts.length === 0 ? (
                <p>No drafts found. Start writing your first draft!</p>
            ) : (
                <>
                {drafts.map(draft => (
                    <div key={draft.id} className={styles.post} onClick={() => navigate(`/drafts/${draft.id}`)}>
                        <h3>{draft.title}</h3>
                        <div className={styles.postDetails}>
                            <span>·</span>
                            <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))
                }
                </>
            )}
        </div>}
        {toggleMenu === 'Profile' && <div className={styles.content}>Profile Content</div>}
        </>

    )}
    </>);
} 