/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  Wallet, 
  Layers, 
  TrendingUp, 
  TrendingDown,
  Coins, 
  CheckCircle2, 
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock,
  History,
  Activity,
  ArrowUpRight as ArrowUpRightIcon
} from 'lucide-react';
import { TimeFilter, TimeFilterOption, filterRecordsByTime } from './TimeFilter';
import { DepositRecord, WithdrawalRecord } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    metrics, 
    wallets, 
    buyLedger, 
    sellLedger, 
    depositLedger, 
    withdrawalLedger, 
    setActiveView, 
    theme 
  } = useLedger();

  // Time filters state for each tab
  const [buyFilterOpt, setBuyFilterOpt] = useState<TimeFilterOption>('all_time');
  const [buyStart, setBuyStart] = useState('');
  const [buyEnd, setBuyEnd] = useState('');

  const [sellFilterOpt, setSellFilterOpt] = useState<TimeFilterOption>('all_time');
  const [sellStart, setSellStart] = useState('');
  const [sellEnd, setSellEnd] = useState('');

  const [depositFilterOpt, setDepositFilterOpt] = useState<TimeFilterOption>('all_time');
  const [depositStart, setDepositStart] = useState('');
  const [depositEnd, setDepositEnd] = useState('');

  const [withdrawFilterOpt, setWithdrawFilterOpt] = useState<TimeFilterOption>('all_time');
  const [withdrawStart, setWithdrawStart] = useState('');
  const [withdrawEnd, setWithdrawEnd] = useState('');

  // Active History Tab selection
  const [activeHistoryTab, setActiveHistoryTab] = useState<'buy' | 'sell' | 'deposit' | 'withdrawal'>('buy');

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
      {/* Bento Grid metrics row (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        
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

      {/* Main layout: Stacked bottom sections as requested by the user */}
      <div className="space-y-6 md:space-y-8">
        
        {/* Available Wallets: Liquidity Reservoirs (Above Token Allocation Metrics) */}
        <div className="glass p-5 md:p-6 rounded-2xl shadow-xl space-y-6">
          <div className={`flex justify-between items-center border-b pb-3 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
            <h4 className={`text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${textTitleColor}`}>
              <Wallet className="w-4 h-4 text-amber-500" />
              <span>Liquidity Reservoirs (Available Wallets)</span>
            </h4>
            <button 
              onClick={() => setActiveView('wallets')}
              className="text-[10px] text-amber-600 dark:text-amber-400 hover:text-amber-500 uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Manage Wallets</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

            <div className={`p-4 border border-dashed rounded-xl text-[11px] text-slate-500 flex items-start gap-2.5 transition-colors duration-200 col-span-1 sm:col-span-2 md:col-span-3 ${
              theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-950/40'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                All P2P transactions executed standardly update settlement liquidity reserves instantly upon validation.
              </span>
            </div>
          </div>
        </div>

        {/* Token Allocation Metrics (At the bottom of the Dashboard page) */}
        <div className="glass p-5 md:p-6 rounded-2xl shadow-xl space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {metrics.holdings.map((hold) => {
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

        {/* 4. Enhanced Tabbed History Logs Section */}
        <div className="glass p-5 md:p-6 rounded-2xl shadow-xl space-y-6" id="dashboard-history-logs-section">
          <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
            <div className="space-y-1">
              <h4 className={`text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${textTitleColor}`}>
                <History className="w-4 h-4 text-cyan-500" />
                <span>Audited Financial Ledgers & Logs</span>
              </h4>
              <p className="text-[10px] text-slate-500 font-mono">
                Real-time transaction tracking across settlement gateways. Select any tab and apply targeted time filers.
              </p>
            </div>

            {/* Time Filter Dropdown (Switches context based on selected active tab) */}
            <div className="self-start lg:self-auto">
              {activeHistoryTab === 'buy' && (
                <TimeFilter
                  idPrefix="buy-hist"
                  selectedOption={buyFilterOpt}
                  onChangeOption={setBuyFilterOpt}
                  startDate={buyStart}
                  endDate={buyEnd}
                  onChangeStartDate={setBuyStart}
                  onChangeEndDate={setBuyEnd}
                  theme={theme}
                />
              )}
              {activeHistoryTab === 'sell' && (
                <TimeFilter
                  idPrefix="sell-hist"
                  selectedOption={sellFilterOpt}
                  onChangeOption={setSellFilterOpt}
                  startDate={sellStart}
                  endDate={sellEnd}
                  onChangeStartDate={setSellStart}
                  onChangeEndDate={setSellEnd}
                  theme={theme}
                />
              )}
              {activeHistoryTab === 'deposit' && (
                <TimeFilter
                  idPrefix="dep-hist"
                  selectedOption={depositFilterOpt}
                  onChangeOption={setDepositFilterOpt}
                  startDate={depositStart}
                  endDate={depositEnd}
                  onChangeStartDate={setDepositStart}
                  onChangeEndDate={setDepositEnd}
                  theme={theme}
                />
              )}
              {activeHistoryTab === 'withdrawal' && (
                <TimeFilter
                  idPrefix="with-hist"
                  selectedOption={withdrawFilterOpt}
                  onChangeOption={setWithdrawFilterOpt}
                  startDate={withdrawStart}
                  endDate={withdrawEnd}
                  onChangeStartDate={setWithdrawStart}
                  onChangeEndDate={setWithdrawEnd}
                  theme={theme}
                />
              )}
            </div>
          </div>

          {/* Tab Selection Header Buttons */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-800/30 pb-0.5" id="history-tabs-container">
            <button
              onClick={() => setActiveHistoryTab('buy')}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all duration-150 cursor-pointer ${
                activeHistoryTab === 'buy'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
              }`}
              id="tab-btn-buy"
            >
              Buy History
            </button>
            <button
              onClick={() => setActiveHistoryTab('sell')}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all duration-150 cursor-pointer ${
                activeHistoryTab === 'sell'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
              }`}
              id="tab-btn-sell"
            >
              Sell History
            </button>
            <button
              onClick={() => setActiveHistoryTab('deposit')}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all duration-150 cursor-pointer ${
                activeHistoryTab === 'deposit'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
              }`}
              id="tab-btn-deposit"
            >
              Deposit Ledger
            </button>
            <button
              onClick={() => setActiveHistoryTab('withdrawal')}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all duration-150 cursor-pointer ${
                activeHistoryTab === 'withdrawal'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
              }`}
              id="tab-btn-withdrawal"
            >
              Withdrawal Ledger
            </button>
          </div>

          {/* Active Tab View Panels with dynamic time-filtered calculations */}
          <div className="overflow-x-auto select-text" id="active-tab-table-viewport">
            {activeHistoryTab === 'buy' && (() => {
              const mappedBuys = buyLedger.map(b => ({
                id: b.id,
                date: b.date,
                coinType: b.coin,
                quantity: b.quantity,
                unitPrice: b.price,
                amountLeones: b.totalCost,
                fundingSource: b.fundingSource || 'Orange Money'
              }));
              const filteredBuys = filterRecordsByTime(mappedBuys, buyFilterOpt, buyStart, buyEnd) as typeof mappedBuys;

              return filteredBuys.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No purchase transactions found matching the selected timeframe.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]" id="buy-history-table">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-mono tracking-widest text-slate-500">
                      <th className="py-3 px-2">Date / Time</th>
                      <th className="py-3 px-2">Coin</th>
                      <th className="py-3 px-2 text-right">Quantity</th>
                      <th className="py-3 px-2 text-right">Price</th>
                      <th className="py-3 px-2 text-right">Total Le</th>
                      <th className="py-3 px-2">Funding Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs">
                    {filteredBuys.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-950/20 transition-colors" id={`row-buy-${b.id}`}>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-slate-400">{b.date}</td>
                        <td className="py-3.5 px-2">
                          <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-500/10 font-bold">
                            {b.coinType}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono text-white font-bold">{b.quantity.toLocaleString()}</td>
                        <td className="py-3.5 px-2 text-right font-mono text-slate-300">Le {b.unitPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="py-3.5 px-2 text-right font-mono text-cyan-400 font-bold">Le {b.amountLeones.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-3.5 px-2 font-bold uppercase text-slate-400 text-[11px] font-mono">{b.fundingSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}

            {activeHistoryTab === 'sell' && (() => {
              const mappedSells = sellLedger.map(s => ({
                id: s.id,
                date: s.date,
                coinType: s.coin || 'USDT',
                quantity: s.quantity,
                unitPrice: s.price,
                amountLeones: s.totalSale,
                realizedGain: s.profit,
                destinationWallet: s.wallet
              }));
              const filteredSells = filterRecordsByTime(mappedSells, sellFilterOpt, sellStart, sellEnd) as typeof mappedSells;

              return filteredSells.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No sales logs found matching the selected timeframe.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[650px]" id="sell-history-table">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-mono tracking-widest text-slate-500">
                      <th className="py-3 px-2">Date / Time</th>
                      <th className="py-3 px-2">Coin</th>
                      <th className="py-3 px-2 text-right">Quantity</th>
                      <th className="py-3 px-2 text-right">Price</th>
                      <th className="py-3 px-2 text-right">Total Le</th>
                      <th className="py-3 px-2 text-right">Profit / Loss</th>
                      <th className="py-3 px-2">Destination</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs">
                    {filteredSells.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-950/20 transition-colors" id={`row-sell-${s.id}`}>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-slate-400">{s.date}</td>
                        <td className="py-3.5 px-2">
                          <span className="bg-amber-500/15 text-amber-500 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/10 font-bold">
                            {s.coinType}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono text-white font-bold">{s.quantity.toLocaleString()}</td>
                        <td className="py-3.5 px-2 text-right font-mono text-slate-300">Le {s.unitPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="py-3.5 px-2 text-right font-mono text-slate-200 font-medium">Le {s.amountLeones.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className={`py-3.5 px-2 text-right font-mono font-black ${
                          s.realizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {s.realizedGain >= 0 ? '+' : ''}Le {s.realizedGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-2 font-bold uppercase text-slate-400 text-[11px] font-mono">{s.destinationWallet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}

            {activeHistoryTab === 'deposit' && (() => {
              const filteredDeposits = filterRecordsByTime(depositLedger, depositFilterOpt, depositStart, depositEnd) as DepositRecord[];

              return filteredDeposits.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No wallet deposit events registered in selected timeframe.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[500px]" id="deposit-ledger-table">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-mono tracking-widest text-slate-500">
                      <th className="py-3 px-2">Date / Time</th>
                      <th className="py-3 px-2 text-right">Amount Le</th>
                      <th className="py-3 px-2">Method</th>
                      <th className="py-3 px-2">Ref ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs">
                    {filteredDeposits.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-950/20 transition-colors" id={`row-dep-${d.id}`}>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-slate-400">
                          {new Date(d.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono text-emerald-400 font-bold">
                          Le {d.amountLeones.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-2 font-bold uppercase text-slate-300 text-[11px] font-mono">{d.paymentMethod}</td>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-slate-500 select-all">{d.referenceId || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}

            {activeHistoryTab === 'withdrawal' && (() => {
              const filteredWithdrawals = filterRecordsByTime(withdrawalLedger, withdrawFilterOpt, withdrawStart, withdrawEnd) as WithdrawalRecord[];

              return filteredWithdrawals.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No withdrawal records found matching the selected timeframe.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[550px]" id="withdrawal-ledger-table">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-mono tracking-widest text-slate-500">
                      <th className="py-3 px-2">Date / Time</th>
                      <th className="py-3 px-2 text-right">Amount Le</th>
                      <th className="py-3 px-2">Method</th>
                      <th className="py-3 px-2">Reason for Withdrawal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs">
                    {filteredWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-950/20 transition-colors" id={`row-with-${w.id}`}>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-slate-400">
                          {new Date(w.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono text-rose-400 font-bold">
                          Le {w.amountLeones.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-2 font-bold uppercase text-slate-300 text-[11px] font-mono">{w.paymentMethod}</td>
                        <td className="py-3.5 px-2 text-slate-300 font-sans tracking-wide italic font-medium">{w.reasonForWithdrawal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
};
