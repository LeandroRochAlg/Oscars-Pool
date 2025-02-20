import { useTranslation } from "react-i18next";
import Title from "../../components/ui/Title";

const FindPools = () => {
    const { t } = useTranslation();

    return (document.title = t('findPools.title'),
        <>
            <Title>{t('findPools.title')}</Title>
        </>
    )
}

export default FindPools;