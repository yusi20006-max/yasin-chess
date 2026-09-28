import type {ReactNode} from 'react';
import {useEffect} from 'react';
import type {Locale} from '../app/i18n';

type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  locale?: Locale;
};

export default function AppShell({children, sidebar, locale='fa'}: AppShellProps) {
  useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==='fa'?'rtl':'ltr'},[locale]);
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">♞</div>
          <div>
            <h1>Yasin Chess</h1>
            <p>{locale==='fa'?'پلتفرم شطرنج آفلاین':'Offline-first chess platform'}</p>
          </div>
        </div>
        <div className="header-actions">{sidebar}</div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
