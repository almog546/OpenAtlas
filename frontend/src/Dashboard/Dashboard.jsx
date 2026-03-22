import styles from './Dashboard.module.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { use, useState } from 'react';
import api from '../api/axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function Dashboard({ user }) {
    const [toggleMenu, setToggleMenu] = useState(user.role === 'ADMIN' ? 'AdminPanel' : 'MyArticles');
    const [content, setContent] = useState([]);
    const [drafts, setDrafts] = useState([]);  
    const [profile, setProfile] = useState(null);
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [followingAuthors, setFollowingAuthors] = useState([]);
    const [AuthorsFollowers, setAuthorsFollowers] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [reports, setReports] = useState([]);
    const [reportResloved, setReportResolved] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [getUsers, setGetUsers] = useState([]);
    const [smallScreen, setSmallScreen] = useState(false);


    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get('/api/auth/users');
                setGetUsers(response.data);
            }
            catch (err) {
                console.error('Failed to fetch users', err);
            }
        }
        fetchUsers();
    }, []);
    useEffect(() => {
        async function fetchAllPosts() {
            try {
                const response = await api.get('/api/posts');
                setAllPosts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch all posts', err);
            }
        }
        fetchAllPosts();
    }, []);
    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await api.get('/api/report');
                setReports(response.data);
            }
            catch (err) {
                console.error('Failed to fetch reports', err);
            }
        }
        fetchReports();
    }, []);
 

    useEffect(() => {
        async function fetchAuthorsFollowers() {
            try {
                const response = await api.get('/api/follow/followers');
                setAuthorsFollowers(response.data); 
                setFollowersCount(response.data.length);
            }
            catch (err) {
                console.error('Failed to fetch authors followers', err);
            }
        }
        fetchAuthorsFollowers();
    }, []);

    useEffect(() => {
        async function fetchFollowingAuthors() {
            try {
                const response = await api.get('/api/follow/following');
                setFollowingAuthors(response.data);
            }
            catch (err) {
                console.error('Failed to fetch following authors', err);
            }
        }
        fetchFollowingAuthors();
    }, []);

    useEffect(() => {
        async function fetchBookmarkedPosts() {
            try {
                const response = await api.get('/api/posts/bookmarks');
                setBookmarkedPosts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch bookmarked posts', err);
            }
        }
        fetchBookmarkedPosts();
    }, []);
    useEffect(() => {
    async function fetchProfile() {
        try {
            const response = await api.get('/api/profile');
            setProfile(response.data);
            setBio(response.data.bio || '');
            setAvatar(response.data.avatar || '');
        }
        catch (err) {
            console.error('Failed to fetch profile', err);
        }
    }
    fetchProfile();
}, []);
    

    useEffect(() => {
        async function fetchDrafts() {
            try {
                const response = await api.get('/api/drafts');
                setDrafts(response.data);
            }
            catch (err) {
                console.error('Failed to fetch drafts', err);
            }
        }
        fetchDrafts();
    }, []);
   useEffect(() => {
        async function fetchContent() {
            try {
                const response = await api.get('/api/posts/myposts');
                setContent(response.data);
            }
            catch (err) {
                console.error('Failed to fetch content', err);
            }
        }
        fetchContent();
    }, []);
        
    const navigate = useNavigate();

        function handleToggleMenu(menu) {
        setToggleMenu(menu);
    }
    async function createProfile() {
    try {
        const response = await api.post('/api/profile', { bio, avatar });
        setProfile(response.data);
        setBio(response.data.bio || '');
        setAvatar(response.data.avatar || '');
    }
    catch (err) {
        console.error('Failed to create profile', err);
    }
}

