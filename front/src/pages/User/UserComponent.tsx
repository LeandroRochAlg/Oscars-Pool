import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../../libs/api";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Title from "../../components/ui/Title";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";

const usernameSchema = yup.object({
    username: yup.string().min(4, 'Username must be at least 4 characters').required().matches(/^[a-zA-Z0-9_]+$/, 'Invalid username')
});

type UserResponse = {
    username: string;
    email: string;
    admin: boolean;
    poolNumber: number;
}

const UserPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', content: string } | null>(null);

    // Formulário de username
    const { 
        register: registerUsername, 
        handleSubmit: handleSubmitUsername,
        formState: { errors: errorsUsername }
    } = useForm({
        resolver: yupResolver(usernameSchema)
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/user");
                setUser(response.data);
            } catch (error) {
                console.error("User fetch error:", error);
            }
        };
        fetchUser();
    }, []);

    const handleUpdateUsername = async (data: any) => {
        try {
            await api.put("/user", { username: data.username });
            setMsg({ type: 'success', content: t('user.updateSuccess') });
            setUser(prev => prev ? {...prev, username: data.username} : null);
        } catch (error) {
            const axiosError = error as AxiosError;
            setMsg({
                type: 'error',
                content: axiosError.response?.data === 'Username already taken' 
                    ? t('user.usernameTaken')
                    : t('user.updateError')
            });
        }
    };

    return ((document.title = user?.username || t('pool.results.user')),
        (<div className="py-5 mx-2 md:w-[700px] md:mx-auto text-base-200">
            {user && (
                <div className="flex flex-col items-center">
                    <Title>{user.username} {user.admin && (<span className="text-sm bg-success text-secondary p-2 rounded-lg">ADMIN</span>)}</Title>
                    <a className="text-center mx-auto hover:cursor-pointer border border-base-100 p-2 rounded-lg hover:border-primary" onClick={() => navigate('/myPools')}>
                        {user.poolNumber} {t('user.pools')}
                    </a>

                    {/* Formulário de Username */}
                    <div className="w-full max-w-md bg-base-100 p-6 rounded-box">
                        <form onSubmit={handleSubmitUsername(handleUpdateUsername)} className="space-y-4 flex flex-col">
                            <InputField
                                type="text"
                                placeholder={user.username}
                                {...registerUsername('username')}
                            />
                            {errorsUsername.username && (
                                <span className="text-error">{errorsUsername.username.message}</span>
                            )}
                            <Button type="submit">
                                {t('user.updateUsername')}
                            </Button>
                        </form>
                    </div>

                    {msg && (
                        <div className="w-full max-w-md">
                            {msg.type === 'success' ? (
                                <SuccessMessage message={msg.content} />
                            ) : (
                                <ErrorMessage error={msg.content} />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>)
    );
}

export default UserPage;