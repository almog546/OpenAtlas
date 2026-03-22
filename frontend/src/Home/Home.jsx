import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import Fuse from "fuse.js";
import { CiSearch } from "react-icons/ci";


export default function Home() {
    const [posts, setPosts] = useState([]);
    const [postorder, setPostorder] = useState('');
    const [search, setSearch] = useState("");
    const [trendingPosts, setTrendingPosts] = useState([]);
   


    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get('/api/posts/trending');
                setTrendingPosts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch trending posts', err);
            }
        }
        fetchPosts();
    }, []);




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
   
   const options = {
        keys: [{name:'title', weight: 0.5}, {name:'content', weight: 0.3}, {name:'author.name', weight: 0.1}, {name:'category', weight: 0.1}],
            
        threshold: 0.3,
        minMatchCharLength: 2
    };
    const fuse = new Fuse(posts, options);
    const results = search
  ? fuse.search(search).map(r => r.item)
  : posts;

     
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
    function sortPostsTrending() {
        setPostorder('trending');
       if (trendingPosts.length > 0) {
         setPosts(trendingPosts);
          } else {
          setPosts([...posts].sort((a, b) => b.views - a.views));
          }
    }






    return (
   <div className={styles.container}>
    <header className={styles.header}>
        <h1 className={styles.title}>OpenAtlas</h1>
        <p className={styles.subtitle}>Explore the collective intelligence of our community.</p>
    </header>

    <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>
                    <CiSearch />
                </span>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
        </div>

       <div className={styles.sortGroup}>
    <button 
        onClick={() => sortPostsnew()} 
        className={`${styles.sortBtn} ${postorder === 'newest' ? styles.active : ''}`}
    >
        Newest
    </button>
    <button 
        onClick={() => sortPostsold()} 
        className={`${styles.sortBtn} ${postorder === 'oldest' ? styles.active : ''}`}
    >
        Oldest
    </button>
    <button 
        onClick={() => sortPostsTrending()} 
        className={`${styles.sortBtn} ${postorder === 'trending' ? styles.active : ''}`}
    >
        Trending
    </button>
</div>
    </div>

    <main className={styles.postsList}>
        {results.map(post => (
            <article key={post.id} className={styles.postCard} onClick={() => handlePostClick(post.id)}>
                <div className={styles.postContent}>
                    <div className={styles.postCategory}>{post.category || 'RESOURCES'}</div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <div className={styles.postMeta}>
                        <span className={styles.author}>{post.author.name}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.date}>
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                
            </article>
        ))}
    </main>
</div>
    );
}