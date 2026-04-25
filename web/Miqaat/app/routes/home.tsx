import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { LoadingSkeleton } from "~/components/loading-skeleton/loading-skeleton";
import { LocationDisplay } from "../blocks/home/location-display";
import { CurrentTimeCard } from "../blocks/home/current-time-card";
import { CurrentPrayerHighlight } from "../blocks/home/current-prayer-highlight";
import { NextPrayerCountdown } from "../blocks/home/next-prayer-countdown";
import { PrayerTimesGrid } from "../blocks/home/prayer-times-grid";
import { AdditionalInfoSection } from "../blocks/home/additional-info-section";
import styles from "./home.module.css";

export default function Home() {
  const { isLoading, error, refreshPrayerTimes } = useAppContext();
  const { t } = useLanguage();

  return (
    <main className={styles.root}>
      <LocationDisplay />
      <CurrentTimeCard />
      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => refreshPrayerTimes()}
          >
            {t("error.retry")}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.topGrid}>
            <CurrentPrayerHighlight />
            <NextPrayerCountdown />
          </div>
          <PrayerTimesGrid />
          <AdditionalInfoSection />
        </>
      )}
    </main>
  );
}
