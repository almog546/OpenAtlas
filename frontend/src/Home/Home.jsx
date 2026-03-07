import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [postorder, setPostorder] = useState('');


    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get('/api/posts');
                setPosts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch posts', err);
            }
        }
        fetchPosts();
    }, []);
   function handlePostClick(id) {
        window.location.href = `/posts/${id}`;
    }
    function sortPostsnew() {
        setPostorder('newest');
        setPosts([...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    function sortPostsold() {
        setPostorder('oldest');
        setPosts([...posts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    }
    return (
        <div className={styles.container}>
            <h1>Welcome to OpenAtlas!</h1>
            <div className={styles.sortOptions}>
                <button onClick={() => sortPostsnew()} className={styles.new}>Newest</button>
                <button onClick={() => sortPostsold()} className={styles.old}>Oldest</button>
            </div>
            <div className={styles.posts}>
                {posts.map(post => (
                    <div key={post.id} className={styles.post} onClick={() => handlePostClick(post.id)}>
                        <h3>{post.title}</h3>
                        <div className={styles.postDetails}>
                            <span>{post.author.name}</span>
                             <span>·</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}