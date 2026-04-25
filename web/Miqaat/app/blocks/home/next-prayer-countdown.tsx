import { Clock } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useCountdown } from "~/hooks/use-countdown";
import { useLanguage } from "~/i18n/language-context";
import type { TranslationKey } from "~/i18n/translations";
import style from "./next-prayer-countdown.module.css";
import { formatTime } from "~/utils/time-utils";


export interface NextPrayerCountdownProps {
  className?: string;
}


export function NextPrayerCountdown({ className }: NextPrayerCountdownProps) {
  const { nextPrayer, timeFormat } = useAppContext();
  const { hours, minutes, seconds } = useCountdown(nextPrayer?.time ?? null);
  const { t, locale } = useLanguage();

  if (!nextPrayer) return null;

  const prayerKey = `prayer.${nextPrayer.name}` as TranslationKey;

  return (
    <div className={classnames(style.root, "transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className={style.header}>
        <Clock size={18} />
        <span className={style.headerLabel}>{t("home.nextPrayer")}</span>
      </div>
      <div className={style.prayerName}>{t(prayerKey)}</div>
      <div className={style.countdown} dir="ltr">
        {hours !== "00" && (
          <>
            <div className={style.unit}>
              <span className={style.digits}>{hours}</span>
              <span className={style.unitLabel}>{t("home.hours")}</span>
            </div>
            <span className={style.separator}>:</span>
          </>
        )}
        {(hours !== "00" || minutes !== "00") && (
          <>
            <div className={style.unit}>
              <span className={style.digits}>{minutes}</span>
              <span className={style.unitLabel}>{t("home.minutes")}</span>
            </div>
            <span className={style.separator}>:</span>
          </>
        )}
        <div className={style.unit}>
          <span className={style.digits}>{seconds}</span>
          <span className={style.unitLabel}>{t("home.seconds")}</span>
        </div>
      </div>
      <div className={style.prayerTime}>
        <span>{t("home.startsAt")}</span>
        <strong className="flex flex-row gap-1">
          {(() => {
            const timeStr = formatTime(nextPrayer.time, timeFormat, locale);
            const parts = timeStr.split(" ");
            if (parts.length > 1) {
              // In RTL, the first element goes to the right and the second goes to the left.
              // So parts[0] (time) is right, parts[1] (AM/PM) is left.
              return (
                <>
                  <span>{parts[0]}</span>
                  <span className={style.periodPart}>{parts[1]}</span>
                </>
              );
            }
            return <span>{timeStr}</span>;
          })()}
        </strong>
      </div>
    </div>
  );
}
