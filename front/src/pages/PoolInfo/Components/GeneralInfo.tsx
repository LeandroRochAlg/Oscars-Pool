import { useTranslation } from "react-i18next";
import SuccessMessage from "../../../components/common/SuccessMessage";
import { useState } from "react";
import api from "../../../libs/api";
import ErrorMessage from "../../../components/common/ErrorMessage";

const GeneralInfo = ({ pool }: { pool: any }) => {
    const { t } = useTranslation();

    const [copySuccess, setCopySuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!pool) {
        return null;
    }

    // Handle copy to clipboard
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(pool.inviteToken);
        setCopySuccess(t('pool.feedback.inviteTokenCopied'));

        setTimeout(() => {
            setCopySuccess('');
        }, 3000);
    }

    // Handle join pool
    const handleJoinPool = () => {
        setLoading(true);

        const joinPool = {
            poolId: pool._id,
            inviteToken: pool.inviteToken
        }

        api.post(`/pools/joinPool`, joinPool).then(() => {
            setError('');
            setLoading(false);
            pool.isUserInPool = true;
        }).catch(() => {
            setError(t('pool.errors.joinPoolFailed'));
            setLoading(false);
        });
    }

    // Handle leave pool
    const handleLeavePool = () => {
        setLoading(true);

        api.post(`/pools/leavePool/${pool._id}`).then(() => {
            setError('');
            setLoading(false);
            pool.isUserInPool = false;
        }).catch(() => {
            setError(t('pool.errors.leavePoolFailed'));
            setLoading(false);
        });
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center h-10 max-w-2/3">
                    {pool.name}
                    {!pool.public && (
                        <span className="ml-3 tooltip" data-tip={t('pool.generalInfo.private')}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                        </span>
                    )}
                    <span className="ml-3 tooltip hover:cursor-pointer" data-tip={t('pool.generalInfo.copyInviteToken')} onClick={handleCopyToClipboard}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                            />
                        </svg>
                    </span>
                </h2>

                {!pool.isUserInPool ? (
                    <button className="btn btn-success" disabled={loading} onClick={handleJoinPool}>
                        {loading ? <span className="loading loading-spinner"></span> : t('pool.generalInfo.joinPool')}
                    </button>
                ) : (
                    <button className="btn btn-error" disabled={pool.isCreator || loading} onClick={handleLeavePool}>
                        {loading ? <span className="loading loading-spinner"></span> : t('pool.generalInfo.leavePool')}
                    </button>
                )}
            </div>

            <p className="my-2">{pool.description}</p>

            <p className="text-xs">
                {t('pool.generalInfo.createdBy')}
                <span className="font-bold"> {pool.createdBy} </span>
                {t('pool.generalInfo.at')} {new Date(pool.createdAt).toLocaleDateString()}
            </p>

            <SuccessMessage message={copySuccess} />
            <ErrorMessage error={error} />
        </div>
    );
};

export default GeneralInfo;