import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
  }, [locale]);

  return (
    <div className={`app-shell${menuOpen ? ' menu-open' : ''}`} data-component="app-shell" data-locale={locale}>
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
        <div className="header-actions">
          <button
            type="button"
            className="menu-trigger"
            aria-label={menuOpen ? (locale === 'fa' ? 'بستن منو' : 'Close menu') : (locale === 'fa' ? 'باز کردن منو' : 'Open menu')}
            aria-expanded={menuOpen}
            aria-controls="yasin-settings-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">☰</span>
            <span className="sr-only">{menuOpen ? (locale === 'fa' ? 'بستن' : 'Close') : (locale === 'fa' ? 'منو' : 'Menu')}</span>
          </button>
        </div>
      </header>
      {menuOpen && (
        <>
          <button className="menu-backdrop" type="button" aria-label={locale === 'fa' ? 'بستن منو' : 'Close menu'} onClick={() => setMenuOpen(false)} />
          <aside id="yasin-settings-menu" className="settings-drawer" aria-label={locale === 'fa' ? 'تنظیمات و گزینه‌ها' : 'Settings and options'}>
            <div className="settings-drawer-header">
              <div>
                <strong>{locale === 'fa' ? 'گزینه‌ها' : 'Options'}</strong>
                <span>{locale === 'fa' ? 'تنظیمات بازی و صفحه' : 'Game and board settings'}</span>
              </div>
              <button type="button" className="menu-close" onClick={() => setMenuOpen(false)} aria-label={locale === 'fa' ? 'بستن' : 'Close'}>×</button>
            </div>
            <div className="settings-drawer-content">{sidebar}</div>
          </aside>
        </>
      )}
      {banner}
      <main className="app-main">{children}</main>
    </div>
  );
}
