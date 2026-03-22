import styles from './notification.module.css';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';


export default function Notification() {
   const [notifications, setNotifications] = useState([]);
   const [markedAsRead, setMarkedAsRead] = useState(false);
   const [markedOneAsRead, setMarkedOneAsRead] = useState(false);
   const navigate = useNavigate();
   
   useEffect(() => {
    async function fetchNotifications() {
        try {
           const { data } = await api.get('/api/notifications');
           setNotifications(data);
        }
        catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    }
    fetchNotifications();
   }, []);
   async function markAllAsRead() {
    try {
        await api.post('/api/notifications/mark-as-read');
        setMarkedAsRead(true);
    } catch (err) {
        console.error('Failed to mark notifications as read', err);
    }
}

    return (<>
   
        <div className={styles.container}>
            <h1>Notifications</h1>
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (<>
                    <button className={styles.markReadButton} onClick={markAllAsRead} disabled={markedAsRead}>Mark all as read</button>
                <ul className={styles.notificationList}>
                    {notifications.map(notification => (
                        <li key={notification.id} className={styles.notificationItem} onClick={() => {
                            if (notification.type === 'follow') {
                                navigate(`/profile/${notification.actorId}`);
                            } else if (notification.type === 'comment') {
                                navigate(`/posts/${notification.postId}`);
                            }
                        }}>
                            <img src={notification.actor?.profile?.avatar}  className={styles.avatar} />
                            <p>{notification.actor?.name} - {notification.type}</p>
                            {notification.type === 'comment' && <p> {notification.post?.title}</p>}
                            <span className={styles.timestamp}>{new Date(notification.createdAt).toLocaleString()}</span>
                            {notification.isRead === false ? <div className={styles.unreadIndicator}></div> : <div className={styles.readIndicator}></div>}
                            

                        
                    
                        </li>
                    ))}
                </ul>
            </>)}
        </div>
  </>  );
}