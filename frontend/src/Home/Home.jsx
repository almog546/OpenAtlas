import styles from './Home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <h1>Welcome to OpenAtlas!</h1>
            <p>This is the home page. You can navigate to different sections of the app using the links above.</p>
        </div>
    );
}