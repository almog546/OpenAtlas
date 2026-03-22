import styles from './newPost.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export default function NewPost({ user }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [picture, setPicture] = useState(null);
    const navigate = useNavigate();

     async function handleSubmit() {
        try {
            await api.post('/api/posts', { title, content, category, picture });
            navigate('/dashboard');
        }
        catch (err) {
            console.error('Failed to create post', err);
        }
    }
    async function handleSaveDraft() {
        try {
            await api.post('/api/drafts', { title, content, category, picture });
            navigate('/dashboard');
        }
        catch (err) {
            console.error('Failed to save draft', err);
        }
    }
           


    return (<>
    {!user ? (
        <Navigate to="/login" replace />
    ) : (
        <div className={styles.container}>
            <h1>Write Article</h1>
            <form className={styles.form}>
                <input 
                type="text"
                placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                 className={styles.input} />
                <ReactQuill
                placeholder="Content" 
                value={content}
                onChange={setContent}
                className={styles.textarea} />
                <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                
            </form>
            <div className={styles.actions}>
    <button className={styles.button} onClick={handleSaveDraft}>Save Draft</button>
    <button type="submit" className={styles.button} onClick={handleSubmit}>Create Post</button>
</div>
        </div>
    )}
   
   </>);
}