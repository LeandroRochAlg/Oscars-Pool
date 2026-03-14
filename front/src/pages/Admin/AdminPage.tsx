import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../libs/api';
import Title from '../../components/ui/Title';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';
import { EditionSummary } from '../../models/edition';
import { useEdition } from '../../hooks/useEdition';

const AdminPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { activeEdition, selectedEditionKey, setSelectedEditionKey } = useEdition();
    const [editions, setEditions] = useState<EditionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [activatingKey, setActivatingKey] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const locale = useMemo(() => (i18n.language === 'pt' ? 'pt-BR' : 'en-US'), [i18n.language]);

    const formatDate = (date: string) => new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));

    const loadEditions = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await api.get<EditionSummary[]>('/editions');
            const uniqueEditions = response.data.filter((edition, index, editionList) => (
                editionList.findIndex((candidate) => candidate.key === edition.key) === index
            ));
            setEditions(uniqueEditions);
        } catch (error) {
            setErrorMessage(t('adminPage.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEditions();
    }, []);

    const activateEdition = async (editionKey: string) => {
        setActivatingKey(editionKey);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await api.put(`/editions/${editionKey}/activate`);
            setSelectedEditionKey(editionKey);
            setSuccessMessage(t('adminPage.activationSuccess'));
            await loadEditions();
        } catch (error) {
            const axiosError = error as AxiosError;
            setErrorMessage(typeof axiosError.response?.data === 'string' ? axiosError.response.data : t('adminPage.activationError'));
        } finally {
            setActivatingKey(null);
        }
    };

    return (
        <div className="mx-2 my-4 md:mx-auto md:w-[900px] text-base-200">
            <Title>{t('adminPage.title')}</Title>
            <p className="mb-2 text-center text-base-content/80">{t('adminPage.subtitle')}</p>
            {activeEdition && <div className="badge badge-primary mb-4">{t('adminPage.active')}: {activeEdition.label}</div>}

            <div className="mb-4 flex justify-center">
                <button className="btn btn-primary" onClick={() => navigate('/nominees')}>
                    {t('adminPage.goToNominees')}
                </button>
            </div>

            <div className="alert mb-4">
                <span>{t('adminPage.winnerHint')}</span>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((item) => <div key={item} className="skeleton h-48 w-full rounded-box"></div>)}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {editions.map((edition) => {
                        const isActive = edition.isActive;
                        const isSelected = selectedEditionKey === edition.key;

                        return (
                            <div key={edition.key} className="card border border-primary bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="card-title">{edition.label}</h2>
                                        <div className="flex gap-2">
                                            {isActive && <span className="badge badge-primary">{t('adminPage.alreadyActive')}</span>}
                                            {isSelected && <span className="badge badge-outline">{t('adminPage.selected')}</span>}
                                        </div>
                                    </div>
                                    <p><strong>{t('adminPage.ceremonyDate')}:</strong> {formatDate(edition.ceremonyDate)}</p>
                                    <p><strong>{t('adminPage.betDeadline')}:</strong> {formatDate(edition.betDeadline)}</p>
                                    <div className="card-actions justify-end">
                                        <button
                                            className="btn btn-primary"
                                            disabled={isActive || activatingKey === edition.key}
                                            onClick={() => activateEdition(edition.key)}
                                        >
                                            {activatingKey === edition.key ? t('adminPage.activating') : t('adminPage.activate')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <SuccessMessage message={successMessage} />
            <ErrorMessage error={errorMessage} />
        </div>
    );
};

export default AdminPage;