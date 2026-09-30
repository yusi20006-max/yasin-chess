import type {ReactNode} from 'react';
import {useEffect} from 'react';
import type {Locale} from '../app/i18n';

type AppShellProps = {
  children: ReactNode;
  /** Header actions / settings (theme, language, mode selectors). */
  sidebar?: ReactNode;
  locale?: Locale;
  /** Optional status strip under the header (offline banner, etc.). */
  banner?: ReactNode;
};

/**
 * Application shell — Phase 2 architecture boundary.
 * Owns chrome only: brand, locale direction, main region.
 * Must not own domain persistence or chess rules.
 */
export default function AppShell({children, sidebar, locale = 'fa', banner}: AppShellProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
  }, [locale]);

  return (
    <div className="app-shell" data-component="app-shell" data-locale={locale}>
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            ♞
          </div>
          <div>
            <h1>Yasin Chess</h1>
            <p>{locale === 'fa' ? 'پلتفرم شطرنج آفلاین' : 'Offline-first chess platform'}</p>
          </div>
        </div>
        <div className="header-actions">{sidebar}</div>
      </header>
      {banner}
      <main className="app-main">{children}</main>
    </div>
  );
}
