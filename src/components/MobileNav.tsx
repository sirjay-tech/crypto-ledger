/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MinusCircle, 
  Database, 
  Menu, 
  X, 
  FileCheck, 
  FileSpreadsheet, 
  Sliders,
  Wallet
} from 'lucide-react';
import { ActiveView } from '../types';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, theme } = useLedger();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const navItems: { value: ActiveView; label: string; icon: React.ReactNode }[] = [
    { value: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { value: 'buy', label: 'Buy', icon: <PlusCircle className="w-5 h-5" /> },
    { value: 'sell', label: 'Sell', icon: <MinusCircle className="w-5 h-5" /> },
    { value: 'inventory', label: 'Stock', icon: <Database className="w-5 h-5" /> },
  ];

  const handleMoreItemClick = (view: ActiveView) => {
    setActiveView(view);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Dynamic bottom tabs navigation grid */}
      <nav id="mobile-navigation-bar" className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around p-2.5 z-40 shadow-2xl backdrop-blur-lg select-none transition-colors duration-200 ${
        theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#090d16]/95 border-slate-800'
      }`}>
        {navItems.map((item) => {
          const isActive = activeView === item.value;
          return (
            <button
              key={item.value}
              onClick={() => {
                setActiveView(item.value);
                setIsDrawerOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'text-cyan-500 font-extrabold bg-cyan-550/10' 
                  : theme === 'light'
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-bold tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
        
        {/* Expandable Drawer Trigger button */}
        <button
          onClick={() => setIsDrawerOpen(prev => !prev)}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
            isDrawerOpen 
              ? 'text-cyan-500' 
              : theme === 'light'
                ? 'text-slate-500 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] mt-1 font-bold tracking-wider uppercase">More</span>
        </button>
      </nav>

      {/* Floating full-screen backdrop drawer menu overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 md:hidden flex flex-col justify-end"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className={`border-t rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl pb-32 transition-colors duration-200 ${
              theme === 'light' ? 'bg-white border-slate-205 border-slate-200' : 'bg-[#0b1329] border-slate-800'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center border-b pb-3 ${
              theme === 'light' ? 'border-slate-100' : 'border-slate-800'
            }`}>
              <div>
                <span className={`font-extrabold text-sm tracking-widest uppercase block ${
                  theme === 'light' ? 'text-slate-800' : 'text-white'
                }`}>p2p-journal Navigation</span>
                <span className="text-[10px] text-cyan-500 font-mono font-bold">SUPPLEMENTARY REGISTRIES</span>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className={`p-1 px-2.5 border rounded-lg ${
                  theme === 'light' ? 'bg-slate-50 border-slate-205 text-slate-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <X className="w-4 h-4 text-slate-200" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              <button 
                onClick={() => handleMoreItemClick('wallets')}
                className={`w-full flex items-center gap-3.5 p-4 border rounded-xl text-left font-semibold text-xs uppercase cursor-pointer ${
                  activeView === 'wallets' 
                    ? 'border-cyan-500 text-cyan-500 bg-cyan-500/5' 
                    : theme === 'light'
                      ? 'border-slate-150 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Wallet className="w-5 h-5 text-cyan-500" />
                <span>Wallets & Cash Balance</span>
              </button>

              <button 
                onClick={() => handleMoreItemClick('buy-ledger')}
                className={`w-full flex items-center gap-3.5 p-4 border rounded-xl text-left font-semibold text-xs uppercase cursor-pointer ${
                  activeView === 'buy-ledger' 
                    ? 'border-cyan-500 text-cyan-500 bg-cyan-500/5' 
                    : theme === 'light'
                      ? 'border-slate-150 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <FileCheck className="w-5 h-5 text-cyan-500" />
                <span>Buy History Ledger Link</span>
              </button>

              <button 
                onClick={() => handleMoreItemClick('sell-ledger')}
                className={`w-full flex items-center gap-3.5 p-4 border rounded-xl text-left font-semibold text-xs uppercase cursor-pointer ${
                  activeView === 'sell-ledger' 
                    ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' 
                    : theme === 'light'
                      ? 'border-slate-150 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-555 text-emerald-500" />
                <span>Sell History Ledger Link</span>
              </button>

              <button 
                onClick={() => handleMoreItemClick('settings')}
                className={`w-full flex items-center gap-3.5 p-4 border rounded-xl text-left font-semibold text-xs uppercase cursor-pointer ${
                  activeView === 'settings' 
                    ? 'border-amber-500 text-amber-500 bg-amber-500/5' 
                    : theme === 'light'
                      ? 'border-slate-150 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>App Settings Registry</span>
              </button>
            </div>

            <div className={`p-4 border-t text-center text-[10px] space-y-2 font-mono select-none ${
              theme === 'light' ? 'border-slate-100' : 'border-slate-900/60'
            }`}>
              <div className="flex justify-center items-center gap-3 mb-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="text-emerald-500 font-bold">Connected</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                  <span className="text-slate-400">Sandbox Active</span>
                </div>
              </div>
              <div className="text-slate-500">
                p2p-journal Core UI Client v1.8.0
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
