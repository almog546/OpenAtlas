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
    const [isFollowing, setIsFollowing] = useState(false);


    useEffect(() => {
        async function checkIfFollowing() {
            try {
                const response = await api.get(`/api/follow/check-following/${id}`);
                setIsFollowing(response.data.isFollowing);
            } catch (err) {
                console.error('Failed to check if following', err);
            }
        }
        checkIfFollowing();
    }, [id]);

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
    async function handleFollow() {
        try {
            await api.post(`/api/follow/follow/${id}`);
           
            setIsFollowing(true);
        } catch (err) {
            console.error('Failed to follow user', err);
        }
    }
    async function handleUnfollow() {
        try {
            await api.delete(`/api/follow/unfollow/${id}`);
           
            setIsFollowing(false);
        } catch (err) {
            console.error('Failed to unfollow user', err);
        }
    }


  return (
    <div className={styles.container}>
        
        {profile.length === 0 ? (
            <p className={styles.noProfile}>No profile found.</p>
        ) : (
<>
     
        <div className={styles.profileInfo}>
            <div className={styles.avatarContainer}>
            <img src={profile.avatar || profile.user.name.charAt(0).toUpperCase()} alt="Avatar" className={styles.avatar} />
            <div className={styles.userName}>{profile.user.name}</div>
            </div>
            <div className={styles.follow}>
                {!user ? (
                    <p>Please <span className={styles.loginLink} onClick={() => navigate('/login')}>log in</span> to follow this user.</p>
                ) : (
                <>
                {isFollowing ? (
                    <button className={styles.followButton} onClick={handleUnfollow}>Unfollow</button>
                ) : (
                    <button className={styles.followButton} onClick={handleFollow}>Follow</button>
                )}
                </>
                )}
            </div>
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
    