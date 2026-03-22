import styles from './PostPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

export default function PostPage({ user }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editedCommentContent, setEditedCommentContent] = useState('');
    const [edittoggle, setEditToggle] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [replyToggle, setReplyToggle] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replies, setReplies] = useState([]);
    const [bookmarked, setBookmarked] = useState(false);
    const [postAuthor, setPostAuthor] = useState([]);
    const [openreport, setOpenReport] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [reportingCommentId, setReportingCommentId] = useState(null);
    const [openCommentReport, setOpenCommentReport] = useState(false);


    useEffect(() => {
        async function fetchPostAuthor() {
            try {
                const response = await api.get(`/api/posts/author/${post.authorId}`);
                setPostAuthor(response.data);
            } catch (err) {
                console.error('Failed to fetch post author', err);
            }
        }
        if (post) {
            fetchPostAuthor();
        }
    }, [post]);

    useEffect(() => {
        async function incrementViews() {
            try {
                await api.post(`/api/posts/${id}/views`);
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error('Failed to increment views', err);
            }
        }
        incrementViews();
    }, [id]);

useEffect(() => {
        async function fetchReplies() {
            try {
                const response = await api.get(`/api/posts/${id}/replies`);
                setReplies(response.data);
            } catch (err) {
                console.error('Failed to fetch replies', err);
            }
        }
        fetchReplies();
    }, [id]);


    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await api.get(`/api/posts/${id}/comments`);
                setComments(response.data);
            } catch (err) {
                console.error('Failed to fetch comments', err);
            }
        }
        fetchComments();
    }, [id]);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
            }
            catch (err) {
                console.error('Failed to fetch post', err);
            }
        }
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (!user) return;
        async function fetchBookmarkStatus() {
            try {
                const response = await api.get(`/api/posts/${id}/bookmark/check`);
                setBookmarked(response.data.bookmarked);
            } catch (err) {
                console.error('Failed to fetch bookmark status', err);
            }
        }
        fetchBookmarkStatus();
    }, [id, user]);

    if (!post) {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
        </div>
    );
}
function handleAuthorClick(id) {
    navigate(`/profile/${id}`);
}

