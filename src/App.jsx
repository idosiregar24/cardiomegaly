import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import SistemArsitektur from './components/SistemArsitektur';
import HistoryAnalytics from './components/HistoryAnalytics';
import Settings from './components/Settings';
import KarakteristikData from './components/KarakteristikData';
import BiodataTim from './components/BiodataTim';
import PublicPortal from './components/PublicPortal';
import NgrokScanner from './components/NgrokScanner';
import { TranslationProvider, useTranslation } from './lib/TranslationContext';
import { LanguageSwitcherFAB } from './components/LanguageSwitcher';

/* ─── Inner app — needs TranslationProvider ancestor ─── */
function AppInner() {
  const { t } = useTranslation();
  const [viewMode,    setViewMode]    = useState('portal'); // 'portal' | 'admin'
  const [currentTab,  setCurrentTab]  = useState('dashboard');
  const [activeResult, setActiveResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menentukan judul header halaman aktif
  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'dashboard':     return t('header_dashboard');
      case 'upload':        return t('header_upload');
      case 'karakteristik': return t('header_dashboard');
      case 'history':       return t('header_history');
      case 'biodata':       return t('header_dashboard');
      case 'settings':      return t('header_settings');
      default:              return t('appName');
    }
  };

  // Fungsi saat tombol "Detail" diklik dari dashboard atau histori
  const handleViewDetail = (patient) => {
    setActiveResult(patient);
    setCurrentTab('upload');
  };

  if (viewMode === 'portal') {
    return (
      <>
        <PublicPortal onEnterAdmin={() => setViewMode('admin')} />
        {/* Floating language button visible on landing page */}
        <LanguageSwitcherFAB />
      </>
    );
  }

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false); // Close drawer when clicking a tab
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-full overflow-x-hidden" style={{ background: '#f4f7fb' }}>

      {/* Sidebar Navigasi (Samping untuk Desktop, Bawah untuk Mobile) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleSelectTab}
        onExit={() => { setViewMode('portal'); setMobileMenuOpen(false); }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 flex flex-col min-h-screen max-w-full overflow-x-hidden">

        {/* Header Atas — pass currentTab agar ikon & deskripsi ikut berubah */}
        <Header title={getHeaderTitle()} currentTab={currentTab} onToggleMenu={() => setMobileMenuOpen(v => !v)} />

        {/* Content Canvas */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-8 flex-1">

          {/* Tab: Dashboard */}
          {currentTab === 'dashboard' && (
            <>
              <DashboardOverview
                onViewDetail={handleViewDetail}
                setCurrentTab={handleSelectTab}
              />
              <SistemArsitektur />
            </>
          )}

          {/* Tab: Unggah & Analisis */}
          {currentTab === 'upload' && (
            <div className="space-y-6">
              <NgrokScanner
                initialResult={activeResult}
                onClearInitialResult={() => setActiveResult(null)}
              />
            </div>
          )}

          {/* Tab: Karakteristik Data */}
          {currentTab === 'karakteristik' && <KarakteristikData />}

          {/* Tab: Rekam Medis / Histori */}
          {currentTab === 'history' && (
            <HistoryAnalytics onViewDetail={handleViewDetail} />
          )}

          {/* Tab: Biodata Kelompok */}
          {currentTab === 'biodata' && <BiodataTim />}

          {/* Tab: Pengaturan */}
          {currentTab === 'settings' && <Settings />}

        </div>
      </main>

      {/* Floating language switcher — visible on all admin pages */}
      <LanguageSwitcherFAB />
    </div>
  );
}

/* ─── Root — wraps everything in the translation provider ─── */
function App() {
  return (
    <TranslationProvider>
      <AppInner />
    </TranslationProvider>
  );
}

export default App;
