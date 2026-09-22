import { useState, useEffect, useCallback } from "react";
import { Printer } from "lucide-react";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { fetchMonthlyPrayerTimes, type DayPrayerTimes } from "~/services/api";
import { CalendarGrid } from "../blocks/calendar/calendar-grid";
import { LoadingSkeleton } from "~/components/loading-skeleton/loading-skeleton";
import styles from "./calendar.module.css";

type ViewMode = "weekly" | "monthly";

function getWeekRange(date: Date): { start: number; end: number } {
  const dayOfWeek = date.getDay(); // 0=Sun
  const dateNum = date.getDate();
  const start = dateNum - dayOfWeek;
  const end = start + 6;
  return { start, end };
}

export default function Calendar() {
  const { location, timeFormat } = useAppContext();
  const { t, locale } = useLanguage();
  const [monthData, setMonthData] = useState<DayPrayerTimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchMonthlyPrayerTimes(
      location.cityId,
      currentDate.getFullYear(),
      currentDate.getMonth(),
    ).then((data) => {
      if (!cancelled) {
        setMonthData(data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setError(t("calendar.error") ?? "Failed to load calendar data.");
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [location, currentDate.getFullYear(), currentDate.getMonth(), retryCount, t]);

  const monthName = currentDate.toLocaleDateString(
    locale === "ar" ? "ar-DZ" : "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "weekly") {
        d.setDate(d.getDate() - 7);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "weekly") {
        d.setDate(d.getDate() + 7);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Filter data based on view mode
  const displayData = viewMode === "weekly"
    ? (() => {
      const { start, end } = getWeekRange(currentDate);
      return monthData.filter((d) => d.day >= start && d.day <= end);
    })()
    : monthData;

  const title = viewMode === "weekly" ? t("calendar.weekTitle") : t("calendar.title");

  return (
    <main className={styles.root}>
      <h1 className={styles.pageTitle}>{title}</h1>

      {/* View mode toggle + Print */}
      <div className={styles.toolbar}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === "weekly" ? styles.toggleBtnActive : ""}`}
            onClick={() => setViewMode("weekly")}
          >
            {t("calendar.weekly")}
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === "monthly" ? styles.toggleBtnActive : ""}`}
            onClick={() => setViewMode("monthly")}
          >
            {t("calendar.monthly")}
          </button>
        </div>
        <button className={styles.printBtn} onClick={handlePrint} aria-label="Print">
          <Printer size={16} />
          <span>{t("calendar.print")}</span>
        </button>
      </div>

      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={handlePrev} aria-label="Previous">
          ‹
        </button>
        <span className={styles.monthLabel}>{monthName}</span>
        <button className={styles.monthBtn} onClick={handleNext} aria-label="Next">
          ›
        </button>
      </div>
      {isLoading ? (
        <LoadingSkeleton rows={10} />
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => setRetryCount(c => c + 1)}
          >
            {t("error.retry")}
          </button>
        </div>
      ) : (
        <CalendarGrid data={displayData} timeFormat={timeFormat} />
      )}
    </main>
  );
}
