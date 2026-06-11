/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { RefreshCcw, Database, AlertCircle, Trash2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeView, 
    isLoading, 
    syncWithGoogleSheets, 
    resetToDefault,
    settings,
    theme 
  } = useLedger();

  // Convert active view keys into clean visual string headers
  const getHeaderTitle = () => {
    switch(activeView) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'buy':
        return 'Execute Buy Order';
      case 'sell':
        return 'Execute Sell Order';
      case 'inventory':
        return 'Active Stock Deck';
      case 'buy-ledger':
        return 'Historical Buy Records';
      case 'sell-ledger':
        return 'Historical Sell Records';
      case 'settings':
        return 'Configuration Settings';
      default:
        return 'LEDGER ENGINE';
    }
  };

  const isGasConfigured = !!settings.find(s => s.key === 'GAS_WEB_APP_URL')?.value;

  return (
    <header className={`h-16 border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-35 transition-colors duration-200 ${
      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#090d16] border-slate-800'
    }`}>
      <div className="flex flex-col">
        <h2 className={`text-[10px] md:text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 select-none ${
          theme === 'light' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>Network Status:</span>
          <span className="text-emerald-500 font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Connected
          </span>
        </h2>
        <p className="text-[10px] text-cyan-500 font-mono tracking-wider font-semibold select-none">
          {getHeaderTitle().toUpperCase()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic synced block indicator */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1 border rounded-full ${
          theme === 'light'
            ? 'bg-amber-500/10 border-amber-400/20 text-amber-700 font-semibold'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">
            {isGasConfigured ? 'Syncing Custom Endpoint' : 'Sandbox Blocks #824,192'}
          </span>
        </div>

        {/* Sync Trigger Action */}
        <button
          onClick={syncWithGoogleSheets}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-all duration-300 ${
            isLoading 
              ? 'bg-cyan-950/40 text-cyan-500 border border-cyan-900/40 cursor-not-allowed'
              : 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/20 active:scale-95 glow-cyan'
          }`}
          title="Sync full spreadsheet ledger states"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Sync sheets</span>
        </button>

        {/* Reset / Clean State Fallback as secondary control */}
        <button
          onClick={resetToDefault}
          title="Reset database parameters"
          className={`p-1.5 border rounded-lg text-slate-500 transition-all duration-200 cursor-pointer ${
            theme === 'light'
              ? 'border-slate-200 bg-slate-100 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-600'
              : 'border-slate-800 bg-slate-900/50 hover:bg-rose-950/30 hover:border-rose-900 hover:text-rose-400'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
