import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../../libs/api";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";
import styles from "./UserComponent.module.css";
import { FaRegCopy } from "react-icons/fa";
import "../../styles/system.css";

const usernameSchema = yup.object({
    username: yup.string().min(4, 'Username must be at least 4 characters').required(),
});

const passwordSchema = yup.object({
    password: yup.string().min(6, 'Password must be at least 6 characters').required(),
});

const UserPage = () => {
    const [user, setUser] = useState<any>({});
    const [available, setAvailable] = useState(false);
    const [msgUsername, setMsgUsername] = useState<string>('');
    const [msgPassword, setMsgPassword] = useState<string>('');
    const [msgCopy, setMsgCopy] = useState<string>('');
    const [inviteToken, setInviteToken] = useState<string>('');
    const [admin, setAdmin] = useState<boolean>(false);
    const { register: registerUsername, handleSubmit: handleSubmitUsername, formState: { errors: errorsUsername } } = useForm({
        resolver: yupResolver(usernameSchema)
    });

    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword } } = useForm({
        resolver: yupResolver(passwordSchema)
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/user");
                setUser(response.data);
                setAvailable(true);
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
            }
        };

        fetchUser();
    }, []);

    const changeUsername = async (data: any) => {
        try {
            const response = await api.post<string>('/username', data);
            console.log('User updated:', response.data);
            localStorage.setItem('token', response.data);
            setMsgUsername('Username updated successfully.');
        } catch (error) {
            const axiosError = error as AxiosError;
            setMsgUsername(axiosError.response?.data as string || 'An unexpected error occurred.');
            console.error('User update error:', axiosError.response?.data);
        }
    };

    const changePassword = async (data: any) => {
        try {
            const response = await api.post<string>('/password', data);
            console.log('Password updated:', response.data);
            setMsgPassword('Password updated successfully.');
        } catch (error) {
            const axiosError = error as AxiosError;
            setMsgPassword(axiosError.response?.data as string || 'An unexpected error occurred.');
            console.error('Password update error:', axiosError.response?.data);
        }
    }

    const createInviteToken = async (admin: boolean) => {
        try {
            const req = {
                isAdmin: admin
            }
            const response = await api.post<string>('/newToken', req);
            console.log('Invite token created:', response.data);
            setInviteToken(response.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Invite token creation error:', axiosError.response?.data);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setMsgCopy('Copied to clipboard.');
    };

    return (
        (document.title = "User"),
        (<div className="system-body">
            <Header />
            {available && <div className={styles.userContainer}>
                <div className={styles.betsContainer}>
                    <h2 className={styles.title}>Bets</h2>
                    <p>Hello, <span className={styles.username}>{user.username}</span>, you made <span className={styles.betsNumber}>{user.betNumber}/19</span> bets.</p>
                </div>
                <div className={styles.profileContainer}>
                    <h2 className={styles.title}>Profile{user.admin && <span className={styles.admin}>ADMIN</span>}</h2>
                    <div className={styles.changesContainer}>
                        <form onSubmit={handleSubmitUsername(changeUsername)}>
                            <input type="text" {...registerUsername('username')} placeholder={user.username} />
                            <button type="submit">Change</button>
                            {errorsUsername.username && <p>{errorsUsername.username.message}</p>}
                            {msgUsername && <p>{msgUsername}</p>}
                        </form>
                        <form onSubmit={handleSubmitPassword(changePassword)}>
                            <input type="password" {...registerPassword('password')} placeholder="New Password" />
                            <button type="submit">Change</button>
                            {errorsPassword.password && <p>{errorsPassword.password.message}</p>}
                            {msgPassword && <p>{msgPassword}</p>}
                        </form>
                    </div>
                </div>
                {user.admin && <div className={styles.inviteContainer}>
                    <h2 className={styles.title}>Invite Token</h2>
                    <div className={styles.createToken}>
                        <label className={styles.switch}>
                            <input type="checkbox" onChange={() => {setAdmin(!admin); console.log(admin)}} />
                            <span className={styles.slider}></span>
                        </label>
                        <p>Admin?</p>
                        <button onClick={() => createInviteToken(admin)}>CREATE TOKEN</button>
                    </div>
                    {inviteToken && (
                        <div>
                            <div className={styles.createdToken}>
                                <p>{inviteToken}</p>
                                <button onClick={() => copyToClipboard(inviteToken)}><FaRegCopy /></button>
                            </div>
                            <p className={styles.copyMessage}>{msgCopy}</p>
                        </div>
                    )}
                </div>}
            </div>}
            <Sidebar />
            <Footer />
        </div>)
    );
}

export default UserPage;