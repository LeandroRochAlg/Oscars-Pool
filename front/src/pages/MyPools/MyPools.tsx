import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../libs/api";
import Title from "../../components/ui/Title";
import PoolPreview from "../../components/common/PoolPreview";
import { useEdition } from "../../hooks/useEdition";

type Pool = {
    _id: string;
    name: string;
    description: string;
    editionKey?: string;
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
    const loadingRef = useRef(false);
    const observer = useRef<IntersectionObserver>();
    const requestedCursorsRef = useRef<Set<string>>(new Set());
    const { selectedEdition, selectedEditionKey } = useEdition();

    const mergePools = (currentPools: Pool[], incomingPools: Pool[]) => {
        const existingIds = new Set(currentPools.map((pool) => pool._id));
        return [...currentPools, ...incomingPools.filter((pool) => !existingIds.has(pool._id))];
    };

    // Function to fetch user's pools
    const fetchPools = useCallback(
        async (cursor = "", reset = false) => {
            const requestKey = `${selectedEditionKey ?? 'active'}:${cursor}`;

            if (loadingRef.current || requestedCursorsRef.current.has(requestKey)) return;

            requestedCursorsRef.current.add(requestKey);
            loadingRef.current = true;

            setLoading(true);

            try {
                const params = new URLSearchParams();
                if (cursor) params.append("cursor", cursor);
                if (selectedEditionKey) params.append("editionKey", selectedEditionKey);

                const response = await api.get(`/pools/getPoolsByUser?${params.toString()}`);
                const data = response.data;

                if (reset || !cursor) {
                    setPools(data.pools);
                } else {
                    setPools((prevPools) => mergePools(prevPools, data.pools));
                }

                setNextCursor(data.nextCursor);
                setHasMore(data.hasMore);
            } catch (error) {
                console.error("Error fetching pools: ", error);
            } finally {
                loadingRef.current = false;
                setLoading(false);
            }
        },
        [selectedEditionKey]
    );

    // Effect to fetch pools when the component is mounted
    useEffect(() => {
        requestedCursorsRef.current.clear();
        setPools([]);
        setNextCursor(null);
        setHasMore(true);
        fetchPools('', true);
    }, [fetchPools, selectedEditionKey]);

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
        [loading, hasMore, nextCursor, fetchPools]
    );

    return (
        (document.title = t("myPools.title")),
        (
            <>
                <div className="py-5 mx-2 md:w-[700px] md:mx-auto">
                    <Title>{t("myPools.title")}</Title>
                    {selectedEdition && <div className="badge badge-primary mb-4">{selectedEdition.label}</div>}

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