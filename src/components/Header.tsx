/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';

export const Header: React.FC = () => {
  const { 
    activeView, 
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
      case 'wallets':
        return 'Wallet Registries';
      case 'settings':
        return 'Configuration Settings';
      default:
        return 'LEDGER ENGINE';
    }
  };

  return (
    <header className={`h-16 border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-35 transition-colors duration-200 ${
      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#090d16] border-slate-800'
    }`}>
      <div className="flex flex-col">
        <h2 className={`text-sm font-black uppercase tracking-widest select-none ${
          theme === 'light' ? 'text-slate-800' : 'text-white'
        }`}>
          p2p-journal
        </h2>
        <p className="text-[10px] text-cyan-500 font-mono tracking-wider font-semibold select-none">
          {getHeaderTitle().toUpperCase()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Removed version badge as requested */}
      </div>
    </header>
  );
};
