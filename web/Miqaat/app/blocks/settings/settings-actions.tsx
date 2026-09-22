import { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import style from "./settings-actions.module.css";

export interface SettingsActionsProps {
  className?: string;
  onSave: () => void;
  onReset: () => void;
  isDirty?: boolean;
  isSaving?: boolean;
}

export function SettingsActions({ className, onSave, onReset, isDirty, isSaving }: SettingsActionsProps) {
  const { t } = useLanguage();

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.buttons}>
        <button
          className={classnames(style.saveBtn, isSaving && style.saveBtnLoading)}
          onClick={onSave}
          disabled={!isDirty || isSaving}
          aria-label={t("settings.save")}
        >
          {isSaving ? (
            <span className={style.loaderContainer}>
              <Loader size={16} className="animate-spin" />
              {t("settings.saving")}
            </span>
          ) : (
            t("settings.save")
          )}
        </button>
        <button 
          className={style.resetBtn} 
          onClick={onReset} 
          disabled={isSaving}
          aria-label={t("settings.reset")}
        >
          {t("settings.reset")}
        </button>
      </div>
      {isDirty && !isSaving && (
        <div className={style.dirtyIndicator} role="status">
          <AlertCircle size={14} />
          {t("settings.unsavedChanges")}
        </div>
      )}
    </div>
  );
}


