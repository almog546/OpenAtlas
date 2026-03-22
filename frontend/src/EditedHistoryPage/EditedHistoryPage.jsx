import styles from './EditedHistoryPage.module.css';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';


export default function EditedHistoryPage() {
    const [editHistory, setEditHistory] = useState([]);
    const { id, historyId } = useParams();
    
    useEffect(() => {
        async function fetchEditHistory() {
            try {
                const response = await api.get(`/api/posts/myposts/${id}/history/${historyId}`);
                setEditHistory(response.data);
            } catch (error) {
                console.error('Error fetching edit history:', error);
            }
        }
        fetchEditHistory();
    }, [id, historyId]);
    
    return (<>
        <div className={styles.container}>
            <h2>Edited Version from {new Date(editHistory.createdAt).toLocaleDateString()}</h2>
            <h3>{editHistory.title}</h3>
            <p><strong>Category:</strong> {editHistory.category}</p>
            <div className={styles.content}>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editHistory.content) }} />
            </div>
        </div>
    </>
    );
}