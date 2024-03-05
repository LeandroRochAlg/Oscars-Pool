import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../../libs/api";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";
import styles from "./LeaderboardComponent.module.css";
import "../../styles/system.css";
import { FaMedal } from "react-icons/fa6";

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [available, setAvailable] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get("/leaderboard");
                setLeaderboard(response.data);
                setAvailable(true);
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        (document.title = "Leaderboard"),
        (
            <div className="system-body">
                <Header />
                <div className={styles.leaderboardContainer}>
                    <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
                    <table className={styles.leaderboardTable}>
                        <thead>
                            <tr>
                                <th className={styles.pos}>Pos.</th>
                                <th className={styles.username}>Username</th>
                                <th className={styles.points}>Points</th>
                                <th className={styles.categories}>Categories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {available && leaderboard.map((user: any, index) => (
                                <tr key={user.username}>
                                    <td className={
                                        index === 0 ? styles.firstPlace :
                                        index === 1 ? styles.secondPlace :
                                        index === 2 ? styles.thirdPlace : ''
                                    }>
                                        {index <= 2 ? <FaMedal /> : index + 1 + 'º'}
                                    </td>
                                    <td className={styles.userUsername}>{user.username}</td>
                                    <td>{user.points}</td>
                                    <td>{user.hits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Sidebar />
                <Footer />
            </div>
        )
    );
}

export default LeaderboardPage;