import styles from './PostPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function PostPage({ user }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);


    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await api.get(`/api/comment/post/${id}`);
                setComments(response.data);
            }
            catch (err) {
                console.error('Failed to fetch comments', err);
            }
        }
        fetchComments();
    }, [id]);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
            }
            catch (err) {
                console.error('Failed to fetch post', err);
            }
        }
        fetchPost();
    }, [id]);

    if (!post) {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
        </div>
    );
}
function handleAuthorClick(id) {
    navigate(`/profile/${id}`);
}
    return (
        <>
         
            <> 
        <div className={styles.container}>
            <h1>{post.title}</h1>
            <div className={styles.postDetails}>
                <span className={styles.author} onClick={() => handleAuthorClick(post.author.id)}>{post.author.name}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{post.views} views</span>
                <span>·</span>
                <span className={styles.category}>{post.category}</span>
            </div>
            <p>{post.content}</p>
            <div className={styles.comments}>
                <h2>Comments</h2>
            </div>
        </div>
        </>
    </>);
}

