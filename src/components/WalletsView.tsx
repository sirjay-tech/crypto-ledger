/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  Wallet as WalletIcon, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  Check, 
  TrendingUp, 
  CornerDownRight, 
  DollarSign 
} from 'lucide-react';

export const WalletsView: React.FC = () => {
  const { 
    wallets, 
    addWallet, 
    depositToWallet, 
    withdrawFromWallet, 
    theme 
  } = useLedger();

  // New Wallet Form States
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletBalance, setNewWalletBalance] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Active Transaction State (Inline card adjustments)
  // { walletName: string, type: 'deposit' | 'withdraw' } | null
  const [activeTx, setActiveTx] = useState<{ walletName: string; type: 'deposit' | 'withdraw' } | null>(null);
  const [txAmount, setTxAmount] = useState('');
  const [refId, setRefId] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');

  // Total Liquidity Across All Reservoirs
  const totalLiquidity = wallets.reduce((sum, w) => sum + w.balance, 0);

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) return;
    const initialBalanceVal = parseFloat(newWalletBalance) || 0;
    addWallet(newWalletName, initialBalanceVal);
    // Reset inputs
    setNewWalletName('');
    setNewWalletBalance('');
    setShowAddForm(false);
  };

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTx) return;
    const amountVal = parseFloat(txAmount);
    if (!amountVal || isNaN(amountVal) || amountVal <= 0) {
      return;
    }

    if (activeTx.type === 'deposit') {
      depositToWallet(activeTx.walletName, amountVal, refId);
    } else {
      withdrawFromWallet(activeTx.walletName, amountVal, withdrawalReason);
    }

    // Reset TX drawer
    setTxAmount('');
    setRefId('');
    setWithdrawalReason('');
    setActiveTx(null);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      
      {/* 1. Page Header with stats summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 glass p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className={`p-1 px-2.5 rounded text-[10px] font-mono tracking-wider font-bold inline-block uppercase mb-2 ${
              theme === 'light' ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-950/40 text-cyan-400'
            }`}>
              SYSTEM LIQUIDITY
            </div>
            <h2 className={`text-2xl md:text-3xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Le {totalLiquidity.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h2>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              💼 Combined cash capital reserves across all available payment integrations and ledger nodes.
            </p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Update, fund, or debit reservations on demand. Wallets are bound as target funding resources when initiating Buy and Sell trade agreements.
          </p>
        </div>

        {/* Aggregate Stats Card */}
        <div className="glass p-6 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/10 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Total Integrations</span>
            <span className={`text-3xl font-black block mt-1 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
              {wallets.length}
            </span>
            <span className="text-[9px] text-slate-500 font-mono block mt-1">active reservoir interfaces</span>
          </div>

          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide select-none cursor-pointer duration-200 mt-4 shadow-lg shadow-cyan-500/10"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{showAddForm ? 'Cancel Creation' : 'Add New Wallet'}</span>
          </button>
        </div>
      </div>

      {/* 2. Slide Down Add Wallet Form */}
      {showAddForm && (
        <form 
          onSubmit={handleCreateWallet} 
          className="glass p-6 rounded-2xl border border-cyan-500/20 shadow-2xl space-y-4 animate-slide-down"
        >
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <PlusCircle className="text-cyan-400 w-4 h-4" />
              <span>Register New Liquid Ledger Node</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Initialize a clean financial settlement buffer module to back real-time P2P transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Wallet Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Orange Money, Apex OTC, Ecobank"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Initial SLL Balance (Leones)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 25,000,000"
                value={newWalletBalance}
                onChange={(e) => setNewWalletBalance(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 outline-none font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-500 active:scale-95 text-slate-950 font-extrabold text-xs uppercase tracking-wide px-5 py-2.5 rounded-xl cursor-pointer duration-200"
            >
              Configure Reservoir Node
            </button>
          </div>
        </form>
      )}

      {/* 4. Active Wallets Grid */}
      <div className="space-y-4">
        <h3 className={`text-xs font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Active Funding Reservoirs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wallets.map((wallet) => {
            const isSelectedForTx = activeTx?.walletName === wallet.name;
            const isOrange = wallet.name.toLowerCase().includes('orange');

            return (
              <div 
                key={wallet.name}
                className={`glass p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-xl transition-all duration-350 ${
                  isSelectedForTx 
                    ? 'border-cyan-500 bg-cyan-950/5 ring-1 ring-cyan-500/20' 
                    : isOrange
                      ? 'border-amber-500/20 bg-gradient-to-b from-amber-500/[0.03] to-transparent'
                      : 'border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {/* Micro branding background graphic */}
                <div className="absolute right-[-15px] top-[-15px] text-slate-900/10 dark:text-slate-800/20 pointer-events-none select-none group-hover:scale-110 duration-350 transition-transform">
                  <WalletIcon className="w-24 h-24" />
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        isOrange 
                          ? 'bg-amber-500/15 text-amber-500' 
                          : 'bg-cyan-500/15 text-cyan-400'
                      }`}>
                        <WalletIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-black uppercase tracking-wide ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                          {wallet.name}
                        </h4>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {isOrange ? '🟠 Core M-Wallet Integration' : '💼 Multi-Account Reserve'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Available Capital</span>
                    <span className={`text-xl md:text-2xl font-black block tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      Le {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Inline Action Form vs Standard Buttons */}
                {isSelectedForTx ? (
                  <form 
                    onSubmit={handleTxSubmit}
                    className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-cyan-500/20 shadow-inner relative z-10 animate-fade-in"
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-black uppercase tracking-wider font-mono ${
                        activeTx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {activeTx.type === 'deposit' ? '📥 Fund Deposit' : '📤 Cash Withdrawal'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTx(null);
                          setTxAmount('');
                          setRefId('');
                          setWithdrawalReason('');
                        }}
                        className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        autoFocus
                        placeholder="Leone (Le)"
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 outline-none font-mono font-bold"
                      />
                      <span className="absolute left-3 top-2.5 text-slate-500 text-[10px] font-mono leading-none">Le</span>
                    </div>

                    {activeTx.type === 'deposit' ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Reference ID (Optional)"
                          value={refId}
                          onChange={(e) => setRefId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 outline-none font-bold"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Reason for Withdrawal (Required)"
                          value={withdrawalReason}
                          onChange={(e) => setWithdrawalReason(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 outline-none font-bold"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTx(null);
                          setTxAmount('');
                          setRefId('');
                          setWithdrawalReason('');
                        }}
                        className={`py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer text-center duration-200 ${
                          theme === 'light'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider cursor-pointer duration-205 text-center ${
                          activeTx.type === 'deposit'
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                            : 'bg-rose-500 hover:bg-rose-600 text-white'
                        }`}
                      >
                        Execute
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    <button
                      onClick={() => {
                        setActiveTx({ walletName: wallet.name, type: 'deposit' });
                        setTxAmount('');
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3.5 border rounded-xl text-[10px] font-black uppercase tracking-wider select-none cursor-pointer duration-200 transition-colors ${
                        theme === 'light'
                          ? 'border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Deposit</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTx({ walletName: wallet.name, type: 'withdraw' });
                        setTxAmount('');
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3.5 border rounded-xl text-[10px] font-black uppercase tracking-wider select-none cursor-pointer duration-200 transition-colors ${
                        theme === 'light'
                          ? 'border-rose-250 bg-rose-50/50 text-rose-700 hover:bg-rose-100/60'
                          : 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10'
                      }`}
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
