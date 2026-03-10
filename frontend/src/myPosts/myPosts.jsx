import styles from './myPosts.module.css';
import { useState, useEffect, use } from 'react';
import api from '../api/axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function MyPosts({ user }) {
    const [posts, setPosts] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedCategory, setEditedCategory] = useState('');
    const [editedPicture, setEditedPicture] = useState('');
    const [editedHistory, setEditedHistory] = useState([]);
    
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchEditedHistory() {
            try {
                const response = await api.get(`/api/posts/myposts/${id}/history`);
                setEditedHistory(response.data);
            } catch (error) {
                console.error('Error fetching edited history:', error);
            }
        }
        fetchEditedHistory();
    }, [id]);

    

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get(`/api/posts/myposts/${id}`);
                setPosts(response.data);
               setEditedTitle(response.data.title);
               setEditedContent(response.data.content);
               setEditedCategory(response.data.category);
               setEditedPicture(response.data.picture);
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
   function handleEdit() {
        setEditing(
            (prev) => !prev
        );
    }
    

    async function handleSave() {
        try {
            await api.put(`/api/posts/myposts/${id}`, {
                title: editedTitle || posts.title,
                content: editedContent || posts.content,
                category: editedCategory || posts.category,
                picture: editedPicture || posts.picture,
            });
            setEditing(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    }
    function handlePostHistoryClick(historyId) {
        navigate(`/posts/myposts/${id}/history/${historyId}`);
    }

return (
    <>
    {!user ? (
        <Navigate to="/login" replace />
    ) : (
        <div className={styles.container}>
            <div className={styles.actions}>
                <h1>{posts.title}</h1>
                <div className={styles.actionButtons}>
    <button className={styles.btnDelete} onClick={handleDelete}>Delete</button>
    <button className={styles.btnEdit} onClick={handleEdit}>{editing ? 'Cancel' : 'Edit'}</button>
    {editing && <button className={styles.btnSave} onClick={handleSave}>Save</button>}
</div>
               {editing ?(
                    <div className={styles.editForm}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Content"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}

                        />
                       <select 
                                      value={editedCategory}
                                      onChange={(e) => setEditedCategory(e.target.value)}
                                      className={styles.select}>
                                      <option value="">Select Category</option>
                                      <option value="technology">Technology</option>
                                       <option value="programming">Programming</option>
                                      <option value="webDevelopment">Web Development</option>
                                      <option value="softwareEngineering">Software Engineering</option>
                                      <option value="dataScience">Data Science</option>
                                      <option value="artificialIntelligence">Artificial Intelligence</option>
                                      <option value="cyberSecurity">Cyber Security</option>
                                     <option value="devOps">DevOps</option>
                                     <option value="mobileDevelopment">Mobile Development</option>
                                     <option value="gameDevelopment">Game Development</option>
                                     <option value="startups">Startups</option>
                                     <option value="business">Business</option>
                                     <option value="marketing">Marketing</option>
                                     <option value="finance">Finance</option>
                                     <option value="productivity">Productivity</option>
                                     <option value="career">Career</option>
                                     <option value="education">Education</option>
                                     <option value="science">Science</option>
                                     <option value="health">Health</option>
                                     <option value="lifestyle">Lifestyle</option>
                                     <option value="travel">Travel</option>
                                     <option value="food">Food</option>
                                     <option value="sports">Sports</option>
                                     <option value="entertainment">Entertainment</option>
                                     <option value="books">Books</option>
                            </select>
                    </div>
                ) : (
                    <>
                    <div className={styles.postDetails}>
                        <span className={styles.author}>{posts.author.name}</span>
                        <span>·</span>
                        <span>{new Date(posts.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className={styles.category}>{posts.category}</span>
                    </div>
                    <p>{posts.content}</p>
                    {editedHistory.length > 0 && (
                        <div className={styles.history}>
                            <h3>Edited History</h3>
                            <ul>
                                {editedHistory.map((edit) => (
                                    <li key={edit.id} onClick={() => handlePostHistoryClick(edit.id)} className={styles.historyItem}>
                                        <span>{new Date(edit.createdAt).toLocaleDateString()}</span>
                                        <span>·</span>
                                        <span>{edit.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
       
    )}
    </>
);
}

             