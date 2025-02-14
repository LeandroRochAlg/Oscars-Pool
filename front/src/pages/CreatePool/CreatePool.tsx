import { useTranslation } from "react-i18next";

const CreatePool = () => {
    const { t } = useTranslation();

    return (document.title = t('createPoolPage.title'),
        <div>
            <h2>{t('createPoolPage.title')}</h2>
        </div>
    );
}

export default CreatePool;