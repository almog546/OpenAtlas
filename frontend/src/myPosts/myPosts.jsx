import styles from './myPosts.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function MyPosts({ user }) {
    const [posts, setPosts] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get(`/api/posts/myposts/${id}`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        fetchPosts();
    }, [id]);
    if (!posts) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }
    async function handleDelete() {
        try {
            await api.delete(`/api/posts/myposts/${id}`);
            setPosts(null);
            navigate('/Dashboard');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

return (
    <>
    {!user ? (
        <Navigate to="/login" replace />
    ) : (
        <div className={styles.container}>
            <div className={styles.actions}>
                <h1>{posts.title}</h1>
                <button onClick={handleDelete}>Delete</button>
            </div>         
                    <div className={styles.postDetails}>
                        <span className={styles.author}>{posts.author.name}</span>
                        <span>·</span>
                        <span>{new Date(posts.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{posts.views} views</span>
                        <span>·</span>
                        <span className={styles.category}>{posts.category}</span>
                    </div>
                    <p>{posts.content}</p>
                </div>
    )}
    </>
);
}

             