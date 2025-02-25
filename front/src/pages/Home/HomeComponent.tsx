import { useTranslation } from 'react-i18next';
import Countdown from '../../components/common/Countdown';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HomePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('user');
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	return (document.title = t('home'),
		<div>
			<Countdown />

			<div className='h-fit md:h-[400px] mb-5 mx-2 md:mx-auto max-w-full md:w-[700px]'>
				<div
					className="hero p-0 border border-primary rounded-2xl h-full w-full"
					style={{
						backgroundImage: "url(/assets/images/Anora.jpg)",
					}}>
					<div className="hero-overlay bg-opacity-40 rounded-2xl brightness-50"></div>
					<div className="hero-content text-secondary text-center">
						<div className="">
							<h1 className="mb-5 text-2xl md:text-5xl font-bold">{t('homePage.hero.title')}</h1>
							<p className="mb-5 md:w-2/3 mx-auto">
								{t('homePage.hero.description.first')}
								<span className="link link-primary" onClick={() => navigate('/myPools')}>{t('homePage.hero.description.second')}</span>
								{t('homePage.hero.description.third')}
								<span className="link link-primary" onClick={() => navigate('/findPools')}>{t('homePage.hero.description.fourth')}</span>
								{t('homePage.hero.description.fifth')}
								<span className="link link-primary" onClick={() => navigate('/createPool')}>{t('homePage.hero.description.sixth')}</span>
								{t('homePage.hero.description.seventh')}
							</p>
							{!isAuthenticated && (
								<button
									className="btn btn-primary"
									onClick={() => navigate('/login')}
								>
									{t('homePage.hero.login')}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="card card-side bg-base-100 shadow-xl mx-2 md:w-[700px] md:mx-auto border border-primary my-5 text-base-200">
				<div className="card-body">
					<h2 className="card-title">{t('homePage.nominees.title')}</h2>
					<p>{t('homePage.nominees.subtitle')}</p>
					<div className="card-actions">
						<button
							className="btn btn-primary"
							onClick={() => navigate('/nominees')}
						>
							{t('homePage.nominees.viewAll')}
						</button>
					</div>
				</div>
				<figure className="h-56 w-40">
					<img
						src="assets/images/Conclave.jpg"
						alt={t('images.alt.Conclave')}
						className='h-full'
					/>
				</figure>
			</div>
		</div>
	)
};

export default HomePage;