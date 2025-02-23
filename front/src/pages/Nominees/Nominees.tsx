import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from '../../libs/api';
import { AxiosError } from 'axios';
import NomineeCard from "../../components/common/NomineeCard";
import NomineeCardSkeleton from "../../components/common/NomineeCardSkeleton";
import Title from "../../components/ui/Title";

const Nominees = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [currentCategory, setCurrentCategory] = useState('nominees.category.bestPicture');
    const [nominees, setNominees] = useState([]);
    const [loadingNominees, setLoadingNominees] = useState(true);
    const { t } = useTranslation();

    // Get all categories
    useEffect(() => {
        setLoadingCategories(true);

        try {
            api.get('/categories')
                .then(response => {
                    setCategories(response.data);
                })
                .catch((error) => {
                    const axiosError = error as AxiosError;
                    console.error('Error getting categories:', axiosError.response?.data);
                });
        } catch (error) {
            console.error('Error getting categories:', error);
        }

        setLoadingCategories(false);
    }, []);

    // Get nominees for the current category
    useEffect(() => {
        setLoadingNominees(true);

        try {
            api.get(`/nominees/${currentCategory}`)
                .then(response => {
                    setNominees(response.data);
                })
                .catch((error) => {
                    const axiosError = error as AxiosError;
                    console.error('Error getting nominees:', axiosError.response?.data);
                });
        } catch (error) {
            console.error('Error getting nominees:', error);
        }

        setLoadingNominees(false);
    }, [currentCategory]);

    return (document.title = t('pages.nominees'), 
        <div className="mx-2 md:max-w-[700px] md:mx-auto my-4">
            <Title>{t('pages.nominees')}</Title>
            <div className="nominees-container">
                {loadingCategories ? (
                    <div className="skeleton h-12 rounded-md w-full my-2"></div>
                ) : (
                    <select className="select select-bordered border-primary w-full my-2" onChange={(e) => setCurrentCategory(e.target.value)} value={currentCategory}>
                        {categories.map((category: any) => (
                            <option key={category} value={category} onClick={() => setCurrentCategory(category)} selected={currentCategory === category}>
                                {t(category)}
                            </option>
                        ))}
                    </select>
                )}


                {!loadingNominees ? (
                    <div className="nominees">
                        <ul>
                            {nominees.map((nominee: any) => (
                                <li key={nominee.name}>
                                    <NomineeCard {...nominee} winner={nominee.winner} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <NomineeCardSkeleton />
                )}
            </div>
        </div>
    );
}

export default Nominees;