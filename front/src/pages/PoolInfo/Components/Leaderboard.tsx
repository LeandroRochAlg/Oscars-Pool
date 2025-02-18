import { useTranslation } from "react-i18next";
import { FaMedal } from "react-icons/fa";

const Leaderboard = ({ leaderboard }: { leaderboard: any[] }) => {
    const { t } = useTranslation();

    if (!leaderboard) {
        return null;
    }

    return (
<div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="text-base-200 text-base">
                        <th className="text-center w-10">Pos.</th>
                        <th>{t('pool.results.user')}</th>
                        <th>{t('pool.results.score')}</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user.username} className="hover:bg-primary hover:text-black">
                            <td className="text-center">
                                {index <= 2 ? (
                                    <div className="flex items-center justify-center">
                                        <FaMedal
                                            className={
                                                index === 0 ? "text-yellow-400" :
                                                index === 1 ? "text-gray-400" :
                                                index === 2 ? "text-yellow-600" : ""
                                            }
                                        />
                                    </div>
                                ) : (
                                    <span>{index + 1}º</span>
                                )}
                            </td>
                            <td>{user.user}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard;