import { useEffect } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import classnames from "classnames";
import styles from "./toast.module.css";

export interface ToastProps {
  className?: string;
  message: string;
  title?: string;
  type?: "error" | "success";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  className,
  message,
  title,
  type = "error",
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isError = type === "error";

  return (
    <div className={classnames(styles.overlay, className)} role="alert" aria-live="assertive">
      <div
        className={classnames(
          styles.root,
          isError ? styles.rootError : styles.rootSuccess
        )}
      >
        <div className={classnames(styles.icon, isError ? styles.iconError : styles.iconSuccess)}>
          {isError ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
        </div>
        <div className={styles.content}>
          {title && <div className={styles.title}>{title}</div>}
          <div className={styles.message}>{message}</div>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
