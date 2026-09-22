import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import colorSchemeApi from "@dazl/color-scheme/client?url";
import { ErrorBoundary as ErrorBoundaryRoot } from "~/components/error-boundary/error-boundary";
import "./styles/reset.css";
import "./styles/global.css";
import "./styles/theme.css";
import { useColorScheme } from "@dazl/color-scheme/react";

import styles from "./root.module.css";
import { NavigationHeader } from "./blocks/__global/navigation-header";
import { FooterInformation } from "./blocks/__global/footer-information";
import { AppProvider } from "./context/app-context";
import { LanguageProvider, useLanguage } from "./i18n/language-context";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/logo.jpg", type: "image/jpeg" },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@400;500;600&family=Roboto+Mono:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Changa:wght@200..800&display=swap",
  },
];

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLanguage();
  const { rootCssClass, resolvedScheme } = useColorScheme();
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={rootCssClass} style={{ colorScheme: resolvedScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{locale === "ar" ? "ميقات" : "miqaat"}</title>
        <Meta />
        <script src={colorSchemeApi} data-light-class="light-theme" data-dark-class="dark-theme"></script>
        <Links />
      </head>
      <body className={styles.body}>
        <AppProvider>
          <header>
            <NavigationHeader />
          </header>
          <div className={styles.pageContent}>{children}</div>
          <footer>
            <FooterInformation />
          </footer>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <InnerLayout>{children}</InnerLayout>
    </LanguageProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = ErrorBoundaryRoot;
