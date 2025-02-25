import { Nominee } from "../../models/nominee";
import { useTranslation } from "react-i18next";

type NomineeCardProps = Nominee & {isWinner?: boolean, loading?: boolean};

const NomineeCard = (CardProps: NomineeCardProps) => {
	const { t } = useTranslation();

	return (
		<div className="card card-side border border-primary bg-none text-base-200 shadow-md h-32 my-2 md:h-24 w-full">
			<figure className="card-side-img w-24 min-w-24 md:w-20 md:min-w-20">
				<img
					src={CardProps.movieImage}
					alt="Movie"
				/>
			</figure>
			{CardProps.isWinner && (
				<div className="indicator">
					<span className="indicator-item indicator-center badge badge-primary">{t('nominees.winner')}</span>
				</div>
			)}
			<div className="card-body px-3 h-full flex flex-col justify-center gap-0">
				<h2 className="card-title text-[1rem] md:text-lg">{t(CardProps.name)}</h2>
				<p className="text-sm">{t(CardProps.detail)}</p>
			</div>
		</div>
	)
};

export default NomineeCard;