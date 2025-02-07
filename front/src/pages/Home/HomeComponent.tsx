import { useTranslation } from 'react-i18next';
import Countdown from '../../components/common/CountDown';

const HomePage = () => {
	const { t } = useTranslation();

	return (document.title = t('home'), 
		<Countdown />
	)
};

export default HomePage;