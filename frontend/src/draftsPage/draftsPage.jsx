import styles from './draftsPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';



export default function DraftsPage( { user }) {
 const { id } = useParams();
    const [draft, setdraft] = useState(null);

    useEffect(() => {
        async function fetchDraft() {
            try {
                const response = await api.get(`/api/drafts/${id}`);
                setdraft(response.data);
            }
            catch (err) {
                console.error('Failed to fetch draft', err);
            }
        }
        fetchDraft();
    }, [id]);

    if (!draft) {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
        </div>
    );
}

    return (<>
     {!user ? (
                <Navigate to="/login" replace />
            ) : (
                <div className={styles.container}>
                    <h1>{draft.title}</h1>
                    <div className={styles.postDetails}>
                        <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{draft.views} views</span>
                        <span>·</span>
                        <span className={styles.category}>{draft.category}</span>
                    </div>
                    <p>{draft.content}</p>
                </div>
            )}

       
    </>);
}