import styles from './NotFoundComponent.module.css';

const NotFoundPage = () => {
    return (document.title = '404 - Not Found!') && (
        <div className='auth-body'>
            <h1 className={styles.title}>404 - Not Found!</h1>
        </div>
    );
}

export default NotFoundPage;