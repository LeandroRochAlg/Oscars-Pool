import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaClipboardList } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

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

const PoolPreview = ({ pool }: { pool: Pool }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const badge = () => {
        if (pool.isCreator) return <span className="badge bg-success border-secondary text-secondary">{t('findPools.poolPreview.creator')}</span>;
        if (pool.isAdmin) return <span className="badge bg-success border-secondary text-secondary">{t('findPools.poolPreview.admin')}</span>;
        if (pool.isMember) return <span className="badge bg-success border-secondary text-secondary">{t('findPools.poolPreview.member')}</span>;
        return <span className="badge bg-error border-secondary text-secondary">{t('findPools.poolPreview.notAMember')}</span>
    }

    if (!pool) return null;

    return (
        <div className="card hover:cursor-pointer border border-base-100 hover:border-primary text-base-200" onClick={() => navigate(`/pool/${pool._id}`)}>
            <div className="card-body">
                <h2 className="card-title">{pool.name}</h2>
                <p>{pool.description.length > 200 ? `${pool.description.substring(0, 200)}...` : pool.description}</p>
                <div className="card-footer flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm">{pool.users} <FaUsers /></span>
                    <span className="flex items-center gap-1 text-sm">{pool.categories} <FaClipboardList /></span>
                    {badge()}
                </div>
            </div>
        </div>
    );
}

export default PoolPreview;