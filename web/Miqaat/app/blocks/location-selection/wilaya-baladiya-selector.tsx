import { MapPin, Loader, CheckCircle, Search, ChevronDown } from "lucide-react";
import classnames from "classnames";
import { useState, useRef, useEffect } from "react";
import type { Wilaya } from "~/data/prayer-data";
import { useLanguage } from "~/i18n/language-context";
import styles from "./wilaya-baladiya-selector.module.css";

export interface WilayaSelectorProps {
  className?: string;
  wilayas: Wilaya[];
  selectedWilaya: Wilaya | null;
  isLoadingWilayas: boolean;
  onWilayaChange: (wilaya: Wilaya) => void;
  onConfirm: () => void;
  canConfirm: boolean;
  fetchError: string | null;
  onRetry: () => void;
  onClear: () => void;
}

export function WilayaSelector({
  className,
  wilayas,
  selectedWilaya,
  isLoadingWilayas,
  onWilayaChange,
  onConfirm,
  canConfirm,
  fetchError,
  onRetry,
  onClear,
}: WilayaSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredWilayas = wilayas.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.nameAr.includes(searchQuery) ||
    w.id.toString().includes(searchQuery)
  );

  return (
    <div className={classnames("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-4 text-center">
        <label className="flex items-center justify-center gap-2 text-md font-black text-slate-800 dark:text-zinc-200" htmlFor="wilaya-select">
          <div className="bg-blue-600 dark:bg-blue-500 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <MapPin size={18} />
          </div>
          {t("location.wilaya.label")}
        </label>
        
        {isLoadingWilayas ? (
          <div className="flex items-center justify-end gap-2 py-3 text-sm text-slate-400">
            {t("location.wilaya.loading")}
            <Loader size={14} className="animate-spin" />
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className={classnames(
                "w-full flex items-center justify-between border-2 rounded-[1.25rem] px-4 md:px-6 py-5 text-lg font-black text-slate-900 dark:text-white outline-none transition-all duration-500 shadow-xl",
                isOpen 
                  ? "bg-white dark:bg-zinc-800 border-blue-500 ring-4 ring-blue-500/10 shadow-blue-500/10" 
                  : "bg-blue-50/30 dark:bg-blue-900/10 border-slate-100 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:border-blue-400 dark:hover:border-zinc-600 cursor-pointer"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* Balanced Layout for Centering */}
              <div className="w-6 md:w-8 flex-shrink-0" aria-hidden="true" /> 
              <span className="truncate flex-grow text-center px-2">
                {selectedWilaya ? `${selectedWilaya.id}. ${selectedWilaya.name} (${selectedWilaya.nameAr})` : t("location.wilaya.placeholder")}
              </span>
              <ChevronDown size={24} className={classnames("text-blue-500 transition-transform duration-500 flex-shrink-0 w-6 md:w-8", isOpen && "rotate-180")} />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50">
                  <div className="relative">
                    <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg py-2.5 pr-10 pl-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-right"
                      placeholder="ابحث عن ولاية (رقم، اسم عربي أو فرنسي)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {filteredWilayas.length > 0 ? (
                    filteredWilayas.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        className={classnames(
                          "w-full text-right px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between group",
                          selectedWilaya?.id === w.id
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                            : "hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-transparent"
                        )}
                        onClick={() => {
                          onWilayaChange(w);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="flex-shrink-0 text-slate-400 dark:text-zinc-500 font-medium text-xs group-hover:text-slate-500 transition-colors">{w.id}. {w.name}</span>
                        <span className="truncate pl-4">{w.nameAr}</span>
                      </button>
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm font-medium text-slate-500 dark:text-zinc-500 flex flex-col items-center gap-2">
                      <Search size={24} className="text-slate-300 dark:text-zinc-700" />
                      <span>لا توجد نتائج مطابقة لبحثك</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {fetchError && (
          <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-3">{fetchError}</p>
            <button className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 underline" onClick={onRetry}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {canConfirm && (
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-5 min-h-[64px] rounded-2xl font-black transition-all duration-500 shadow-2xl hover:scale-[1.03] active:scale-[0.97] animate-in fade-in slide-in-from-bottom-4"
            style={{ 
              background: 'linear-gradient(135deg, #1a5276 0%, #2980b9 100%)', 
              color: '#ffffff',
              boxShadow: '0 20px 40px -12px rgba(26, 82, 118, 0.4)'
            }}
            onClick={onConfirm}
          >
            <CheckCircle size={24} className="transition-transform group-hover:rotate-12" />
            <span className="text-lg font-black uppercase tracking-tight">{t("location.confirm")}</span>
          </button>
          {onClear && (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 animate-in fade-in"
              onClick={onClear}
            >
              <span className="text-sm font-bold">إلغاء / مسح الموقع</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
