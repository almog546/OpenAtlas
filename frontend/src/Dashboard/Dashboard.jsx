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
    const [profile, setProfile] = useState(null);
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    

    useEffect(() => {
        async function fetchBookmarkedPosts() {
            try {
                const response = await api.get('/api/posts/bookmarks');
                setBookmarkedPosts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch bookmarked posts', err);
            }
        }
        fetchBookmarkedPosts();
    }, []);
    useEffect(() => {
    async function fetchProfile() {
        try {
            const response = await api.get('/api/profile');
            setProfile(response.data);
            setBio(response.data.bio || '');
            setAvatar(response.data.avatar || '');
        }
        catch (err) {
            console.error('Failed to fetch profile', err);
        }
    }
    fetchProfile();
}, []);
    

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
    async function createProfile() {
    try {
        const response = await api.post('/api/profile', { bio, avatar });
        setProfile(response.data);
        setBio(response.data.bio || '');
        setAvatar(response.data.avatar || '');
    }
    catch (err) {
        console.error('Failed to create profile', err);
    }
}

async function updateProfile() {
    try {
        const response = await api.put('/api/profile', { bio, avatar });
        setProfile(response.data);
        setBio(response.data.bio || '');
        setAvatar(response.data.avatar || '');
    }
    catch (err) {
        console.error('Failed to update profile', err);
    }
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
                             <li className={styles.dashboardItem} onClick={() => handleToggleMenu('SavedArticles')}>Saved Articles</li>
                              <li className={styles.dashboardItem} onClick={() => handleToggleMenu('FollowingAuthors')}>Following Authors</li>
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
       {toggleMenu === 'Profile' && (
    <div className={styles.content}>
        <h1>Profile</h1>

        {profile ? (
            <div>
                <img
                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.user.name}`}
                    alt="avatar"
                    className={styles.avatar}
                />

                <h3>{profile.user.name}</h3>
                <h2>Bio:</h2>
                <p>{profile.bio || 'No bio yet'}</p>
            </div>
        ) : (
            <p>No profile found. Create your profile to share more about yourself!</p>
        )}

        <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Paste avatar image URL..."
            className={styles.input}
        />

        <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio here..."
            className={styles.textarea}
        />

        {!profile ? (
            <button onClick={createProfile}>Create Profile</button>
        ) : (
            <button onClick={updateProfile}>Update Profile</button>
        )}
    </div>
)}
{toggleMenu === 'SavedArticles' && (
    <div className={styles.content}>
        <h1>Saved Articles</h1>
        {bookmarkedPosts.length === 0 ? (
            <p classname ={styles.para}>No saved articles found. Start exploring and bookmark your favorite articles!</p>
        ) : (
            <>
            {bookmarkedPosts.map(post => (
                <div key={post.id} className={styles.post} onClick={() => navigate(`/posts/${post.post.id}`)}>
                    <h3>{post.post.title}</h3>
                    <div className={styles.postDetails}>                     
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ))
            }
            </>
        )}
    </div>
)}
    </>
    )}
    </>);
} 