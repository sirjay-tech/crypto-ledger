/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MinusCircle, 
  Database, 
  FileCheck, 
  FileSpreadsheet, 
  Sliders, 
  TrendingUp,
  Cpu,
  Wallet
} from 'lucide-react';
import { ActiveView } from '../types';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, theme } = useLedger();

  const primaryNavItems: { value: ActiveView; label: string; icon: React.ReactNode }[] = [
    { value: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { value: 'wallets', label: 'Wallets & Cash', icon: <Wallet className="w-4 h-4" /> },
    { value: 'buy', label: 'Execute Buy', icon: <PlusCircle className="w-4 h-4" /> },
    { value: 'sell', label: 'Execute Sell', icon: <MinusCircle className="w-4 h-4" /> },
  ];

  const ledgerNavItems: { value: ActiveView; label: string; icon: React.ReactNode }[] = [
    { value: 'inventory', label: 'Active Stock Deck', icon: <Database className="w-4 h-4" /> },
    { value: 'buy-ledger', label: 'Buy Ledger Log', icon: <FileCheck className="w-4 h-4" /> },
    { value: 'sell-ledger', label: 'Sell Ledger Log', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  const controlNavItems: { value: ActiveView; label: string; icon: React.ReactNode }[] = [
    { value: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  const renderNavGroup = (items: typeof primaryNavItems) => {
    return items.map((item) => {
      const isActive = activeView === item.value;
      return (
        <button
          key={item.value}
          id={`sidebar-btn-${item.value}`}
          onClick={() => setActiveView(item.value)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
            isActive 
              ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 glow-cyan' 
              : theme === 'light'
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-l-2 border-transparent'
                : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50 border-l-2 border-transparent'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      );
    });
  };

  return (
    <aside className={`hidden md:flex w-64 border-r flex-col justify-between shrink-0 z-20 h-full transition-colors duration-200 ${
      theme === 'light' ? 'bg-white border-slate-205 border-slate-200' : 'bg-[#0b111e] border-slate-800'
    }`}>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Visual Brand Title Block */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-950"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
          </div>
          <div>
            <span className={`font-extrabold text-sm tracking-widest uppercase block transition-colors duration-200 ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>p2p-journal</span>
            <span className="text-[9px] text-cyan-500 font-mono tracking-tight font-bold">INV TRACKER ENGINE</span>
          </div>
        </div>

        {/* Dynamic Navigation Rails */}
        <div className="p-4 space-y-6">
          <div>
            <div className={`text-[10px] font-bold tracking-widest uppercase px-3 mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`}>Order Desk</div>
            <nav className="space-y-1">{renderNavGroup(primaryNavItems)}</nav>
          </div>

          <div>
            <div className={`text-[10px] font-bold tracking-widest uppercase px-3 mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Ledger Registry</div>
            <nav className="space-y-1">{renderNavGroup(ledgerNavItems)}</nav>
          </div>

          <div>
            <div className={`text-[10px] font-bold tracking-widest uppercase px-3 mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>System Controls</div>
            <nav className="space-y-1">{renderNavGroup(controlNavItems)}</nav>
          </div>
        </div>
      </div>

      {/* User profile footer info */}
      <div className={`p-4 border-t transition-colors duration-200 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className={`flex items-center gap-3 p-2 border rounded-xl transition-colors duration-200 ${
          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#1e293b]/50 border-slate-800/80'
        }`}>
          <div className="w-8 h-8 rounded-full bg-cyan-600 font-bold flex items-center justify-center text-xs text-white uppercase select-none">
            AJ
          </div>
          <div>
            <p className={`text-xs font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Alusine J.</p>
            <p className="text-[9px] text-slate-500">Senior Architect</p>
          </div>
        </div>

        {/* Network & Ledger Status Indicator at Bottom Left */}
        <div className={`mt-3 pt-3 border-t border-dashed flex flex-col gap-2 px-1 ${
          theme === 'light' ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold select-none text-slate-500 font-mono">
            <span>Network:</span>
            <span className="text-emerald-500 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
              Connected
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0"></span>
            <span className="text-slate-400">Sandbox Ledger Active</span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-slate-500">
            <span>Version:</span>
            <span className="text-slate-400 font-bold">v1.8.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
