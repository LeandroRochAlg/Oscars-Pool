import '../../styles/auth.css';
import styles from './NotFoundComponent.module.css';

const NotFoundPage = () => {
    return (
        <div className='auth-body'>
            <h1 className={styles.title}>404 - Not Found!</h1>
        </div>
    );
}

export default NotFoundPage;