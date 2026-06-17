/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './components/DashboardView';
import { StockLedgerView } from './components/StockLedgerView';
import { BuyView } from './components/BuyView';
import { SellView } from './components/SellView';
import { BuyLedgerView } from './components/BuyLedgerView';
import { SellLedgerView } from './components/SellLedgerView';
import { SettingsView } from './components/SettingsView';
import { WalletsView } from './components/WalletsView';
import { BellRing, CheckCircle2, AlertTriangle, Info, X, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/LoginView';

const MainScreen: React.FC = () => {
  const { activeView, toasts, removeToast, theme } = useLedger();

  // Switch workspace content beautifully based on state view parameter
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'buy':
        return <BuyView />;
      case 'sell':
        return <SellView />;
      case 'inventory':
        return <StockLedgerView />;
      case 'buy-ledger':
        return <BuyLedgerView />;
      case 'sell-ledger':
        return <SellLedgerView />;
      case 'settings':
        return <SettingsView />;
      case 'wallets':
        return <WalletsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden flex-col select-none transition-colors duration-200 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#090d16] text-slate-100'
    }`}>
      
      {/* Universal Top Header: Spans full width, logo in the top left */}
      <Header />

      {/* Sub-container containing Sidebar & content viewport */}
      <div className="flex-1 flex min-w-0 overflow-hidden relative">
        
        {/* 1. Left hand columns sidebar: Sticky on Desktop, hidden on Mobile */}
        <Sidebar />

        {/* 2. Main content viewport shell container */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-colors duration-200 ${
          theme === 'light' ? 'bg-slate-50' : 'bg-[#090d16]'
        }`}>
          {/* Primary content area panel */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
            <div className="max-w-7xl mx-auto">
              {renderViewContent()}
            </div>
          </main>

          {/* 3. Bottom Tabs navigation drawer: Sticky on Mobile, hidden on Desktop */}
          <MobileNav />
        </div>

      </div>

      {/* Interactive Floater Toasts system overlay corner */}
      <div 
        id="toast-notification-system-dock" 
        className="fixed bottom-28 md:bottom-6 right-4 left-4 md:left-auto z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => {
          const getToneStyles = () => {
            if (toast.type === 'error') return 'border-rose-500/30 bg-rose-950/90 text-rose-200';
            if (toast.type === 'info') return 'border-amber-500/30 bg-amber-950/90 text-amber-200';
            return 'border-emerald-500/30 bg-[#0e1716]/95 text-emerald-200';
          };

          const getIcon = () => {
            if (toast.type === 'error') return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
            if (toast.type === 'info') return <Info className="w-4 h-4 text-amber-400 shrink-0" />;
            return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          };

          return (
            <div
              key={toast.id}
              className={`p-3.5 text-xs font-bold border rounded-xl shadow-2xl flex items-start gap-3 pointer-events-auto backdrop-blur-md transition-all duration-305 ${getToneStyles()}`}
            >
              {getIcon()}
              <div className="flex-1 leading-relaxed">{toast.message}</div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-200 p-0.5 rounded cursor-pointer transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col items-center justify-center p-4 relative font-sans select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        <div className="text-center space-y-4 relative z-10">
          <div className="relative inline-flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            <div className="absolute inset-0 rounded-full blur bg-cyan-500/20"></div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-slate-500">
            Initializing Encrypted Cloud Sandbox Profile ...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onSuccess={() => {}} />;
  }

  return <MainScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <LedgerProvider>
        <AppContent />
      </LedgerProvider>
    </AuthProvider>
  );
}
