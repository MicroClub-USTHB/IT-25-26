import { Moon, Sun, Cloud, Sunrise, Sunset, Star, AlertTriangle, SunDim } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { usePrayerStatus } from "~/hooks/use-prayer-status";
import type { TranslationKey } from "~/i18n/translations";
import style from "./current-prayer-highlight.module.css";
import { formatTime } from "~/utils/time-utils";


export interface CurrentPrayerHighlightProps {
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


export function CurrentPrayerHighlight({ className }: CurrentPrayerHighlightProps) {
  const { currentPrayer, prayerTimes, timeFormat } = useAppContext();
  const { t, locale } = useLanguage();
  const prayerStatus = usePrayerStatus(prayerTimes);

  if (!currentPrayer) return null;

  const prayerKey = `prayer.${currentPrayer.name}` as TranslationKey;
  let displayName = t(prayerKey);
  let displayIcon = PRAYER_ICONS[currentPrayer.icon] ?? <Star size={28} />;

  if (prayerStatus === "forbidden") {
    displayName = t("home.forbiddenPrayer");
    displayIcon = <AlertTriangle size={28} />;
  } else if (prayerStatus === "duha") {
    displayName = t("home.duha");
    displayIcon = <SunDim size={28} />;
  }

  return (
    <div className={classnames(style.root, "transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className={style.header}>
        <span className={style.headerLabel}>{t("home.currentPrayer")}</span>
      </div>

      <div className={style.content}>
        <div className={style.iconWrapper}>
          {displayIcon}
        </div>
        <div className={style.name}>{displayName}</div>
      </div>

      <div className={style.footer}>
        <div className={style.timeLabel}>{t("home.prayerTime")}</div>
        <div className={style.time}>
          {(() => {
            const timeStr = formatTime(currentPrayer.time, timeFormat, locale);
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
    </div>
  );
}
