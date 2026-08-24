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
import {
  getSavedPools,
  getActivePoolId,
} from './utils/poolStorage';
import {
  getStoredSettings,
  saveStoredSettings,
  AppSettings,
} from './utils/settingsStorage';
import { ensureProductsDatabaseInitialized } from './utils/productStorage';
import { initializeAndroidFullscreen } from './utils/androidFullscreen';

export default function App() {
  // Ensure default products database is initialized on fresh install
  useEffect(() => {
    ensureProductsDatabaseInitialized();
    initializeAndroidFullscreen();
  }, []);

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // App Settings (Theme & Notifications)
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Multi-pool persistent state
  const [pools, setPools] = useState<Pool[]>(() => getSavedPools());
  const [activePoolId, setActivePoolIdState] = useState<string | null>(() => getActivePoolId());

  // Deep-linking / direct mode for MyPool screen
  const [myPoolEditorMode, setMyPoolEditorMode] = useState<'add' | 'edit' | null>(null);
  const [editingPoolId, setEditingPoolId] = useState<string | null>(null);

  // Deep-linking / direct mode for MyProducts screen
  const [productEditorMode, setProductEditorMode] = useState<'add' | 'edit' | null>(null);
  const [editingManufacturerId, setEditingManufacturerId] = useState<string | null>(null);

  // Listen to system dark mode preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective dark mode
  const isDark = React.useMemo(() => {
    if (settings.theme === 'dark') return true;
    if (settings.theme === 'light') return false;
    return systemIsDark;
  }, [settings.theme, systemIsDark]);

  // Apply dark class to document root element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Initial sync
    const loadedPools = getSavedPools();
    const loadedActiveId = getActivePoolId();
    setPools(loadedPools);
    setActivePoolIdState(loadedActiveId);
  }, []);

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    const updated = saveStoredSettings(newPartial);
    setSettings(updated);
  };

  // Compute active pool object
  const activePool: Pool | null = React.useMemo(() => {
    if (pools.length === 0) return null;
    if (activePoolId) {
      const found = pools.find((p) => p.id === activePoolId);
      if (found) return found;
    }
    return pools[0];
  }, [pools, activePoolId]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleReplaySplash = () => {
    setShowSplash(true);
  };

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans">
      {/* Mobile Device Frame for Desktop / Fullscreen on Mobile */}
      <div
        id="app-root-device"
        className={`w-full max-w-md bg-white dark:bg-slate-900 sm:rounded-[36px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_0_10px_rgba(30,41,59,0.8)] sm:ring-1 sm:ring-slate-700/50 min-h-screen sm:min-h-[780px] sm:max-h-[920px] flex flex-col overflow-hidden relative transition-colors ${
          isDark ? 'dark' : ''
        }`}
      >
        {showSplash ? (
          /* 1. Splash / Loading Screen */
          <SplashScreen onFinish={handleSplashFinish} durationMs={2000} />
        ) : (
          /* 2. Main App Screen */
          <div className="w-full h-full flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-colors">
            {/* App Header (Hamburger, Title, Notifications) - only show on root tab screens when not in full-page form */}
            {!productEditorMode && !myPoolEditorMode && (
              <Header
                onOpenMenu={() => setIsSideMenuOpen(true)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                unreadNotificationsCount={settings.notificationsEnabled ? 1 : 0}
              />
            )}

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar bg-[#FCFDFF] dark:bg-slate-900 transition-colors">
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
                  onNavigateToCalculator={() => {
                    handleSelectTab('calculator');
                  }}
                  onNavigateToAddPool={handleAddNewPoolFromHome}
                  onSelectActivePoolId={(id) => setActivePoolIdState(id)}
                />
              )}

              {activeTab === 'calculator' && (
                <CalculatorScreen
                  activePool={activePool}
                  allPools={pools}
                  onBack={handleBackToHome}
                  onNavigateToWaterTest={() => {
                    handleSelectTab('water-test');
                  }}
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

            {/* Bottom Navigation Bar */}
            {!productEditorMode && (
              <BottomNav
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
              />
            )}
          </div>
        )}

        {/* Side Menu Drawer */}
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

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </div>
  );
}
