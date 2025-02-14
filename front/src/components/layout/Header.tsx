import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('user') !== null);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('user') !== null);
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
        window.location.href = '/login';
    };

    return (
        <div className="navbar bg-primary text-black">
            <div className="navbar-start">
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
                            <li><a href="/">{t('pages.home')}</a></li>
                            <li><a href="/nominees">{t('pages.nominees')}</a></li>
                            <li><a href="/createPool">{t('createPoolPage.title')}</a></li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="navbar-center">
                <img src="/assets/favicon/icon.svg" alt="icon" className="h-6 w-6 mr-2 hidden md:block" style={{ filter: "brightness(0)" }} />
                <a className="btn btn-ghost text-xl font-light" href="/">AcademyBolao</a>
                <img src="/assets/favicon/icon.svg" alt="icon" className="h-6 w-6 ml-2 hidden md:block" style={{ filter: "brightness(0)" }} />
            </div>

            <div className="navbar-end">
                {isAuthenticated ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            <img
                                alt={t('images/alt/Flow')}
                                src="/assets/images/Flow.PNG" />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-primary rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a href="/user">{t('pages.profile')}</a></li>
                            
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
                                <a href="/login">{t('login')}</a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;