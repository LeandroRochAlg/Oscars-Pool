import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../libs/api";
import Title from "../../components/ui/Title";
import PoolPreview from "../../components/common/PoolPreview";
import ErrorMessage from "../../components/common/ErrorMessage";
import { FaPaste, FaSearch } from "react-icons/fa";

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

const FindPools = () => {
    const { t } = useTranslation();
    const [pools, setPools] = useState<Pool[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [inviteToken, setInviteToken] = useState<string>("");
    const [inviteTokenLoading, setInviteTokenLoading] = useState<boolean>(false);
    const [poolInvite, setPoolInvite] = useState<Pool | null>(null);
    const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
    const [loadingJoinPool, setLoadingJoinPool] = useState<boolean>(false);
    const [joinPoolError, setJoinPoolError] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver>();

    // Function to fetch pools
    const fetchPools = useCallback(
        async (search = "", cursor = "") => {
            if (loading) return;

            setLoading(true);

            try {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (cursor) params.append("cursor", cursor);

                const response = search ? await api.get(`/pools/getPoolsBySearch?${params.toString()}`) : await api.get(`/pools/getPoolsByUserNumber?${params.toString()}`);
                const data = response.data;

                // If it's a new search (empty cursor), replace the pool list
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

    // Effect to fetch pools when searchQuery changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Reset pagination states
            setPools([]);
            setNextCursor(null);
            setHasMore(true);

            // Perform the search
            fetchPools(searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Effect to load more pools when the cursor changes (infinite scroll)
    useEffect(() => {
        if (nextCursor) {
            fetchPools(searchQuery, nextCursor);
        }
    }, []);

    // IntersectionObserver setup for infinite scroll
    const lastPoolElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchPools(searchQuery, nextCursor || "");
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, nextCursor]
    );

    // Handle invite token search
    const handleInviteTokenSearch = async () => {
        setShowInviteModal(true);
        setInviteTokenLoading(true);

        try {
            const response = await api.get(`/pools/getPoolByToken/${inviteToken}`);
            setPoolInvite(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching pool by invite token: ", error);
        } finally {
            setInviteTokenLoading(false);
        }
    }

    // Handle join pool
    const handleJoinPool = async () => {
        setLoadingJoinPool(true);

        try {
            const joinPool = {
                poolId: poolInvite?._id,
                inviteToken: inviteToken
            }

            const response = await api.post(`/pools/joinPool`, joinPool);

            if (response.status === 200) {
                poolInvite!.isMember = true;
            }
        } catch (error) {
            setJoinPoolError(t('pool.errors.joinPoolFailed'));
            console.error("Error joining pool: ", error);
        } finally {
            setLoadingJoinPool(false);
        }
    }

    return (
        (document.title = t("findPools.title")), (
            <>
                <div
                    className="hero"
                    style={{
                        backgroundImage: "url('/assets/images/SingSing.jpg')",
                    }}
                >
                    <div className="hero-overlay bg-opacity-20"></div>
                    <div className="hero-content flex-col">
                        <Title>{t("findPools.title")}</Title>
                        <div className="flex flex-col md:flex-row md:w-[750px] gap-2">
                            <label className="input flex items-center gap-2 md:w-2/3 text-base-200">
                                <input
                                    type="text"
                                    className="grow w-full mx-2 placeholder:text-base-200"
                                    placeholder={t("findPools.searchPlaceholder")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </label>
                            <label className="input flex items-center gap-2 md:w-1/3 text-base-200">
                                <input
                                    type="text"
                                    className="grow w-full mx-2 placeholder:text-base-200"
                                    placeholder={t("findPools.inviteTokenPlaceholder")}
                                    value={inviteToken}
                                    onChange={(e) => setInviteToken(e.target.value)}
                                />
                                {inviteToken ? (
                                    <FaSearch
                                        className="hover:cursor-pointer"
                                        onClick={handleInviteTokenSearch}
                                    />
                                ) : (
                                    <FaPaste
                                        className="hover:cursor-pointer"
                                        onClick={async () => {
                                            try {
                                                const text = await navigator.clipboard.readText();
                                                setInviteToken(text);
                                            } catch (err) {
                                                console.error("Failed to read clipboard contents: ", err);
                                            }
                                        }}
                                    />
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="py-5 mx-2 md:w-[700px] md:mx-auto">
                    <div className="flex flex-col">
                        {pools.map((pool, index) => {
                            // Add ref to the last element of the list
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

                {/* Invite token modal */}
                {showInviteModal && (
                    <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50">
                        <div className="modal-box md:p-8 px-0">
                            <button
                                className="btn btn-sm btn-circle btn-ghost text-base-200 absolute right-2 top-2"
                                onClick={() => setShowInviteModal(false)}
                            >
                                ✕
                            </button>
                            {poolInvite && !inviteTokenLoading ? (
                                <div className="flex flex-col gap-4">
                                    <PoolPreview pool={poolInvite} />
                                    <button
                                        className="btn btn-success text-secondary mx-auto"
                                        disabled={poolInvite.isMember || loadingJoinPool}
                                        onClick={handleJoinPool}
                                    >
                                        {loadingJoinPool ? (
                                            <span className="loading loading-spinner text-base-100"></span>
                                        ) : (
                                            t('pool.generalInfo.joinPool')
                                        )}
                                    </button>
                                </div>
                            ) : (
                                inviteTokenLoading ? (
                                    <p className="text-center text-base-200"><span className="loading loading-dots loading-lg"></span></p>
                                ) : (
                                    <p className="text-center text-base-200">{t("pool.errors.poolNotFound")}</p>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Error message */}
                <ErrorMessage error={joinPoolError || ''} />
            </>
        )
    );
};

export default FindPools;