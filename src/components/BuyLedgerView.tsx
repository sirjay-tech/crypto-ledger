/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { FileCheck, Calendar, ArrowDownRight, Tag } from 'lucide-react';

export const BuyLedgerView: React.FC = () => {
  const { buyLedger, theme } = useLedger();

  const textTitleColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const borderCol = theme === 'light' ? 'border-slate-200' : 'border-slate-800';
  const tableRowHoverClass = theme === 'light' ? 'hover:bg-slate-100/60' : 'hover:bg-[#1e293b]/20';

  return (
    <div className="glass p-4 md:p-6 rounded-xl shadow-xl space-y-4 animate-fade-in">
      
      {/* Visual Header block */}
      <div className={`flex items-center gap-2 border-b pb-3 ${borderCol}`}>
        <FileCheck className="w-5 h-5 text-cyan-500" />
        <div>
          <span className={`font-extrabold text-xs tracking-wider uppercase block ${textTitleColor}`}>Buy records</span>
          <span className="text-[10px] text-slate-500 font-mono">Consolidated acquisition audit log</span>
        </div>
      </div>

      {/* DESKTOP VIEW: tabular list layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`bg-[#1e293b]/30 text-slate-400 uppercase tracking-widest text-[9px] font-bold select-none border-b ${borderCol}`}>
              <th className="py-3 px-4">Txn ID</th>
              <th className="py-3 px-4">Target block</th>
              <th className="py-3 px-4 font-sans justify-start flex items-center gap-1.5 pt-4">Token</th>
              <th className="py-3 px-4 text-right pr-6">Volume bought</th>
              <th className="py-3 px-4 text-right pr-6">Price paid</th>
              <th className="py-3 px-4 text-right pr-6">Total Outflow</th>
              <th className="py-3 px-4 text-center">Execution Date</th>
              <th className="py-3 px-4">Audit notes</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-mono text-xs text-slate-650 dark:text-slate-350 ${borderCol}`}>
            {buyLedger.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold font-sans">
                  No historical buy transactions recorded.
                </td>
              </tr>
            ) : (
              buyLedger.map((r) => (
                <tr key={r.id} className={`transition-colors ${tableRowHoverClass}`}>
                  <td className="py-3 px-4 font-bold text-cyan-600 dark:text-cyan-400">{r.id}</td>
                  <td className="py-3 px-4 text-slate-500">{r.blockId}</td>
                  <td className={`py-3 px-4 font-sans ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    <span className="bg-[#0b111e] text-[#22d3ee] border border-cyan-400/10 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono">
                      {r.coin}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right pr-6 font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                    {r.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </td>
                  <td className="py-3 px-4 text-right pr-6 text-slate-500 dark:text-slate-300">
                    Le {r.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </td>
                  <td className={`py-3 px-4 text-right pr-6 text-emerald-600 dark:text-emerald-400 font-extrabold ${theme === 'light' ? 'bg-slate-100/50' : 'bg-slate-950/20'}`}>
                    Le {r.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 font-sans text-[10px] text-slate-400 max-w-[180px] truncate" title={r.notes}>
                    {r.notes || <span className="text-slate-500">-</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADAPTIVE MOBILE LAYOUT: details grids of cards */}
      <div className="md:hidden space-y-3 pb-24 font-mono text-xs">
        {buyLedger.length === 0 ? (
          <div className={`py-12 text-center text-slate-500 font-sans border rounded-xl ${borderCol}`}>
            No historical buy transactions.
          </div>
        ) : (
          buyLedger.map((r) => (
            <div 
              key={r.id} 
              className={`glass p-4 rounded-xl border space-y-3 ${
                theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold block">{r.id}</span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Calendar className="w-3" />
                  <span>{r.date}</span>
                </span>
              </div>
              
              <div className="text-slate-500 text-[11px] font-sans flex items-center gap-2">
                <Tag className="w-3 h-3 text-cyan-500" />
                <span className="text-slate-400">Bound Stock Position:</span>
                <span className={`font-mono font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{r.blockId}</span>
                <span className="text-[10px] bg-[#0b111e] border border-cyan-400/10 text-cyan-400 px-1.5 py-0.2 rounded font-mono font-bold">
                  {r.coin}
                </span>
              </div>

              <div className={`flex justify-between items-center text-[11px] p-2.5 rounded border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#000000]/30 border-slate-900'
              }`}>
                <div className="text-slate-500 dark:text-slate-300">
                  {r.quantity.toLocaleString()} units @ Le {r.price.toLocaleString()}
                </div>
                <div className="text-cyan-600 dark:text-cyan-400 font-black">
                  Le {r.totalCost.toLocaleString()}
                </div>
              </div>

              {r.notes && (
                <div className="text-[10px] text-slate-400 bg-slate-900/30 px-2 py-1.5 rounded italic font-sans truncate">
                  {r.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
