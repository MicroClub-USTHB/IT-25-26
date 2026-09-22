import { Navigation, Loader, CheckCircle } from "lucide-react";
import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import style from "./gps-location-button.module.css";

export interface GPSLocationButtonProps {
  className?: string;
  isDetecting: boolean;
  isSuccess: boolean;
  onDetect: () => void;
  onClear?: () => void;
}

export function GPSLocationButton({
  className,
  isDetecting,
  isSuccess,
  onDetect,
  onClear,
}: GPSLocationButtonProps) {
  const { t } = useLanguage();

  if (isSuccess) {
    return (
      <div 
        className={classnames("w-full flex items-center justify-between rounded-2xl py-5 px-6 shadow-xl animate-in zoom-in duration-500", className)}
        style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#059669' }}
      >
        <div className="flex items-center gap-3 font-black w-full justify-center">
          <CheckCircle size={24} className="animate-in slide-in-from-left-2" />
          <span className="text-lg tracking-tight">{t("location.gps.success")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classnames("w-full group", className)}>
      <button
        className={classnames(
          "w-full flex items-center justify-center gap-4 py-5 min-h-[64px] rounded-2xl font-black transition-all duration-500 shadow-2xl",
          "hover:scale-[1.03] active:scale-[0.97] active:shadow-inner",
          isDetecting ? "cursor-wait opacity-80" : "cursor-pointer"
        )}
        style={{ 
          backgroundColor: isDetecting ? '#94a3b8' : '#2563eb', 
          color: '#ffffff',
          border: 'none'
        }}
        onClick={onDetect}
        disabled={isDetecting}
      >
        {isDetecting ? (
          <Loader size={24} className="animate-spin" />
        ) : (
          <div className="bg-white/20 p-2 rounded-lg">
            <Navigation size={24} fill="currentColor" />
          </div>
        )}
        <span className="text-lg tracking-tight font-black">
          {isDetecting ? t("location.gps.detecting") : t("location.gps.detect")}
        </span>
      </button>
    </div>
  );
}
