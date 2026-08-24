import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './components/splash/SplashScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { MyPoolScreen } from './components/my-pool/MyPoolScreen';
import { WaterTestScreen } from './components/water-test/WaterTestScreen';
import { CalculatorScreen } from './components/calculator/CalculatorScreen';
import { MyProductsScreen } from './components/products/MyProductsScreen';
import { AddProductScreen } from './components/products/AddProductScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { SideDrawer } from './components/common/SideDrawer';
import { NotificationsModal } from './components/common/NotificationsModal';
import { AppTab } from './types/navigation';
import { Pool } from './types/pool';
import { getSavedPools, getActivePoolId } from './utils/poolStorage';
import { getStoredSettings, saveStoredSettings, AppSettings } from './utils/settingsStorage';
import { ensureProductsDatabaseInitialized } from './utils/productStorage';
import { initializeAndroidFullscreen } from './utils/androidFullscreen';

export default function App() {
  useEffect(() => {
    ensureProductsDatabaseInitialized();
    initializeAndroidFullscreen();
  }, []);

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [pools, setPools] = useState<Pool[]>(() => getSavedPools());
  const [activePoolId, setActivePoolIdState] = useState<string | null>(() => getActivePoolId());
  const [myPoolEditorMode, setMyPoolEditorMode] = useState<'add' | 'edit' | null>(null);
  const [editingPoolId, setEditingPoolId] = useState<string | null>(null);
  const [productEditorMode, setProductEditorMode] = useState<'add' | 'edit' | null>(null);
  const [editingManufacturerId, setEditingManufacturerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = React.useMemo(() => {
    if (settings.theme === 'dark') return true;
    if (settings.theme === 'light') return false;
    return systemIsDark;
  }, [settings.theme, systemIsDark]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    setPools(getSavedPools());
    setActivePoolIdState(getActivePoolId());
  }, []);

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    const updated = saveStoredSettings(newPartial);
    setSettings(updated);
  };

  const activePool: Pool | null = React.useMemo(() => {
    if (pools.length === 0) return null;
    if (activePoolId) {
      const found = pools.find((p) => p.id === activePoolId);
      if (found) return found;
    }
    return pools[0];
  }, [pools, activePoolId]);

  const handleSplashFinish = () => setShowSplash(false);
  const handleReplaySplash = () => setShowSplash(true);

  const handlePoolsChanged = (updatedPools: Pool[], newActiveId: string | null) => {
    setPools(updatedPools);
    setActivePoolIdState(newActiveId);
    setMyPoolEditorMode(null);
    setEditingPoolId(null);
  };

  const handleAddNewPoolFromHome = () => {
    setEditingPoolId(null);
    setMyPoolEditorMode('add');
    setActiveTab('my-pool');
  };

  const handleEditPoolFromHome = (pool: Pool) => {
    setEditingPoolId(pool.id);
    setMyPoolEditorMode('edit');
    setActiveTab('my-pool');
  };

  const handleSelectTab = (tab: AppTab) => {
    setMyPoolEditorMode(null);
    setEditingPoolId(null);
    setProductEditorMode(null);
    setEditingManufacturerId(null);
    setActiveTab(tab);
  };

  const handleBackToHome = () => {
    setMyPoolEditorMode(null);
    setEditingPoolId(null);
    setProductEditorMode(null);
    setEditingManufacturerId(null);
    setActiveTab('home');
  };

  const handleSaveProducts = () => {
    setProductEditorMode(null);
    setEditingManufacturerId(null);
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans overflow-hidden">
      <div
        id="app-root-device"
        className={`relative w-full max-w-md h-[100dvh] sm:min-h-[780px] sm:max-h-[920px] bg-white dark:bg-slate-900 sm:rounded-[36px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_0_10px_rgba(30,41,59,0.8)] sm:ring-1 sm:ring-slate-700/50 flex flex-col overflow-hidden transition-colors ${isDark ? 'dark' : ''}`}
      >
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} durationMs={2000} />
        ) : (
          <div className="relative w-full h-full min-h-0 flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-colors">
            {!productEditorMode && !myPoolEditorMode && (
              <Header
                onOpenMenu={() => setIsSideMenuOpen(true)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                unreadNotificationsCount={settings.notificationsEnabled ? 1 : 0}
              />
            )}

            <main className="min-h-0 flex-1 overflow-y-auto no-scrollbar bg-[#FCFDFF] dark:bg-slate-900 transition-colors pb-[76px]">
              {activeTab === 'home' && (
                <HomeScreen
                  activePool={activePool}
                  onAddPool={handleAddNewPoolFromHome}
                  onEditPool={handleEditPoolFromHome}
                  onNavigateTab={handleSelectTab}
                  onOpenProducts={() => {
                    setProductEditorMode(null);
                    setEditingManufacturerId(null);
                    setActiveTab('my-products');
                  }}
                />
              )}

              {activeTab === 'my-pool' && (
                <MyPoolScreen
                  pools={pools}
                  activePoolId={activePool?.id || null}
                  onPoolsChanged={handlePoolsChanged}
                  onBackToHome={handleBackToHome}
                  initialEditorMode={myPoolEditorMode}
                  editingPoolId={editingPoolId}
                />
              )}

              {activeTab === 'water-test' && (
                <WaterTestScreen
                  activePool={activePool}
                  allPools={pools}
                  onNavigateToCalculator={() => handleSelectTab('calculator')}
                  onNavigateToAddPool={handleAddNewPoolFromHome}
                  onSelectActivePoolId={(id) => setActivePoolIdState(id)}
                />
              )}

              {activeTab === 'calculator' && (
                <CalculatorScreen
                  activePool={activePool}
                  allPools={pools}
                  onBack={handleBackToHome}
                  onNavigateToWaterTest={() => handleSelectTab('water-test')}
                  onNavigateToProducts={() => {
                    setProductEditorMode(null);
                    setEditingManufacturerId(null);
                    setActiveTab('my-products');
                  }}
                  onSelectActivePoolId={(id) => setActivePoolIdState(id)}
                />
              )}

              {activeTab === 'my-products' && (
                productEditorMode ? (
                  <AddProductScreen
                    editingManufacturerId={editingManufacturerId}
                    onSave={handleSaveProducts}
                    onBack={() => {
                      setProductEditorMode(null);
                      setEditingManufacturerId(null);
                    }}
                  />
                ) : (
                  <MyProductsScreen
                    onAddNewProduct={() => {
                      setEditingManufacturerId(null);
                      setProductEditorMode('add');
                    }}
                    onEditManufacturer={(mfgId) => {
                      setEditingManufacturerId(mfgId);
                      setProductEditorMode('edit');
                    }}
                    onBack={handleBackToHome}
                  />
                )
              )}

              {activeTab === 'settings' && (
                <SettingsScreen
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onBackToHome={handleBackToHome}
                />
              )}
            </main>

            {!productEditorMode && (
              <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
            )}
          </div>
        )}

        <SideDrawer
          isOpen={isSideMenuOpen}
          activeTab={activeTab}
          onClose={() => setIsSideMenuOpen(false)}
          onSelectTab={(tab) => {
            setIsSideMenuOpen(false);
            handleSelectTab(tab);
          }}
          onReplaySplash={handleReplaySplash}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </div>
  );
}
