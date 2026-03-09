import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEdition } from "../../hooks/useEdition";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { editions, selectedEditionKey, setSelectedEditionKey, loading } = useEdition();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = Boolean(user.admin);

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('user') !== null);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('user') !== null);
    }, [location.pathname]);

    useEffect(() => {
        const syncAuthentication = () => {
            setIsAuthenticated(localStorage.getItem('user') !== null);
        };

        window.addEventListener('storage', syncAuthentication);

        return () => {
            window.removeEventListener('storage', syncAuthentication);
        };
    }, []);

    // Handle Theme Change
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };
    
    // Handle Language Change
    const { t, i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    }

    // Handle Logout
    const handleLogout = () => {
        // Handle logout logic here
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate("/login");
    };

    const editionSelector = (
        <div className="flex w-full max-w-xs items-center justify-between gap-3 rounded-box border border-base-300 bg-base-100/90 px-3 py-2 text-base-content shadow-sm">
            <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-base-content/60">{t('edition.selectorLabel')}</p>
                <p className="truncate text-sm font-medium">{editions.find((edition) => edition.key === selectedEditionKey)?.label ?? t('edition.unavailable')}</p>
            </div>
            <select
                className="select select-bordered select-sm w-32 bg-base-100 text-base-content"
                value={selectedEditionKey ?? ''}
                disabled={loading || editions.length === 0}
                onChange={(event) => setSelectedEditionKey(event.target.value)}
            >
                {editions.length === 0 && (
                    <option value="">{loading ? t('edition.loading') : t('edition.unavailable')}</option>
                )}
                {editions.map((edition) => (
                    <option key={edition.key} value={edition.key}>{edition.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="navbar min-h-fit flex-col gap-3 bg-primary px-3 py-3 text-black lg:flex-row lg:flex-wrap lg:justify-between">
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:flex-1">
                <div className="navbar-start w-auto">
                {isAuthenticated && (
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-primary rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a onClick={() => navigate("/")}>{t('pages.home')}</a></li>
                            <li><a onClick={() => navigate("/nominees")}>{t('pages.nominees')}</a></li>
                            <li><a onClick={() => navigate("/myPools")}>{t('myPools.title')}</a></li>
                            <li><a onClick={() => navigate("/findPools")}>{t('findPools.title')}</a></li>
                            <li><a onClick={() => navigate("/createPool")}>{t('createPoolPage.title')}</a></li>
                        </ul>
                    </div>
                )}
                </div>

                <div className="flex flex-1 items-center justify-center gap-2 lg:justify-start">
                    <img src="/assets/favicon/icon.svg" alt="icon" className="hidden h-6 w-6 md:block" style={{ filter: "brightness(0)" }} />
                    <Link className="btn btn-ghost px-2 text-xl font-light" to="/">AcademyBolao</Link>
                    <img src="/assets/favicon/icon.svg" alt="icon" className="hidden h-6 w-6 md:block" style={{ filter: "brightness(0)" }} />
                </div>
            </div>

            <div className="order-3 flex w-full justify-center lg:order-2 lg:w-auto lg:flex-1">
                {editionSelector}
            </div>

            <div className="navbar-end order-2 ml-auto w-auto lg:order-3">
                {isAuthenticated ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            <img
                                alt={t('images.alt.Flow')}
                                src="/assets/images/Flow.PNG" />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-primary rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a onClick={() => navigate("/user")}>{t('pages.profile')}</a></li>
                            {isAdmin && <li><a onClick={() => navigate('/admin')}>{t('pages.admin')}</a></li>}
                            
                            {/* Settings option */}
                            <li>
                                <details>
                                    <summary>{t("settings")}</summary>
                                    <ul>
                                        {/* Change language */}
                                        <li>
                                            <a onClick={() => changeLanguage("en")}>
                                                {i18n.language === "en" ? <strong>🇺🇸 English</strong> : "🇺🇸 English"}
                                            </a>

                                            <a onClick={() => changeLanguage("pt")}>
                                                {i18n.language === "pt" ? <strong>🇧🇷 Português</strong> : "🇧🇷 Português"}
                                            </a>
                                        </li>

                                        {/* Theme switcher */}
                                        <li className="mt-2">
                                            <label className="flex cursor-pointer gap-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="12" cy="12" r="5" />
                                                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                                                </svg>
                                                <input
                                                    type="checkbox"
                                                    value="mythemedark"
                                                    className="toggle theme-controller"
                                                    onChange={toggleTheme}
                                                    checked={theme === "dark"}
                                                />
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                </svg>
                                            </label>
                                        </li>
                                    </ul>
                                </details>
                            </li>

                            <li><a onClick={handleLogout}>{t('logout')}</a></li>
                        </ul>
                    </div>
                ) : (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-5 w-5 stroke-current">
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                        </div>
                        <ul tabIndex={0}
                            className="menu menu-sm dropdown-content bg-primary rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {/* Change language */}
                            <li>
                                <a onClick={() => changeLanguage("en")}>
                                    {i18n.language === "en" ? <strong>🇺🇸 English</strong> : "🇺🇸 English"}
                                </a>

                                <a onClick={() => changeLanguage("pt")}>
                                    {i18n.language === "pt" ? <strong>🇧🇷 Português</strong> : "🇧🇷 Português"}
                                </a>
                            </li>

                            {/* Theme switcher */}
                            <li className="mt-2">
                                <label className="flex cursor-pointer gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                                    </svg>
                                    <input
                                        type="checkbox"
                                        value="mythemedark"
                                        className="toggle theme-controller"
                                        onChange={toggleTheme}
                                        checked={theme === "dark"}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                </label>
                            </li>
                            <li className="mt-2">
                                <a onClick={() => navigate('/login')}>{t('login')}</a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;