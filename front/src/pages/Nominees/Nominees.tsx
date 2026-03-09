import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from '../../libs/api';
import { AxiosError } from 'axios';
import NomineeCard from "../../components/common/NomineeCard";
import NomineeCardSkeleton from "../../components/common/NomineeCardSkeleton";
import Title from "../../components/ui/Title";
import { useEdition } from "../../hooks/useEdition";
import { Nominee as NomineeModel } from "../../models/nominee";

type NomineeViewModel = NomineeModel & {
    isWinner?: boolean;
};

const Nominees = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [currentCategory, setCurrentCategory] = useState('nominees.category.bestPicture');
    const [nominees, setNominees] = useState<NomineeViewModel[]>([]);
    const [loadingNominees, setLoadingNominees] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const { t } = useTranslation();
    const { selectedEdition, selectedEditionKey } = useEdition();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setIsAdmin(user.admin);
    }, []);

    // Get all categories
    useEffect(() => {
        setLoadingCategories(true);

        api.get('/categories', {
            params: {
                edition: selectedEditionKey,
            },
        })
            .then(response => {
                setCategories(response.data);
                if (response.data.length > 0 && !response.data.includes(currentCategory)) {
                    setCurrentCategory(response.data[0]);
                }
            })
            .catch((error) => {
                const axiosError = error as AxiosError;
                console.error('Error getting categories:', axiosError.response?.data);
            })
            .finally(() => {
                setLoadingCategories(false);
            });
    }, [currentCategory, selectedEditionKey]);

    // Get nominees for the current category

    const fetchNominees = useCallback(() => {
        setLoadingNominees(true);

        api.get(`/nominees/${currentCategory}`, {
            params: {
                edition: selectedEditionKey,
            },
        })
            .then(response => {
                setNominees(response.data);
            })
            .catch((error) => {
                const axiosError = error as AxiosError;
                console.error('Error getting nominees:', axiosError.response?.data);
            })
            .finally(() => {
                setLoadingNominees(false);
            });
    }, [currentCategory, selectedEditionKey]);

    useEffect(() => {
        fetchNominees();
    }, [fetchNominees]);

    // Handle register winner
    const handleRegisterWinner = (nominee: NomineeViewModel) => {
        if (!isAdmin) return;

        try {
            api.put('/winner', { category: currentCategory, nominee: nominee.name, editionKey: selectedEditionKey })
                .then(response => {
                    console.log('Winner registered:', response.data);
                    fetchNominees();
                })
                .catch((error) => {
                    const axiosError = error as AxiosError;
                    console.error('Error registering winner:', axiosError.response?.data);
                });
        } catch (error) {
            console.error('Error registering winner:', error);
        }
    }

    return (document.title = t('pages.nominees'), 
        <div className="mx-2 md:w-[700px] md:mx-auto my-4">
            <Title>{t('pages.nominees')}</Title>
            {selectedEdition && <div className="badge badge-primary mb-2">{selectedEdition.label}</div>}
            <div className="w-full">
                {loadingCategories ? (
                    <div className="skeleton h-12 rounded-md w-full my-2"></div>
                ) : (
                    <select className="select select-bordered border-primary w-full my-2" onChange={(e) => setCurrentCategory(e.target.value)} value={currentCategory}>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {t(category)}
                            </option>
                        ))}
                    </select>
                )}


                {!loadingNominees ? (
                    <div className="nominees">
                        <ul>
                            {nominees.map((nominee) => (
                                <li key={nominee.name} onDoubleClick={() => handleRegisterWinner(nominee)}>
                                    <NomineeCard {...nominee} isWinner={nominee.isWinner} />
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