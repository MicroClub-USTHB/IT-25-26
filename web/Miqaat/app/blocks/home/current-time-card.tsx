import classnames from "classnames";
import { useClock } from "~/hooks/use-clock";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import style from "./current-time-card.module.css";

export interface CurrentTimeCardProps {
  className?: string;
}

export function CurrentTimeCard({ className }: CurrentTimeCardProps) {
  const { timeFormat } = useAppContext();
  const { locale } = useLanguage();
  const { timeOnly, period, hijriDate } = useClock(timeFormat, locale);

  return (
    <div className={classnames(style.root, "transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <div className={style.timeWrapper}>
        <div 
          className={style.time} 
          style={{ 
            display: "flex", 
            alignItems: "baseline", 
            justifyContent: "center", 
            gap: "12px", 
            direction: "ltr" 
          }}
        >
          {period && (
            <span style={{ fontSize: "0.6em", fontWeight: "normal" }}>
              {period}
            </span>
          )}
          <span dir="ltr">{timeOnly}</span>
        </div>
        <div className={style.hijri}>{hijriDate}</div>
      </div>
    </div>
  );
}
