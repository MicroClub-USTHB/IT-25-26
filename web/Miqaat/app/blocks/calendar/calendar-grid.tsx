import classnames from "classnames";
import type { DayPrayerTimes } from "~/services/api";
import { useLanguage } from "~/i18n/language-context";
import type { TranslationKey } from "~/i18n/translations";
import style from "./calendar-grid.module.css";
import { formatTime } from "~/utils/time-utils";


export interface CalendarGridProps {
  className?: string;
  data: DayPrayerTimes[];
  timeFormat: "12h" | "24h";
}

const PRAYER_COLUMNS = ["Fajr", "Sunrise", "Duha", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;


export function CalendarGrid({ className, data, timeFormat }: CalendarGridProps) {
  const { t, locale } = useLanguage();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr className={style.headerRow}>
              <th className={style.th}>{t("calendar.day")}</th>
              {PRAYER_COLUMNS.map((name) => {
                const key = `prayer.${name}` as TranslationKey;
                return (
                  <th key={name} className={style.th}>
                    {t(key)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isToday = row.date === todayStr;
              return (
                <tr
                  key={row.date}
                  className={classnames(style.row, isToday && style.rowToday)}
                >
                  <td className={classnames(style.td, style.dayCell)}>
                    <div className={style.dayInfo}>
                      <span className={style.dayName}>
                        {new Date(row.date).toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", { weekday: "long" })}
                      </span>
                      <span className={style.dateText}>
                        {new Date(row.date).toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", { day: "numeric", month: "long" })}
                      </span>
                    </div>
                    {isToday && <span className={style.todayBadge}>{t("calendar.today")}</span>}
                  </td>
                  {PRAYER_COLUMNS.map((name) => {
                    const prayer = row.times.find((p) => p.name === name);
                    return (
                      <td key={name} className={style.td}>
                        {prayer ? formatTime(prayer.time, timeFormat, locale) : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