async function updateProfile() {
    try {
        const response = await api.put('/api/profile', { bio, avatar });
        setProfile(response.data);
        setBio(response.data.bio || '');
        setAvatar(response.data.avatar || '');
    }
    catch (err) {
        console.error('Failed to update profile', err);
    }
}
async function handleToggleReportStatus(reportId, status) {
    try {
        await api.put(`/api/report/${reportId}/resolve`, 
            { status });
        setReportResolved(true);
    } catch (err) {
        console.error('Failed to update report status', err);
    }
}
const mostViewedPost = content.reduce((mostViewed, post) => {
    if (!mostViewed || (post.views || 0) > (mostViewed.views || 0)) {
        return post;
    }
    return mostViewed;
}, null);
const userWithMostPosts = getUsers.reduce((mostPostsUser, user) => {
    if (!mostPostsUser || user._count.posts > mostPostsUser._count.posts) {
        return user;
    }
    return mostPostsUser;
}, null);

function smallScreenToggle() {
    setSmallScreen((prev) => !prev);
}




    return (<>
    {!user ? (
        <Navigate to="/login" replace />
    ) : (
        <>

         <div className={styles.sidebarSmallScreen}>
                <button onClick={smallScreenToggle} className={styles.menuButton}>
                    {smallScreen ? 'Close Menu' : 'Open Menu'}
                </button>
                {smallScreen && (
                    <ul className={styles.dashboardSmallScreen}>
                        {user.role === 'ADMIN' ? <>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('AdminPanel')}> Admin Panel </li>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Insights')}> Platform Analytics & Insights </li>
                           </>
                            : (
                                <>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('MyArticles')}> My Articles </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Drafts')}> Drafts </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Profile')}> Profile </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('SavedArticles')}> Saved Articles </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('FollowingAuthors')}> Following  </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Followers')}> Followers </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Analytics')}> Analytics </li>
                                    <Link to="/newpost" className={styles.dashboardItem}>Write Article</Link>
                                </>
                            )}
                    </ul>
                )}

            </div>
        <div className={styles.container}>
           
           
              <h2>Dashboard</h2>
                        <ul className={styles.dashboard}>
                            {user.role === 'ADMIN' ? <>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('AdminPanel')}> Admin Panel </li>
                            <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Insights')}> Platform Analytics & Insights </li>
                           </>
                            : (
                                <>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('MyArticles')}> My Articles </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Drafts')}> Drafts </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Profile')}> Profile </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('SavedArticles')}> Saved Articles </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('FollowingAuthors')}> Following  </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Followers')}> Followers </li>
                                <li className={styles.dashboardItem} onClick={() => handleToggleMenu('Analytics')}> Analytics </li>
                                 <Link to="/newpost" className={styles.dashboardItem}>Write Article</Link>
                                </>
                            )}
                        </ul>
                         


                          
                           
            
        </div>
        {toggleMenu === 'MyArticles' && 
        <div className={styles.contentMyArticles}>
            {content.length === 0 ? (
                <p>No articles found. Start writing your first article!</p>
            ) : (
                <>
                {content.map(post => (
                    <div key={post.id} className={styles.postMyArticles} onClick={() => navigate(`/myposts/${post.id}`)}>
                        <h3>{post.title}</h3>
                        <div className={styles.postDetailsMyArticles}>
                            <span>·</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))
                }
                </>
            )}
        </div>}


        {toggleMenu === 'Drafts' && <div className={styles.contentDrafts}>
            {drafts.length === 0 ? (
                <p>No drafts found. Start writing your first draft!</p>
            ) : (
                <>
                {drafts.map(draft => (
                    <div key={draft.id} className={styles.postDrafts} onClick={() => navigate(`/drafts/${draft.id}`)}>
                        <h3>{draft.title}</h3>
                        <div className={styles.postDetailsDrafts}>
                            <span>·</span>
                            <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))
                }
                </>
            )}
        </div>}
       {toggleMenu === 'Profile' && (
    <div className={styles.contentProfile}>
        <h1>Profile</h1>

        {profile ? (
            <div>
                <img
                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.user.name}`}
                    alt="avatar"
                    className={styles.avatarProfile}
                />

                <h3>{profile.user.name}</h3>
                <h2>Bio:</h2>
                <p>{profile.bio || 'No bio yet'}</p>
            </div>
        ) : (
            <p>No profile found. Create your profile to share more about yourself!</p>
        )}

        <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Paste avatar image URL..."
            className={styles.inputProfile}
        />

        <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio here..."
            className={styles.textareaProfile}
        />

        {!profile ? (
            <button onClick={createProfile}>Create Profile</button>
        ) : (
            <button onClick={updateProfile}>Update Profile</button>
        )}
    </div>
)}
{toggleMenu === 'SavedArticles' && (
    <div className={styles.contentSavedArticles}>
        <h1>Saved Articles</h1>
        {bookmarkedPosts.length === 0 ? (
            <p className={styles.paraSavedArticles}>No saved articles found. Start exploring and bookmark your favorite articles!</p>
        ) : (
            <>
            {bookmarkedPosts.map(post => (
                <div key={post.id} className={styles.postSavedArticles} onClick={() => navigate(`/posts/${post.post.id}`)}>
                    <h3>{post.post.title}</h3>
                    <div className={styles.postDetailsSavedArticles}>                     
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ))
            }
            </>
        )}
    </div>
)}
{toggleMenu === 'FollowingAuthors' && (
    <div className={styles.Followingcontent}>
        <h1>Following Authors</h1>
        {followingAuthors.length === 0 ? (
            <p className={styles.Followingpara}>No followed authors found. Start exploring and follow authors you like!</p>
        ) : (
            <>
            {followingAuthors.map(author => (
                <div key={author.following.id} className={styles.Followingpost} onClick={() => navigate(`/profile/${author.following.id}`)}>
                     <div className={styles.FollowingavatarContainer}>
                    {author.following.profile?.avatar ? (
                     <img src={author.following.profile.avatar} alt="Avatar" className={styles.Followingavatar} />
                       ) : (
                      <div className={styles.FollowingavatarFallback}>
                       {author.following.name.charAt(0).toUpperCase()}
                        </div>
)}
                    <h3>{author.following.name}</h3>
                    </div>
                    
                </div>
            ))
            }
            </>
        )}
    </div>
)}
{toggleMenu === 'Followers' && (
    <div className={styles.Followerscontent}>
        <h1>Followers {followersCount}</h1>
        {AuthorsFollowers.length === 0 ? (
            <p className={styles.Followerspara}>No followers found. Engage with the community to gain followers!</p>
        ) : (
            <>
            {AuthorsFollowers.map(follower => (
                <div key={follower.follower.id} className={styles.Followerspost} onClick={() => navigate(`/profile/${follower.follower.id}`)}>
                     <div className={styles.FollowersavatarContainer}>
                    {follower.follower.profile?.avatar ? (
                        <img src={follower.follower.profile.avatar} alt="Avatar" className={styles.Followersavatar} />
                          ) : (
                            <div className={styles.FollowersavatarFallback}>
                                {follower.follower.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    <h3>{follower.follower.name}</h3>
                    </div>
                </div>
            ))
            }
            </>
        )}
    </div>
)}
{toggleMenu === 'AdminPanel' && (
    <div className={styles.contentAdminPanel}>
        <h1>Admin Panel</h1>
        {reports.length === 0 ? (
            <p>No reports found. Great job keeping the community safe!</p>
        ) : (
            <>
            {reports.map(report => (
                <div key={report.id} className={styles.reportAdminPanel}>
                     {report.type === 'POST' && (    <>      
                     <div className={styles.reportDetailsAdminPanel}>
                        <div className={styles.reportHeaderAdminPanel}>        
                    <h3>Reported by: {report.reporter.name}</h3>
                    <button onClick={() => handleToggleReportStatus(report.id, 'RESOLVED')} className={styles.resolveButtonAdminPanel}>Resolve</button>
                    <button onClick={() => navigate(`/posts/${report.post.id}`)} className={styles.viewButtonAdminPanel}>View Post</button>
                    </div> 
                    <p>Reason: {report.reason}</p>
                    <p>Type: {report.type}</p>                  
                    <p>Post title: {report.post?.title}</p>
                    <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                     {report.status === 'OPEN' && (
                        <div className={styles.reportActionsAdminPanelAdminPanel}>
                            <p>Report is open</p>
                            </div>
                    )}
                    {report.status === 'RESOLVED' && (
                        <div className={styles.closedReportAdminPanel}>
                            <p>Report closed</p>
                        </div>
                    )}
                    </div>
                    </>
            
                    )}
                    {report.type === 'COMMENT' && (                      
                    <>
                    <div className={styles.reportDetailsAdminPanelAdminPanel}>
                     <div className={styles.reportHeaderAdminPanelAdminPanel}>        
                    <h3>Reported by: {report.reporter.name}</h3>
                    <button onClick={() => handleToggleReportStatus(report.id, 'RESOLVED')} className={styles.resolveButtonAdminPanel}>Resolve</button>
                    <button onClick={() => navigate(`/posts/${report.comment?.postId}`)} className={styles.viewButtonAdminPanel}>View Post</button>
                    </div> 
                    <p>Reason: {report.reason}</p>
                    <p>Type: {report.type}</p>                  
                    <p>Comment content: {report.comment?.content}</p>
                    <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                     {report.status === 'OPEN' && (
                        <div className={styles.reportActionsAdminPanel}>
                            <p>Report is open</p>
                            </div>
                    )}
                    {report.status === 'RESOLVED' && (
                        <div className={styles.closedReportAdminPanel}>
                            <p>Report closed</p>
                        </div>
                    )}
                    </div>
                    </>
                    )}
                </div>
            ))
            }
            </>
        )}
    </div>
)}
 {toggleMenu === 'Analytics' && (
    <div className={styles.content}>
        <h1>Analytics</h1>
        <h2>total Post {content.length}</h2>
        <h2>total views {content.reduce((acc, post) => acc + (post.views || 0), 0)} </h2>
        <h2>total comments {content.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}</h2>
        {mostViewedPost ? (
            <div className={styles.mostViewed}>
                <h2>Most Viewed Post</h2>
                <h3>{mostViewedPost.title}</h3>
                <p>Views: {mostViewedPost.views || 0}</p>
                <button onClick={() => navigate(`/myposts/${mostViewedPost.id}`)} className={styles.viewButton}>View Post</button>
            </div>
        ) : (
            <p>No posts found to analyze.</p>
        )}
    </div>
)}
{toggleMenu === 'Insights' && (
    <div className={styles.contentInsights}>
        <header className={styles.header}>
            <h1>Platform Insights</h1>
            <p>Real-time overview of your community activity</p>
        </header>

        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <span className={styles.label}>Total Posts</span>
                <span className={styles.value}>{allPosts.length}</span>
            </div>
            
            <div className={styles.statCard}>
                <span className={styles.label}>Total Views</span>
                <span className={styles.value}>{allPosts.reduce((acc, post) => acc + (post.views || 0), 0).toLocaleString()}</span>
            </div>

            <div className={styles.statCard}>
                <span className={styles.label}>Total Comments</span>
                <span className={styles.value}>{allPosts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}</span>
            </div>

            <div className={styles.statCard}>
                <span className={styles.label}>Total Users</span>
                <span className={styles.value}>{getUsers.length}</span>
            </div>

            <div className={`${styles.statCard} ${styles.alert}`}>
                <span className={styles.label}>Open Reports</span>
                <span className={styles.value}>{reports.length}</span>
            </div>

            <div className={`${styles.statCard} ${styles.featured}`}>
                <span className={styles.label}>Top Contributor</span>
                <span className={styles.value}>{userWithMostPosts.name}</span>
                <span className={styles.subtext}>Most active user on the platform</span>
            </div>
        </div>
       
    </div>
)}

        </>
    )}
    </>);
}
