import styles from './otherProfile.module.css';
import { use, useState } from 'react';
import api from '../api/axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function OtherProfile({ user }) {
    const [profile, setProfile] = useState(null);
    const [profilePosts, setProfilePosts] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get(`/api/profile/${id}`);
                setProfile(response.data);
            } catch (err) {
                setProfile([]);
                console.error('Failed to fetch profile', err);
            }
        }
        fetchProfile();
    }, [id]);
    useEffect(() => {
        async function fetchProfilePosts() {
            try {
                const response = await api.get(`/api/profile/${id}/posts`);
                setProfilePosts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch profile posts', err);
            }
        }
        fetchProfilePosts();
    }, [id]);
   

    if (!profile) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }
    function handleprofilepostclick(postId) {
        navigate(`/posts/${postId}`);
    }


  return (
    <div className={styles.container}>
        
        {profile.length === 0 ? (
            <p className={styles.noProfile}>No profile found.</p>
        ) : (
<>
        <h1>{profile.user.name}'s Profile</h1>
        <div className={styles.profileInfo}>
            <img src={profile.avatar || '/default-avatar.png'} alt="Avatar" className={styles.avatar} />
        </div>
        <div className={styles.bio}>
            <h2>Bio</h2>
            <p>{profile.bio || 'No bio available.'}</p>
        </div>
        <div className={styles.posts}>
            <h2>Posts</h2>
            {profilePosts.length === 0 ? (
                <p className={styles.noPosts}>No posts available.</p>
            ) : (
                <ul className={styles.postList}>
                    {profilePosts.map((post) => (
                        <li key={post.id} onClick={() => handleprofilepostclick(post.id)} className={styles.postItem}>{post.title}</li>
                        
                    ))}
                </ul>
            )}
        </div>
        </>
        )}
    </div>
  );
}
    