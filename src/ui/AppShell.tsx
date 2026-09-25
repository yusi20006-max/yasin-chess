import type {ReactNode} from 'react';

type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export default function AppShell({children, sidebar}: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">♞</div>
          <div>
            <h1>Yasin Chess</h1>
            <p>Offline-first chess platform</p>
          </div>
        </div>
        <div className="header-actions">{sidebar}</div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
