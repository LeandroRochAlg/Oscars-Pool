import { useTranslation } from "react-i18next";

const Header = () => {
    const { t } = useTranslation();

    const handleLogout = () => {
        // Handle logout logic here
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="navbar bg-info text-secondary">
            <div className="navbar-start">
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
                    className="menu menu-sm dropdown-content bg-info rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li><a>{t('pages.home')}</a></li>
                    <li><a>Portfolio</a></li>
                    <li><a>About</a></li>
                </ul>
                </div>
            </div>
            <div className="navbar-center">
                <img src="/assets/favicon/icon.svg" alt="icon" className="h-6 w-6 mr-2 hidden md:block" />
                <a className="btn btn-ghost text-xl font-light" href="/">AcademyBolao</a>
                <img src="/assets/favicon/icon.svg" alt="icon" className="h-6 w-6 ml-2 hidden md:block" />
            </div>
            <div className="navbar-end">
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
                        className="menu menu-sm dropdown-content bg-info rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a href="/user">{t('pages.profile')}</a></li>
                        <li><a>Settings</a></li>
                        <li><a onClick={handleLogout}>{t('logout')}</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;