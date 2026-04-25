import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { SearchHeader } from "../blocks/location-selection/search-header";
import { GPSLocationButton } from "../blocks/location-selection/gps-location-button";
import { WilayaSelector } from "../blocks/location-selection/wilaya-baladiya-selector";
import { Toast } from "~/components/toast/toast";
import { useAppContext } from "~/context/app-context";
import { useLocationSelection } from "~/hooks/use-location-selection";
import { useLanguage } from "~/i18n/language-context";

export default function LocationSelection() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setLocation } = useAppContext();
  const locationState = useLocationSelection();
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const handleGPSDetect = useCallback(() => {
    locationState.detectGPSLocation();
  }, [locationState]);

  // Show success state when GPS finds a location
  const isGPSSuccess =
    gpsSuccess ||
    (!locationState.isDetectingGPS &&
      !locationState.gpsError &&
      locationState.selectedWilaya !== null);

  const handleConfirm = () => {
    const loc = locationState.getSelectedLocation();
    if (loc) {
      setLocation(loc);
      setGpsSuccess(true);
      navigate("/");
    }
  };

  const canConfirm = locationState.selectedWilaya !== null;

  return (
    <div className="w-full flex items-center justify-center px-4 py-12 md:py-24 bg-[#f8fafc] dark:bg-[#09090b] relative">
      {/* Decorative backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-zinc-800 p-5 md:p-14 flex flex-col gap-8 md:gap-10 animate-in fade-in zoom-in duration-1000 relative z-40 mx-auto">
        <SearchHeader />
        
        <div className="flex flex-col gap-8">
          <GPSLocationButton
            isDetecting={locationState.isDetectingGPS}
            isSuccess={isGPSSuccess && !locationState.isDetectingGPS && canConfirm}
            onDetect={handleGPSDetect}
            onClear={locationState.clearSelection}
          />
          
          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t-2 border-slate-200 dark:border-zinc-700 shadow-sm"></div>
            <span className="flex-shrink-0 mx-8 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white px-8 py-3 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl border-2 border-slate-100 dark:border-zinc-700 transform hover:scale-110 transition-transform duration-500">
              {t("location.or") || "أو"}
            </span>
            <div className="flex-grow border-t-2 border-slate-200 dark:border-zinc-700 shadow-sm"></div>
          </div>
          
          <WilayaSelector
            wilayas={locationState.wilayas}
            selectedWilaya={locationState.selectedWilaya}
            isLoadingWilayas={locationState.isLoadingWilayas}
            onWilayaChange={locationState.selectWilaya}
            onConfirm={handleConfirm}
            canConfirm={canConfirm}
            fetchError={locationState.fetchError}
            onRetry={locationState.retryFetch}
            onClear={locationState.clearSelection}
          />
        </div>

        {locationState.gpsError && (
          <Toast
            message={locationState.gpsError}
            title="GPS Unavailable"
            type="error"
            onClose={locationState.clearGpsError}
          />
        )}
      </main>
    </div>
  );
}
