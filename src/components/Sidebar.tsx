/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { useAuth } from '../context/AuthContext';
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
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { ActiveView } from '../types';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, theme } = useLedger();
  const { currentUser, logOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

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
          title={item.label}
          className={`w-full flex items-center rounded-lg text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
            isCollapsed 
              ? 'justify-center p-3' 
              : 'gap-3 px-3 py-2.5 border-l-2'
          } ${
            isActive 
              ? 'bg-cyan-500/10 text-cyan-400 glow-cyan ' + (isCollapsed ? 'border-r-2 border-cyan-400' : 'border-l-2 border-cyan-400')
              : theme === 'light'
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-l-2 border-transparent'
                : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50 border-l-2 border-transparent'
          }`}
        >
          <div className="shrink-0">{item.icon}</div>
          {!isCollapsed && <span>{item.label}</span>}
        </button>
      );
    });
  };

  return (
    <aside className={`hidden md:flex flex-col justify-between shrink-0 z-20 h-full transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } ${
      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b111e] border-slate-800'
    } border-r`}>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Toggle Collapse Button Row right at the top */}
        <div className={`p-2 flex ${isCollapsed ? 'justify-center border-b border-dashed' : 'justify-end'} ${
          theme === 'light' ? 'border-slate-200' : 'border-slate-800/60'
        } z-30`}>
          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'light' 
                ? 'bg-slate-50 hover:bg-slate-200 text-slate-600' 
                : 'bg-[#1e293b]/40 hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isCollapsed ? "Expand Sidebar Menu" : "Minimize Sidebar Menu"}
            id="sidebar-collapse-toggle-btn"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 hover:scale-110 transition-transform" />
            ) : (
              <ChevronLeft className="w-4 h-4 hover:scale-110 transition-transform" />
            )}
          </button>
        </div>



        {/* Dynamic Navigation Rails */}
        <div className={`space-y-6 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div>
            {isCollapsed ? (
              <div className={`my-2 border-b border-dashed ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/40'}`} />
            ) : (
              <div className={`text-[10px] font-bold tracking-widest uppercase px-3 mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`}>Order Desk</div>
            )}
            <nav className="space-y-1">{renderNavGroup(primaryNavItems)}</nav>
          </div>

          <div>
            {isCollapsed ? (
              <div className={`my-2 border-b border-dashed ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/40'}`} />
            ) : (
              <div className={`text-[10px] font-bold tracking-widest uppercase px-3 mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Ledger Registry</div>
            )}
            <nav className="space-y-1">{renderNavGroup(ledgerNavItems)}</nav>
          </div>

          <div>
            {isCollapsed ? (
              <div className={`my-2 border-b border-dashed ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/40'}`} />
            ) : (
              <div className={`text-[10px] font-bold tracking-widest uppercase px-3 mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>System Controls</div>
            )}
            <nav className="space-y-1">{renderNavGroup(controlNavItems)}</nav>
          </div>
        </div>
      </div>

      {/* User profile footer info */}
      <div className={`p-4 border-t transition-colors duration-200 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className={`flex flex-col gap-2 rounded-xl transition-all duration-200 ${
          isCollapsed 
            ? 'items-center py-2' 
            : 'p-3 border ' + (theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#1e293b]/50 border-slate-800/80')
        }`}
        title={currentUser?.email || 'P2P Account'}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 font-bold flex items-center justify-center text-xs text-white uppercase select-none shrink-0 shadow-sm animate-pulse-slow">
              {(currentUser?.email || 'US').slice(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold truncate ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                  {(currentUser?.email || 'User').split('@')[0]}
                </p>
                <p className="text-[9px] text-slate-500 truncate">{(currentUser?.email || 'P2P Operator')}</p>
              </div>
            )}
          </div>

          {!isCollapsed ? (
            <button
              onClick={() => {
                logOut();
              }}
              className="mt-1 w-full px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-slate-950 hover:text-white font-bold rounded-lg text-[9px] uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5"
              id="sidebar-sign-out-btn"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                logOut();
              }}
              className="mt-1 p-1 bg-rose-600 hover:bg-rose-700 text-slate-950 hover:text-white rounded-lg cursor-pointer transition-all flex items-center justify-center"
              title="Secure Log Out"
              id="sidebar-sign-out-btn-collapsed"
            >
              <LogOut className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Network & Ledger Status Indicator at Bottom Left */}
        {!isCollapsed && (
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
        )}
      </div>
    </aside>
  );
};
