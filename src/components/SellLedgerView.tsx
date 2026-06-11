/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { FileSpreadsheet, Calendar, Wallet, TrendingUp } from 'lucide-react';

export const SellLedgerView: React.FC = () => {
  const { sellLedger, theme } = useLedger();

  const textTitleColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const borderCol = theme === 'light' ? 'border-slate-200' : 'border-slate-800';
  const tableRowHoverClass = theme === 'light' ? 'hover:bg-slate-100/60' : 'hover:bg-[#1e293b]/20';

  return (
    <div className="glass p-4 md:p-6 rounded-xl shadow-xl space-y-4 animate-fade-in">
      
      {/* Header telemetry blocks */}
      <div className={`flex items-center gap-2 border-b pb-3 ${borderCol}`}>
        <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
        <div>
          <span className={`font-extrabold text-xs tracking-wider uppercase block ${textTitleColor}`}>Sell records</span>
          <span className="text-[10px] text-slate-500 font-mono">Monospaced trade disposal archives</span>
        </div>
      </div>

      {/* DESKTOP VIEW: tabular layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`bg-[#1e293b]/30 text-slate-400 uppercase tracking-widest text-[9px] font-bold select-none border-b ${borderCol}`}>
              <th className="py-3 px-4 font-sans">Txn ID</th>
              <th className="py-3 px-4 font-sans">Source Block</th>
              <th className="py-3 px-4 text-right pr-6">Volume Sold</th>
              <th className="py-3 px-4 text-right pr-6">Sell Price (unit)</th>
              <th className="py-3 px-4 text-right pr-6">Gross Inflow (In)</th>
              <th className="py-3 px-4 text-right pr-6">Net profit margin</th>
              <th className="py-3 px-4 text-center">Execution Date</th>
              <th className="py-3 px-4">Receipt Wallet</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-mono text-xs text-slate-650 dark:text-slate-350 ${borderCol}`}>
            {sellLedger.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold font-sans">
                  No historical sell transactions recorded.
                </td>
              </tr>
            ) : (
              sellLedger.map((r) => (
                <tr key={r.id} className={`transition-colors ${tableRowHoverClass}`}>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{r.id}</td>
                  <td className="py-3 px-4 text-slate-500">{r.blockId}</td>
                  <td className={`py-3 px-4 text-right pr-6 font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                    {r.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </td>
                  <td className="py-3 px-4 text-right pr-6 text-slate-500 dark:text-slate-300">
                    Le {r.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </td>
                  <td className={`py-3 px-4 text-right pr-6 font-extrabold ${theme === 'light' ? 'text-slate-800' : 'text-slate-250'}`}>
                    Le {r.totalSale.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`py-3 px-4 text-right pr-6 text-emerald-600 dark:text-emerald-400 font-extrabold ${theme === 'light' ? 'bg-emerald-500/5' : 'bg-[#10b981]/10'}`}>
                    +Le {r.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 font-sans text-[10px] text-slate-400">
                    {r.wallet}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADAPTIVE MOBILE VIEW: styled details cards */}
      <div className="md:hidden space-y-3 pb-24 font-mono text-xs">
        {sellLedger.length === 0 ? (
          <div className={`py-12 text-center text-slate-500 font-sans border rounded-xl ${borderCol}`}>
            No historical sell transactions.
          </div>
        ) : (
          sellLedger.map((r) => (
            <div 
              key={r.id} 
              className={`glass p-4 rounded-xl border space-y-3 ${
                theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block">{r.id}</span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Calendar className="w-3" />
                  <span>{r.date}</span>
                </span>
              </div>
              
              <div className="text-slate-500 text-[11px] font-sans flex items-center gap-2">
                <Wallet className="w-3" />
                <span className="text-slate-400">Discharged Position Source:</span>
                <span className={`font-mono font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{r.blockId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-200 dark:border-slate-900/60 font-mono">
                <div className={`p-2 border rounded ${
                  theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#000000]/30 border-slate-900/40'
                }`}>
                  <span className="text-[9px] text-slate-500 block uppercase font-sans font-semibold">Gross Inflow:</span>
                  <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Le {r.totalSale.toLocaleString()}</span>
                </div>
                <div className={`p-2 border rounded ${
                  theme === 'light' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-950/10 border-emerald-905/25'
                }`}>
                  <span className="text-[9px] text-slate-500 block uppercase font-sans font-semibold">Net Profit:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">+Le {r.profit.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-sans pt-1 flex justify-between">
                <span>Settled reservoir:</span>
                <span className="text-slate-400 font-mono text-[10px]">{r.wallet}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
