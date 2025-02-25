import { useTranslation } from "react-i18next";
import { FaCrown } from "react-icons/fa";
import { useState } from "react";
import api from "../../../libs/api";
import ErrorMessage from "../../../components/common/ErrorMessage";
import AreYouSure from "../../../components/common/AreYouSure";

type User = {
    userId: string;
    username: string;
    admin: boolean;
}

const Members = ({ members, isAdmin, creator, poolId }: { members: any[], isAdmin: boolean, creator: string, poolId: string }) => {
    const { t } = useTranslation();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loadingAdmin, setLoadingAdmin] = useState(false);
    const [loadingBan, setLoadingBan] = useState(false);
    const [error, setError] = useState('');
    const [showAreYouSure, setShowAreYouSure] = useState(false);

    if (!members) {
        return null;
    }

    // Show modal
    const showModal = (user: any) => {
        setSelectedUser(user);

        const modal = document.getElementById('my_modal_2');
        if (modal) {
            (modal as HTMLDialogElement).showModal();
        }
    }

    // Handle ban user
    const banUser = () => {
        setLoadingBan(true);

        const data = {
            poolId: poolId,
            userId: selectedUser?.userId
        }

        api.post(`/pools/banUser`, data).then(() => {
            setLoadingBan(false);
            setError('');
            setShowAreYouSure(false);

            // Update the user in the list
            const updatedMembers = members.filter((user: any) => user.userId !== selectedUser?.userId);

            // Update the state
            members = updatedMembers;
        }).catch(() => {
            setLoadingBan(false);
            setError(t('pool.errors.banUserFailed'));
        });
    }

    // Handle add admin
    const addAdmin = () => {
        setLoadingAdmin(true);

        const data = {
            poolId: poolId,
            userId: selectedUser?.userId
        }

        api.post(`/pools/addAdmin`, data).then(() => {
            setLoadingAdmin(false);
            setError('');
            
            // Update the user in the list
            const updatedMembers = members.map((user: any) => {
                if (user.userId === selectedUser?.userId) {
                    user.admin = true;
                }

                return user;
            });

            // Update the state
            members = updatedMembers;
        }).catch(() => {
            setLoadingAdmin(false);
            setError(t('pool.errors.addAdminFailed'));
        });
    }

    // Handle remove admin
    const removeAdmin = () => {
        setLoadingAdmin(true);

        const data = {
            poolId: poolId,
            userId: selectedUser?.userId
        }

        console.log(data);

        api.post(`/pools/removeAdmin`, data).then(() => {
            setLoadingAdmin(false);
            setError('');
            
            // Update the user in the list
            const updatedMembers = members.map((user: any) => {
                if (user.userId === selectedUser?.userId) {
                    user.admin = false;
                }

                return user;
            });

            // Update the state
            members = updatedMembers;
        }).catch(() => {
            setLoadingAdmin(false);
            setError(t('pool.errors.removeAdminFailed'));
        });
    }

    return (
        <>
            <ul>
                {members.map((user: any) => (
                    <li key={user.userId} className="font-bold flex gap-2 items-center hover:cursor-pointer my-1" onClick={() => showModal(user)}>{user.username} {user.admin && (<div className="inline tooltip" data-tip={t('pool.members.admin')}><FaCrown /></div>)}</li>
                ))}
            </ul>

            {/* Actions modal */}
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box w-auto">
                    <h1 className="text-xl mb-3">
                        {t('pool.members.actions')} <span className="font-bold">{selectedUser?.username}</span>
                    </h1>
                    {isAdmin && creator !== selectedUser?.username ? (
                        <div>
                            {selectedUser?.admin ? (
                                <button className="btn btn-warning" onClick={removeAdmin} disabled={loadingAdmin}>
                                    {loadingAdmin ? (<span className="loading loading-spinner"></span>) : t('pool.members.removeAdmin')}
                                </button>
                            ) : (
                                <button className="btn btn-success" onClick={addAdmin} disabled={loadingAdmin}>
                                    {loadingAdmin ? (<span className="loading loading-spinner"></span>) : t('pool.members.addAdmin')}
                                </button>
                            )}
                            <button className="btn ml-10 btn-error" onClick={() => { setShowAreYouSure(true); (document.getElementById('my_modal_2') as HTMLDialogElement).close(); }} disabled={loadingBan}>
                                {loadingBan ? (<span className="loading loading-spinner"></span>) : t('pool.members.ban')}
                            </button>
                        </div>
                    ) : (
                        <p>{t('pool.members.cantDoNothing')}</p>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <ErrorMessage error={error} />

            <AreYouSure
                onYes={banUser}
                onNo={() => setShowAreYouSure(false)}
                message={t('pool.members.areYouSure')}
                show={showAreYouSure}
            />
        </>
    );
}

export default Members;