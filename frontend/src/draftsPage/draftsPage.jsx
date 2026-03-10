import styles from './draftsPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export default function DraftsPage( { user }) {
     const { id } = useParams();
    const [draft, setdraft] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftContent, setDraftContent] = useState('');
    const [draftCategory, setDraftCategory] = useState('');
    const [draftPicture, setDraftPicture] = useState('');
    const [edittoggle, setEditToggle] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDraft() {
            try {
                const response = await api.get(`/api/drafts/${id}`);
                setdraft(response.data);
                setDraftTitle(response.data.title);
                setDraftContent(response.data.content);
                setDraftCategory(response.data.category);
                setDraftPicture(response.data.picture);
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
async function handleDelete() {
    try {
        await api.delete(`/api/drafts/${id}`);
        setdraft(null);
        navigate('/Dashboard');
    }
    catch (err) {
        console.error('Failed to delete draft', err);
    }
}
async function handleEdit() {
    try {
        await api.put(`/api/drafts/${id}`, 
            { title: draftTitle, content: draftContent, category: draftCategory, picture: draftPicture });
    } catch (err) {
        console.error('Failed to edit draft', err);
    }
}

function toggleEdit() {
    setEditToggle((prev) => !prev);
}
  async function handleSubmit() {
        try {
            await api.post('/api/posts', { title: draftTitle, content: draftContent, category: draftCategory, picture: draftPicture });
            navigate('/dashboard');
        }
        catch (err) {
            console.error('Failed to create post', err);
        }
    }
    return (<>
     {!user ? (
                <Navigate to="/login" replace />
            ) : (
                <div className={styles.container}>
                    <h1>{draft.title}</h1>
                    <div>
                    
                    <button className={styles.btnDelete} onClick={handleDelete}>Delete</button>
                    <button className={styles.btnEdit} onClick={toggleEdit}>Edit</button>
                    {edittoggle && (
                        <button className={styles.btnSave} onClick={handleEdit}>Save</button>
                    )}
                    </div>
                    {edittoggle ? (
                        <div className={styles.editForm}>
                            <input
                                type="text"
                                value={draftTitle}
                                onChange={(e) => setDraftTitle(e.target.value)}
                                className={styles.input}
                            />
                            <textarea
                                value={draftContent}
                                onChange={(e) => setDraftContent(e.target.value)}
                                className={styles.textarea}
                            ></textarea>
                              <select 
                                                                  value={draftCategory}
                                                                  onChange={(e) => setDraftCategory(e.target.value)}
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
                        <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className={styles.category}>{draft.category}</span>
                    </div>
                    <p>{draft.content}</p>
                            </>
                        )}
                </div>
            )}
    </>
    );
}