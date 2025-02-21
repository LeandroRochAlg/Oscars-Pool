import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../libs/api";
import Title from "../../components/ui/Title";
import PoolPreview from "../../components/common/PoolPreview";

type Pool = {
    _id: string;
    name: string;
    description: string;
    public: boolean;
    categories: number;
    users: number;
    isAdmin: boolean;
    isCreator: boolean;
    isMember: boolean;
}

const FindPools = () => {
    const { t } = useTranslation();
    const [pools, setPools] = useState<Pool[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver>();

    // Fetch pools
    const fetchPools = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const cursor = nextCursor ? `?cursor=${nextCursor}` : "";
            const response = await api.get(`/pools/getPoolsByUserNumber${cursor}`);
            const data = response.data;

            setPools((prevPools) => [...prevPools, ...data.pools]);
            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Error fetching pools: ", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, nextCursor]);

    // Fetch pools on component mount
    useEffect(() => {
        fetchPools();
    }, []);

    // Set up observer for infinite scroll
    const lastPoolElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchPools();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, fetchPools]
    );

    return (document.title = t('findPools.title'),
        <>
            <div
                className="hero"
                style={{
                    backgroundImage: "url('/assets/images/SingSing.jpg')",
                }}>
                <div className="hero-overlay bg-opacity-20"></div>
                <div className="hero-content flex-col">
                    <Title>{t('findPools.title')}</Title>
                    <label className="input flex items-center gap-2 text-base-200">
                        <input type="text" className="grow w-full mx-2 md:w-[700px] placeholder:text-base-200" placeholder={t('findPools.searchPlaceholder')} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                        </svg>
                    </label>
                </div>
            </div>

            <div className="py-5 mx-2 md:w-[700px] md:mx-auto">
                <div className="flex flex-col">
                    {pools.map((pool, index) => {
                        // If we are at the last pool, we want to attach the ref to the last pool element
                        if (pools.length === index + 1) {
                            return (
                                <div ref={lastPoolElementRef} key={pool._id}>
                                    <PoolPreview pool={pool} />
                                </div>
                            );
                        } else {
                            return <PoolPreview key={pool._id} pool={pool} />;
                        }
                    })}
                </div>
                {loading && <p className="text-center">{t('findPools.loading')}</p>}
            </div>
        </>
    )
}

export default FindPools;