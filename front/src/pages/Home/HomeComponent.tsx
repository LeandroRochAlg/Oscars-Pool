import { useTranslation } from 'react-i18next';
import Countdown from '../../components/common/CountDown';

const HomePage = () => {
	const { t } = useTranslation();

	return (document.title = t('home'),
		<div>
			<Countdown />

			<div className="card card-side bg-base-100 shadow-xl mx-2 md:w-[600px] md:mx-auto border border-primary my-5 text-base-200">
				<div className="card-body">
					<h2 className="card-title">{t('homePage.nominees.title')}</h2>
					<p>{t('homePage.nominees.subtitle')}</p>
					<div className="card-actions">
						<button className="btn btn-primary" onClick={() => window.location.href = '/nominees'}>{t('homePage.nominees.viewAll')}</button>
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