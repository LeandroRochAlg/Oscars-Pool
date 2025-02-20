import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../libs/api";
import { AxiosError } from 'axios';
import ErrorMessage from "../../components/common/ErrorMessage";
import Title from "../../components/ui/Title";
import { Pool } from "../../models/pool";
import Container from "./Components/Cointainer";
import GeneralInfo from "./Components/GeneralInfo";
import Categories from "./Components/Categories";
import Members from "./Components/Members";
import Leaderboard from "./Components/Leaderboard";
import EditPool from "./Components/EditPool";

type Users = {
    _id: string;
    username: string;
    admin: boolean;
}
type PoolInfoResponse = Pick<Pool, '_id' | 'name' | 'description' | 'public' | 'inviteToken' | 'categories' | 'createdBy' | 'createdAt'> & {
    users: Users[];
    isUserInPool: boolean
    isAdmin: boolean;
    isCreator: boolean;
};

type Leaderboard = {
    user: string;
    score: number;
}

const PoolInfo = () => {
    const { t } = useTranslation();

    const [pool, setPool] = useState<PoolInfoResponse | null>(null);
    const [title, setTitle] = useState(t('pool.title'));
    const [apiError, setApiError] = useState<string>('');
    const [leaderboard, setLeaderboard] = useState<Leaderboard[] | null>(null);
    const [loadingPoolInfo, setLoadingPoolInfo] = useState(true);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const { id } = useParams<{ id: string }>();

    // Get pool info
    const fetchPoolInfo = async () => {
        setLoadingPoolInfo(true);

        try {
            const result = await api.get(`/pools/getPoolInfo/${id}`);
            setPool(result.data);
            setTitle(result.data.name);
        } catch (error) {
            const axiosError = error as AxiosError;
            
            if (axiosError.response?.status === 500) {
                setApiError(t('pool.errors.error'));
            }

            if (axiosError.response?.status === 404) {
                setApiError(t('pool.errors.notFound'));
            }

            if (axiosError.response?.status === 403) {
                setApiError(t('pool.errors.notAMember'));
            }
        }

        setLoadingPoolInfo(false);
    };

    useEffect(() => {
        fetchPoolInfo();
    }, [id]);

    useEffect(() => {
        setLoadingLeaderboard(true);

        // Get leaderboard
        const fetchLeaderboard = async () => {
            try {
                const result = await api.get(`/pools/getPoolLeaderboard/${id}`);
                setLeaderboard(result.data.leaderboard);
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error('Error getting leaderboard:', axiosError.response?.data);
            }
        };

        fetchLeaderboard();
        setLoadingLeaderboard(false);
    }, [id]);

    return (document.title = title,
        <div className="mx-2 md:max-w-[700px] md:mx-auto my-4 text-base-200">
            {loadingPoolInfo ? (
                <>
                    <div className="skeleton w-96 h-10 mx-auto"></div>

                    <div>
                        <div className="skeleton w-full h-5 my-3"></div>
                        <div className="skeleton w-20 h-5"></div>
                        <div className="skeleton w-36 h-5 my-1"></div>
                        <div className="skeleton w-10 h-5 my-1"></div>
                    </div>
                </>
            ) : (
                <>
                    <Title>{title}</Title>

                    <div className="card card-side shadow-xl md:mx-auto my-5 text-base-200 w-full">
                        <div role="tablist" className="tabs mx-auto w-full tabs-lifted tabs-sm overflow-x-auto">
                            <input type="radio" name="my_tabs_1" role="tab" className="tab text-base-200 h-8" aria-label={t('pool.tabs.generalInfo')} defaultChecked/>
                            <Container>
                                <GeneralInfo pool={pool} />
                            </Container>

                            <input type="radio" name="my_tabs_1" role="tab" className="tab text-base-200 h-8" aria-label={t('pool.tabs.categories')} />
                            <Container>
                                <Categories categories={pool?.categories || []} />
                            </Container>

                            <input type="radio" name="my_tabs_1" role="tab" className="tab text-base-200 h-8" aria-label={t('pool.tabs.members')} />
                            <Container>
                                <Members members={pool?.users || []} isAdmin={pool?.isAdmin || false} creator={pool?.createdBy || ''} poolId={pool?._id || ''} />
                            </Container>
                            
                            <input type="radio" name="my_tabs_1" role="tab" className="tab text-base-200 h-8" aria-label={t('pool.tabs.results')} />
                            <Container>
                                {loadingLeaderboard ? (
                                    <>
                                        {Array.from({ length: pool?.users.length || 0 }).map((_, index) => (
                                            <div key={index} className="skeleton w-full h-5 my-3"></div>
                                        ))}
                                    </>
                                ) : (
                                    <Leaderboard leaderboard={leaderboard || []} />
                                )}
                            </Container>

                            {pool?.isAdmin && (<>
                                <input type="radio" name="my_tabs_1" role="tab" className="tab text-base-200 h-8" aria-label={t('pool.tabs.edit')} />
                                <Container>
                                    <EditPool pool={pool} fetchPool={fetchPoolInfo} />
                                </Container>
                            </>)}
                        </div>
                    </div>

                    <ErrorMessage error={apiError} />
                </>
            )}
        </div>
    );
}

export default PoolInfo;