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
    isAdmin?: boolean;
    isCreator?: boolean;
    isMember?: boolean;
};

const MyPools = () => {
    const { t } = useTranslation();
    const [pools, setPools] = useState<Pool[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver>();

    // Function to fetch user's pools
    const fetchPools = useCallback(
        async (cursor = "") => {
            if (loading) return;

            setLoading(true);

            try {
                const params = new URLSearchParams();
                if (cursor) params.append("cursor", cursor);

                const response = await api.get(`/pools/getPoolsByUser?${params.toString()}`);
                const data = response.data;

                // If it's a new fetch (empty cursor), replace the pool list
                if (!cursor) {
                    setPools(data.pools);
                } else {
                    setPools((prevPools) => [...prevPools, ...data.pools]);
                }

                setNextCursor(data.nextCursor);
                setHasMore(data.hasMore);
            } catch (error) {
                console.error("Error fetching pools: ", error);
            } finally {
                setLoading(false);
            }
        },
        [loading]
    );

    // Effect to fetch pools when the component is mounted
    useEffect(() => {
        fetchPools();
    }, []);

    // Effect to load more pools when the cursor changes (infinite scroll)
    useEffect(() => {
        if (nextCursor) {
            fetchPools(nextCursor);
        }
    }, [nextCursor]);

    // IntersectionObserver setup for infinite scroll
    const lastPoolElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchPools(nextCursor || "");
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, nextCursor]
    );

    return (
        (document.title = t("myPools.title")),
        (
            <>
                <div className="py-5 mx-2 md:w-[700px] md:mx-auto">
                    <Title>{t("myPools.title")}</Title>

                    <div className="flex flex-col">
                        {pools.map((pool, index) => {
                            // Add ref to the last element in the list
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
                    {loading && <p className="text-center text-base-200"><span className="loading loading-dots loading-lg"></span></p>}
                </div>
            </>
        )
    );
};

export default MyPools;