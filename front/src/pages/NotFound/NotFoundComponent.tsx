import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (document.title = t('404.title')), (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: "url(/assets/images/WildRobot.jpg)",
            }}>
            <div className="hero-overlay bg-opacity-30 brightness-50"></div>
            <div className="hero-content text-secondary text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">{t("404.title")}</h1>
                    <p className="mb-5">
                        {t('404.message')}
                    </p>
                    <button 
                        className="btn btn-success"
                        onClick={() => navigate('/')}
                    >
                        {t('404.backToHome')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;