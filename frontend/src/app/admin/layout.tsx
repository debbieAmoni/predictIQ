'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../lib/hooks/useI18n';
import { useActiveNavItem } from '../../../hooks/useActiveNavItem';
import '../../styles/admin.css';

function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [key, setKey] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const k = sessionStorage.getItem('predictiq-admin-key');
    if (k) {
      setKey(k);
      fetch('/api/v1/admin/session', { headers: { 'X-API-Key': k } })
        .then((r) => setOk(r.ok))
        .catch(() => setOk(false));
    }
  }, []);

  if (!ok) {
    return (
      <form
        className="admin-auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          sessionStorage.setItem('predictiq-admin-key', key);
          setOk(true);
        }}
      >
        <label>
          {t('admin.apiKey')}
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            type="password"
          />
        </label>
        <button type="submit">{t('admin.continue')}</button>
      </form>
    );
  }

  return <>{children}</>;
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  const isActive = useActiveNavItem(href);
  return (
    <Link
      href={href}
      className={`admin-nav-link ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/admin/email/preview', label: t('admin.emailPreview') },
    { href: '/admin/email/analytics', label: t('admin.emailAnalytics') },
    { href: '/admin/blockchain/replay', label: t('admin.blockchainReplay') },
    { href: '/admin/content', label: t('admin.contentManagement') },
    { href: '/admin/audit', label: t('admin.auditLog') },
    { href: '/admin/api-keys', label: t('admin.apiKeys') },
  ];

  return (
    <AdminAuthGate>
      <div className="admin-layout">
        {/* Skip navigation for accessibility */}
        <a href="#admin-main-content" className="skip-link">
          {t('admin.skipToContent')}
        </a>

        {/* Admin Top Navigation */}
        <header className="admin-header" role="banner">
          <div className="admin-header-container">
            <div className="admin-brand-inner">
              <Link href="/" className="admin-brand" aria-label={t('admin.home')}>
                <span className="admin-brand-name">
                  Predict<span className="admin-brand-name-accent">IQ</span>
                </span>
              </Link>
              <span className="admin-brand-badge">{t('admin.badge')}</span>
            </div>

            <nav className="admin-nav" aria-label={t('admin.subNav')}>
              {navItems.map((item) => (
                <AdminNavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>

            <div>
              <Link href="/" className="admin-exit-link">
                {t('appShell.exitToSite')}
              </Link>
            </div>
          </div>
        </header>

        {/* Main Admin Content */}
        <main id="admin-main-content" className="admin-main" role="main">
          {children}
        </main>
      </div>
    </AdminAuthGate>
  );
}
