/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import brandLogo from '../assets/images/Gemini_Generated_Image_wy75sxwy75sxwy75.png';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView,
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
    <header className={`h-16 border-b flex items-center sticky top-0 z-35 transition-colors duration-200 ${
      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#090d16] border-slate-800'
    }`}>
      {/* Top Left Hand Corner Logo */}
      <div className={`flex items-center h-full border-r shrink-0 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <button
          onClick={() => setActiveView('dashboard')}
          className="cursor-pointer transition-all hover:opacity-95 active:scale-98 focus:outline-none flex items-center h-full outline-none overflow-hidden"
          id="header-left-logo-btn"
          title="Return to Dashboard"
        >
          <img 
            src={brandLogo} 
            alt="Crypto P2P Inventory Engine"
            className={`h-full w-auto max-h-16 object-contain py-1 px-4 transition-all ${
              theme === 'light' ? 'mix-blend-multiply' : 'mix-blend-screen'
            }`}
            style={{ imageRendering: 'crisp-edges' }}
            referrerPolicy="no-referrer"
          />
        </button>
      </div>

      {/* Main Header view info on the right */}
      <div className="flex-grow flex items-center justify-between px-4 sm:px-6">
        <div className="flex flex-col justify-center">
          <p className="text-[9px] text-cyan-500 font-mono tracking-widest font-semibold uppercase select-none">
            Crypto P2P Engine
          </p>
          <h2 className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-wide select-none ${
            theme === 'light' ? 'text-slate-800' : 'text-white'
          }`}>
            {getHeaderTitle()}
          </h2>
        </div>
      </div>
    </header>
  );
};
