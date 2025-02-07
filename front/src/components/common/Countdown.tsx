import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Countdown = () => {
    const { t } = useTranslation();

    // Oscar date: March 2, 2025, 9 PM (Brasília time)
    const oscarDate = new Date("2025-03-02T21:00:00-03:00");

    // State to store the remaining time
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        // Function to calculate the remaining time
        const calculateTimeLeft = () => {
        const now = new Date();
        const difference = oscarDate.getTime() - now.getTime();

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        } else {
            // If the event has passed, reset the countdown
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
        };

        // Update the countdown every second
        const timer = setInterval(calculateTimeLeft, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mx-auto my-4 w-fit flex flex-col md:flex-row">
            <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
                {/* Days */}
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": timeLeft.days } as React.CSSProperties}></span>
                    </span>
                    {t('countdown.days')}
                </div>
                {/* Hours */}
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": timeLeft.hours } as React.CSSProperties}></span>
                    </span>
                    {t('countdown.hours')}
                </div>
                {/* Minutes */}
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": timeLeft.minutes } as React.CSSProperties}></span>
                    </span>
                    {t('countdown.minutes')}
                </div>
                {/* Seconds */}
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                        <span style={{ "--value": timeLeft.seconds } as React.CSSProperties}></span>
                    </span>
                    {t('countdown.seconds')}
                </div>
            </div>
            <div className="text-base-200 mx-auto mt-2 md:w-32 md:ml-3">
                <p className="text-xl md:text-xl text-center md:text-left">{t('countdown.until')}</p>
            </div>
        </div>
    );
};

export default Countdown;