import { Moon, Sun, Cloud, Sunrise, Sunset, Star, SunDim } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import type { TranslationKey } from "~/i18n/translations";
import style from "./prayer-times-grid.module.css";
import { formatTime } from "~/utils/time-utils";


export interface PrayerTimesGridProps {
  className?: string;
}

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  moon: <Moon size={28} />,
  sun: <Sun size={28} />,
  "sun-dim": <SunDim size={28} />,
  sunrise: <Sunrise size={28} />,
  sunset: <Sunset size={28} />,
  "cloud-sun": <Cloud size={28} />,
  star: <Star size={28} />,
};


export function PrayerTimesGrid({ className }: PrayerTimesGridProps) {
  const { prayerTimes, currentPrayer, timeFormat } = useAppContext();
  const { t, locale } = useLanguage();

  // Filter for only the 5 obligatory prayers + Duha (excluding Sunrise)
  const mainPrayers = ["Fajr", "Duha", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const displayPrayers = prayerTimes.filter((p) => mainPrayers.includes(p.name));

  return (
    <div className={classnames(style.wrapper, className)}>
      <div className={style.sectionTitle}>— {t("home.schedule")} —</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-[1400px]">
        {displayPrayers.map((prayer) => {
          const isActive = prayer.isPrayer && currentPrayer?.name === prayer.name;
          const prayerKey = `prayer.${prayer.name}` as TranslationKey;

          return (
            <div
              key={prayer.name}
              className={classnames(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                isActive
                  ? style.cardActive
                  : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              )}
            >
              {isActive && (
                <div className={style.activeBadge}>
                  {t("home.now")}
                </div>
              )}
              <div className={style.iconWrapper}>
                {PRAYER_ICONS[prayer.icon] ?? <Star size={28} />}
              </div>
              <div className={style.prayerName}>
                {t(prayerKey)}
              </div>
              <div className={style.prayerTime}>
                {(() => {
                  const timeStr = formatTime(prayer.time, timeFormat, locale);
                  const parts = timeStr.split(" ");
                  if (parts.length > 1) {
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className={style.periodPart}>{parts[1]}</span>
                      </>
                    );
                  }
                  return <span>{timeStr}</span>;
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
