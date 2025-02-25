import { useTranslation } from "react-i18next";

type AreYouSureProps = {
    onYes: () => void;
    onNo: () => void;
    message: string;
    show: boolean;
}

const AreYouSure = ({ onYes, onNo, message, show }: AreYouSureProps) => {
    const { t } = useTranslation();

    if (!show) {
        return null;
    }

    return (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-box w-auto">
            <h2 className="text-lg mb-5">{message}</h2>
            <button className="btn btn-primary" onClick={onYes}>{t('yes')}</button>
            <button className="btn btn-ghost" onClick={onNo}>{t('no')}</button>
            </div>
        </div>
    );
}

export default AreYouSure;