import styles from './PostPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

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
                const response = await api.get(`/api/posts/comments/${id}/replies`);
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
                <span>·</span>
                <span className={styles.category}>{post.category}</span>
                {user && (
                    <button onClick={handleBookmark} className={styles.bookmarkButton}>
                        {bookmarked ? 'Unbookmark' : 'Bookmark'}
                    </button>
                )}
            
          
            </div>
            <div className={styles.content}>
            <p>{post.content}</p>
            </div>
            <div className={styles.authorPosts}>
                <h2>More posts by {post.author.name}</h2>
              {postAuthor.map((post) =>(

               <li key={post.id}  className={sts.postItem} onClick={() => handleprofilepostclick(post.id)}>{post.title}</li>
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
                                {replies.filter(reply => reply.commentId === comment.id).map(reply => (<div key={reply.id}><p className={styles.commentReply}>{reply.content}</p></div>))}
                              
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

