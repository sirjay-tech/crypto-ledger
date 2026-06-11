/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  Wallet, 
  Layers, 
  TrendingUp, 
  TrendingDown,
  Coins, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { metrics, wallets, setActiveView, theme } = useLedger();

  // Highlight Orange Money balance cleanly as asked in the prompt
  const orangeMoney = wallets.find(w => w.name.toLowerCase().includes('orange'));
  const orangeMoneyBalance = orangeMoney ? orangeMoney.balance : 0;

  // Format Leone (Le) standard numeric structure
  const formatLe = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Safe percentage calculation for progress indicator bars
  const totalAllocationVal = metrics.totalInventoryValue || 1; // avoid divide by zero

  const textTitleColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const textMutedColor = theme === 'light' ? 'text-slate-500' : '#94a3b8';

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* 4-Bento Grid metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Metric 1: Orange Money wallet balance */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_4px_25px_rgba(245,158,11,0.1)] relative overflow-hidden group glow-amber">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div className="space-y-1">
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest block transition-colors duration-200 text-slate-500 dark:text-slate-400`}>Orange Money Wallet</span>
            <h3 className="text-xl md:text-2xl font-black text-amber-500 font-mono tracking-tight">
              Le {formatLe(orangeMoneyBalance)}
            </h3>
            <span className="text-[10px] text-slate-500 block">Settlement liquidity pool</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shadow-inner group-hover:rotate-6 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Inventory Value */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_4px_25px_rgba(34,211,238,0.1)] relative overflow-hidden group glow-cyan">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div className="space-y-1">
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest block transition-colors duration-200 text-slate-500 dark:text-slate-400`}>Total Inventory value</span>
            <h3 className="text-xl md:text-2xl font-black text-cyan-500 dark:text-cyan-400 font-mono tracking-tight transition-colors duration-200">
              Le {formatLe(metrics.totalInventoryValue)}
            </h3>
            <span className="text-[10px] text-slate-500 block">Unrealized asset cost bases</span>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 shadow-inner group-hover:rotate-6 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Realized Profits */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_4px_25px_rgba(16,185,129,0.1)] relative overflow-hidden group glow-emerald">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div className="space-y-1">
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest block transition-colors duration-200 text-slate-500 dark:text-slate-400`}>Realized Net profits</span>
            <h3 className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight transition-colors duration-200">
              Le {formatLe(metrics.realizedProfit)}
            </h3>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-500">Accumulated settlement margins</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shadow-inner group-hover:rotate-6 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Active Holding Blocks */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_4px_25px_rgba(59,130,246,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div className="space-y-1">
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest block transition-colors duration-200 text-slate-500 dark:text-slate-400`}>Holdings Blocks</span>
            <h3 className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight transition-colors duration-200">
              {metrics.activeBlocks}
            </h3>
            <span className="text-[10px] text-slate-500 block">Separately audited allocations</span>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shadow-inner group-hover:rotate-6 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main split display: Asset allocations vs Wallets liquidity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: Token Allocations with progress indices */}
        <div className="glass p-5 md:p-6 rounded-2xl shadow-xl lg:col-span-2 space-y-6">
          <div className={`flex justify-between items-center border-b pb-3 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
            <h4 className={`text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${textTitleColor}`}>
              <Coins className="w-4 h-4 text-cyan-500" />
              <span>Token Allocation Metrics (Holdings Profile)</span>
            </h4>
            <button 
              onClick={() => setActiveView('inventory')}
              className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Manage Blocks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {metrics.holdings.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs font-mono">
              <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-30" />
              <span>No active crypto allocations currently held in deck.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.holdings.map((hold) => {
                // Compute visual metrics
                return (
                  <div 
                    key={hold.coin}
                    className={`p-4 border rounded-xl space-y-3 transition-colors duration-200 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/40 border-slate-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-lg text-xs font-extrabold border border-cyan-400/20 font-mono">
                          {hold.coin}
                        </span>
                      </div>
                      <span className={`text-xs font-bold font-mono ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        {hold.qty.toLocaleString()} units
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Portfolio density</span>
                        <span>{Math.round((hold.qty) * 100) / 100} vol</span>
                      </div>
                      {/* Linear level bar representation */}
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (hold.qty / totalAllocationVal) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT 1 COLUMN: Liquidity Reservoirs (Wallets) */}
        <div className="glass p-5 md:p-6 rounded-2xl shadow-xl space-y-6">
          <div className={`flex justify-between items-center border-b pb-3 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
            <h4 className={`text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${textTitleColor}`}>
              <Wallet className="w-4 h-4 text-amber-500" />
              <span>Liquidity Reservoirs</span>
            </h4>
          </div>

          <div className="space-y-3">
            {wallets.map((wallet) => {
              const symbol = wallet.name.toLowerCase().includes('orange') ? '🟠' : '💼';
              return (
                <div 
                  key={wallet.name}
                  className={`p-4 border rounded-xl flex items-center justify-between transition-colors duration-200 ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-900/20 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{symbol}</span>
                    <div>
                      <span className={`text-xs font-extrabold block uppercase tracking-wide transition-colors duration-200 ${
                        theme === 'light' ? 'text-slate-800' : 'text-white'
                      }`}>
                        {wallet.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">Settlement account</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold block font-mono transition-colors duration-200 ${
                      theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                    }`}>
                      Le {formatLe(wallet.balance)}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/10">
                      SECURE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`p-4 border border-dashed rounded-xl text-[11px] text-slate-500 flex items-start gap-2.5 transition-colors duration-200 ${
            theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-950/40'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              All transactions executed standardly update settlement liquidity reserves instantly upon validation.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
