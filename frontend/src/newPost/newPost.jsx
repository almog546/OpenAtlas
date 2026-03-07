import styles from './NewPost.module.css';
import { useNavigate } from 'react-router-dom';


export default function NewPost({ user }) {
    const navigate = useNavigate();
    return (<>
    {!user ? (
        navigate('/login')
    ) : (
        <div className={styles.container}>
            <h1>Write Article</h1>
            <form className={styles.form}>
                <input type="text" placeholder="Title" className={styles.input} />
                <textarea placeholder="Content" className={styles.textarea}></textarea>
                <select className={styles.select}>
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
    <button className={styles.button}>Save Draft</button>
    <button type="submit" className={styles.button}>Create Post</button>
</div>
        </div>
    )}
   
   </>);
}