async function handleAddComment() {
    try {
        const response = await api.post(`/api/posts/${id}/comments`, { content: newComment, postId: id, authorId: user.id });
        setComments([...comments, response.data]);
        setNewComment('');
    } catch (err) {
        console.error('Failed to add comment', err);
    }
}
async function handleDeleteComment(id) {
    try {
        await api.delete(`/api/posts/comments/${id}`);
        setComments(comments.filter(comment => comment.id !== id));
    } catch (err) {
        console.error('Failed to delete comment', err);
    }
}
async function handleEditComment(id) {
    try {
        await api.put(`/api/posts/comments/${id}`, 
            { content: editedCommentContent });
        setComments(comments.map(comment => comment.id === id ? { ...comment, content: editedCommentContent } : comment));
        setEditedCommentContent('');
        toggleEdit();
        setEditingCommentId(null);
    } catch (err) {
        console.error('Failed to edit comment', err);
    }
}
function toggleEdit() {
    setEditToggle(true);
}
function toggleUnedit() {
    setEditToggle(false);
}
function toggleReply() {
    setReplyToggle(true);
}
function toggleReplying() {
    setReplyToggle(false);
}
async function handleSubmitReply(id) {
    try {
        const response = await api.post(`/api/posts/comments/${id}/replies`,
                    { content: replyContent, commentId: id, authorId: user.id });
        setReplies([...replies, response.data]);
        setReplyContent('');
        toggleReplying();
    } catch (err) {
        console.error('Failed to submit reply', err);
    }
}
async function handleBookmark() {
    try {
        if (bookmarked) {
            await api.delete(`/api/posts/${id}/bookmark`);
            setBookmarked(false);
        }
        else {
            await api.post(`/api/posts/${id}/bookmark`);
            setBookmarked(true);
        }
    } catch (err) {
        console.error('Failed to toggle bookmark', err);
    }
}
function handleprofilepostclick(postId) {
        navigate(`/posts/${postId}`);
    }
    function toggleReport() {
        setOpenReport(true);
    }
    function closeReport() {
        setOpenReport(false);
    }
    async function handlePostReport() {
        try {
            await api.post(`/api/report/post`, { postId: id, reason: reportReason });
            setReportSubmitted(true);
            setReportReason('');
            closeReport();
        } catch (err) {
            console.error('Failed to submit report', err);
        }
    }
    function toggleCommentReport(id) {
        setOpenCommentReport(true);
        setReportingCommentId(id);
    }
    async function handleCommentReport() {
        try {
            await api.post(`/api/report/comment`, { commentId: reportingCommentId, reason: reportReason });
            setReportSubmitted(true);
            setReportReason('');
            setReportingCommentId(null);
            setOpenCommentReport(false);
        } catch (err) {
            console.error('Failed to submit comment report', err);
        }
    }
    async function handleAdminDeletePost() {
        try {
            await api.delete(`/api/posts/admin/${id}`);
            
            navigate('/home');
        } catch (err) {
            console.error('Failed to delete post', err);
            
        }
    }
    async function handleAdminDeleteComment(commentId) {
        try {
            await api.delete(`/api/posts/admin/comments/${commentId}`);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment', err);
        }
    }
    async function handleAdminDeleteReply(replyId) {
        try {
            await api.delete(`/api/posts/admin/replies/${replyId}`);
            setReplies(replies.filter(reply => reply.id !== replyId));
        } catch (err) {
            console.error('Failed to delete reply', err);
        }
    }


           







    return (
        <>
         
            <> 
           
        <div className={styles.container}>
            <h1>{post.title}</h1>
            <div className={styles.postDetails}>
                <span className={styles.author} onClick={() => handleAuthorClick(post.author.id)}>{post.author.name}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{post.views} views</span>
               
                <span className={styles.category}>{post.category}</span>
                {user && (
                    <>
                    <button onClick={handleBookmark} className={styles.bookmarkButton}>
                        {bookmarked ? 'Unbookmark' : 'Bookmark'}
                    </button>
                    <button className={styles.reportButton} onClick={toggleReport}>Report</button>
                        {user.role === 'ADMIN' && <button className={styles.deleteButtonPost} onClick={handleAdminDeletePost}>Delete Post</button>}
                    {openreport && (
                        <div className={styles.reportModal}>
                            <div className={styles.reportContent}>
                                <h2>Report Post</h2>
                                <textarea
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Reason for reporting"
                                    className={styles.reportInput}
                                ></textarea>
                                <button className={styles.reportSubmitButton} onClick={handlePostReport}>Submit Report</button>
                                <button className={styles.reportCancelButton} onClick={closeReport}>Cancel</button>
                            </div>
                        </div>
                     )}
                </>)}
            
          
            </div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
            </div>
            <div className={styles.authorPosts}>
                <h2>More posts by {post.author.name}</h2>
              {postAuthor.map((post) =>(

               <li key={post.id}  className={styles.postItem} onClick={() => handleprofilepostclick(post.id)}>{post.title}</li>
                ))}
            </div>
            <div className={styles.comments}>
                <h2>Comments</h2>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={styles.commentInput}
                />
                <button onClick={handleAddComment} className={styles.commentButton}>Submit</button>
                {comments.map(comment => (
                    <div key={comment.id} className={styles.comment}>
                {comment.author.profile?.avatar? (
                        <img src={comment.author.profile.avatar} alt={comment.author.name} className={styles.commentAuthorImage} />
                    ) : (
                        <div className={styles.commentAuthorPlaceholder}>{comment.author.name.charAt(0).toUpperCase()}</div>
                    )
                    
                }
                      
                        <span className={styles.commentAuthor} onClick={() => handleAuthorClick(comment.author.id)}>{comment.author.name}</span>
                        <span>·</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        {edittoggle && editingCommentId === comment.id ? (
                            <>
                                <textarea
                                    value={editedCommentContent}
                                    onChange={(e) => setEditedCommentContent(e.target.value)}
                                    className={styles.commentInput}
                                />
                                <button onClick={() => handleEditComment(comment.id)} className={styles.commentButton}>Save</button>
                                <button onClick={toggleUnedit} className={styles.commentButton}>Unedit</button>
                                
                            </>
                        ) : (
                            <>
                                <p>{comment.content}</p>
                                 {user?.id === comment.authorId ? (<>
                                <button onClick={toggleEdit} className={styles.commentButton}>Edit</button>
                                <button onClick={() => handleDeleteComment(comment.id)} className={styles.commentButton}>Delete</button>
                                </>) : 
                                <>
                                {user && (<>
                                {!replyToggle &&(
                                      <button className={styles.commentButton} onClick={() => { setReplyToggle(true); setReplyingToCommentId(comment.id); }}>Reply</button>
                                )}
                                <button className={styles.reportButton} onClick={() => toggleCommentReport(comment.id)}>Report</button>
                                  {user?.role === 'ADMIN' && <button className={styles.deleteButton} onClick={() => handleAdminDeleteComment(comment.id)}>Delete Comment</button>}
                                {openCommentReport && reportingCommentId === comment.id && (
                                    <div className={styles.reportModal}>
                                        <div className={styles.reportContent}>
                                            <h2>Report Comment</h2>
                                            <textarea
                                                value={reportReason}
                                                onChange={(e) => setReportReason(e.target.value)}
                                                placeholder="Reason for reporting"
                                                className={styles.reportInput}
                                            ></textarea>
                                            <button className={styles.reportSubmitButton} onClick={handleCommentReport}>Submit Report</button>
                                            <button className={styles.reportCancelButton} onClick={() => setOpenCommentReport(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                               </>)}
                              
                                {replyToggle && replyingToCommentId === comment.id && (
                                    <>
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write your reply..."
                                            className={styles.commentInput}
                                        />
                                        <button  className={styles.commentButton} onClick={() => handleSubmitReply(comment.id)}>Submit Reply</button>
                                        <button onClick={toggleReplying} className={styles.commentButton}>Cancel Reply</button>
                                    </>
                                )}
                                  {user?.role === 'ADMIN' && replies.filter(reply => reply.commentId === comment.id).map(reply => (
                                    <div key={reply.id}>
                                        <p className={styles.commentReply}>{reply.content}</p>
                                        <button className={styles.deleteButton} onClick={() => handleAdminDeleteReply(reply.id)}>Delete Reply</button>
                                    </div>
                                ))}
                               
                                </>
                                
                        }
                            </>
                        )}
                        
                    </div>
                ))}
               
            </div>
        </div>
        </>
    </>);
}

