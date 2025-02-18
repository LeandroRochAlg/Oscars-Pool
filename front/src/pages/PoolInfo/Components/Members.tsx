import { useTranslation } from "react-i18next";
import { FaCrown } from "react-icons/fa";

const Members = ({ members }: { members: any[] }) => {
    const { t } = useTranslation();

    if (!members) {
        return null;
    }

    return (
        <ul>
            {members.map((user: any) => (
                <li key={user._id} className="font-bold flex gap-2 items-center">{user.username} {user.admin && (<div className="inline tooltip" data-tip={t('pool.members.admin')}><FaCrown /></div>)}</li>
            ))}
        </ul>
    )
}

export default Members;