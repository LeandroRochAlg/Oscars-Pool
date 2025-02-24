import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../libs/api";
import NomineeCard from "../../../components/common/NomineeCard";
import SuccessMessage from "../../../components/common/SuccessMessage";

type Nominee = {
    name: string;
    detail: string;
    movieImage: string;
    isWinner: boolean;
}

type Category = {
    category: string;
    weight: number;
    nominees: Nominee[];
}

const Bets = ({ pool }: { pool: string })  => {
    const { t } = useTranslation();
    const [canUpdateBets, setCanUpdateBets] = useState(false);
    const [bets, setBets] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const fetchBets = useCallback(async () => {
        try {
            const result = await api.get(`/bet/${pool}`);
            setBets(result.data.userBets);
            setCanUpdateBets(result.data.canUpdateBets);
        } catch (error) {
            console.error('Error getting bets:', error);
        }
    }, [pool]);

    const moveNominee = (categoryIndex: number, currentIndex: number, direction: 'up' | 'down') => {
        const newBets = [...bets];
        const nominees = [...newBets[categoryIndex].nominees];
        
        if (direction === 'up' && currentIndex > 0) {
            [nominees[currentIndex], nominees[currentIndex - 1]] = 
            [nominees[currentIndex - 1], nominees[currentIndex]];
        }
        
        if (direction === 'down' && currentIndex < nominees.length - 1) {
            [nominees[currentIndex], nominees[currentIndex + 1]] = 
            [nominees[currentIndex + 1], nominees[currentIndex]];
        }
        
        newBets[categoryIndex].nominees = nominees;
        setBets(newBets);
    };

    useEffect(() => {
        fetchBets();
    }, [fetchBets]);

    const handleSaveBets = () => {
        setLoading(true);

        const userBets = bets.map(category => ({
            category: category.category,
            nominees: category.nominees.map(nominee => nominee.name)
        }));

        api.put(`/bet/create/${pool}`, { userBets }).then(() => {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            fetchBets();
        }).catch(() => {
            console.error('Error saving bets');
        }).finally(() => {
            setLoading(false);
        });
    }

    if (!pool) return null;

    return (
        <div className="space-y-8">
            {bets.map((category, categoryIndex) => (
                <div key={categoryIndex} className="rounded-box">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">{t(category.category)} <span className="bg-primary text-black font-light px-3 py-1 rounded-lg">{category.weight}</span></h3>
                    <div className="space-y-2">
                        {category.nominees.map((nominee, nomineeIndex) => (
                            <div key={nomineeIndex} className="flex items-center gap-2 rounded-box border border-base-200 p-2">
                                {canUpdateBets && (
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveNominee(categoryIndex, nomineeIndex, 'up')}
                                            className="btn btn-ghost btn-xs"
                                            disabled={nomineeIndex === 0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => moveNominee(categoryIndex, nomineeIndex, 'down')}
                                            className="btn btn-ghost btn-xs"
                                            disabled={nomineeIndex === category.nominees.length - 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <NomineeCard
                                    name={nominee.name}
                                    detail={nominee.detail}
                                    movieImage={nominee.movieImage}
                                    isWinner={nominee.isWinner}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {canUpdateBets && (
                <div className="fixed bottom-0 right-0 p-4">
                    <button 
                        onClick={handleSaveBets}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {t('pool.bets.save')}
                    </button>
                </div>
            )}

            {showSuccessMessage && (<SuccessMessage message={t('pool.bets.saved')} />)}
        </div>
    );
}

export default Bets;