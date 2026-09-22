import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../+types/root";
import styles from "./error-boundary.module.css";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className={styles.errorBoundary}>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>{message}</h1>
        <p className={styles.errorDetails}>{details}</p>

        {stack && (
          <div className={styles.errorStackWrapper}>
            <button
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(stack);
              }}
            >
              Copy
            </button>
            <pre className={styles.errorStack}>
              <code>{stack}</code>
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
