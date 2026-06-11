/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { FileCheck, Calendar, ArrowDownRight, Tag, Download, FileText } from 'lucide-react';
import brandLogo from '../assets/images/Gemini_Generated_Image_wy75sxwy75sxwy75.png';

export const BuyLedgerView: React.FC = () => {
  const { buyLedger, theme } = useLedger();

  const handleExportExcel = () => {
    if (buyLedger.length === 0) {
      alert('There are no buy transactions to export.');
      return;
    }
    const headers = ['TXN ID', 'Block ID', 'Token Symbol', 'Quantity Bought', 'Price (Le)', 'Total Outflow (Le)', 'Execution Date', 'Audit Notes'];
    const rows = buyLedger.map(r => [
      r.id,
      r.blockId,
      r.coin,
      r.quantity,
      r.price,
      r.totalCost,
      r.date,
      r.notes || ''
    ]);
    
    const content = [
      headers.join(','),
      ...rows.map(row => 
        row.map(value => {
          const str = String(value ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `P2P_Buy_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (buyLedger.length === 0) {
      alert('There are no buy transactions to export.');
      return;
    }
    const title = 'Historical Buy Records Statement';
    const headers = ['Txn ID', 'Block Bound', 'Token', 'Qty Bought', 'Unit Price', 'Total Outflow', 'Execution Date'];
    const rows = buyLedger.map(r => [
      r.id,
      r.blockId,
      r.coin,
      r.quantity.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      `Le ${r.price.toLocaleString()}`,
      `Le ${r.totalCost.toLocaleString()}`,
      r.date
    ]);
    
    const summaryStats = [
      { label: 'Total Purchases Count', value: buyLedger.length.toString() },
      { label: 'Cumulative Capital Outflow', value: `Le ${buyLedger.reduce((sum, r) => sum + r.totalCost, 0).toLocaleString()}` },
      { label: 'Average Price basis', value: `Le ${buyLedger.length > 0 ? Math.round(buyLedger.reduce((sum, r) => sum + r.price, 0) / buyLedger.length).toLocaleString() : '0'}` }
    ];

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please unlock popups to print the statement report.');
      return;
    }

    const dateStr = new Date().toLocaleString();
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, system-ui, BlinkMacSystemFont, sans-serif; color: #0f172a; padding: 30px; margin: 0; line-height: 1.4; }
            .header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #06b6d4; padding-bottom: 15px; margin-bottom: 25px; }
            .logo-wrap { display: flex; align-items: center; gap: 10px; }
            .logo-wrap img { height: 42px; width: auto; object-fit: contain; }
            .logo-text h1 { margin: 0; font-size: 20px; font-weight: 850; letter-spacing: 0.05em; color: #0f172a; }
            .logo-text p { margin: 2px 0 0; font-size: 10px; color: #06b6d4; font-family: monospace; font-weight: bold; }
            .meta-text { text-align: right; font-size: 10px; color: #64748b; font-family: monospace; }
            .meta-text p { margin: 1px 0; }
            .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 25px; }
            .card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
            .card-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 3px; }
            .card-val { font-size: 14px; font-weight: 800; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 35px; }
            th { background-color: #0d1527; color: #ffffff; padding: 8px 10px; text-align: left; text-transform: uppercase; font-size: 8px; letter-spacing: 0.05em; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) td { background-color: #f8fafc; }
            .footer { margin-top: 50px; border-top: 1px dashed #cbd5e1; padding-top: 15px; text-align: center; font-size: 9px; color: #94a3b8; line-height: 1.5; }
            @media print {
              body { padding: 15px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-row">
            <div class="logo-wrap">
              <img src="${brandLogo}" alt="Logo"/>
              <div class="logo-text">
                <h1>Historical Buy Records</h1>
                <p>CRYPTO P2P INVENTORY ENGINE</p>
              </div>
            </div>
            <div class="meta-text">
              <p><strong>REPORT TYPE:</strong> BUYS_STATEMENT</p>
              <p><strong>GENERATION DATE:</strong> ${dateStr}</p>
              <p><strong>OPERATOR:</strong> Alusine J. (Senior Architect)</p>
            </div>
          </div>
          <div class="summary-cards">
            ${summaryStats.map(s => `
              <div class="card">
                <div class="card-label">${s.label}</div>
                <div class="card-val">${s.value}</div>
              </div>
            `).join('')}
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Crypto P2P Inventory Engine Sandbox Ledger Statement • Version v1.8.0 • Confidential operator log.</p>
            <p>Printers formatted with crisp vector resolution. All wallet reserves including Orange Money are verified.</p>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const textTitleColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const borderCol = theme === 'light' ? 'border-slate-200' : 'border-slate-800';
  const tableRowHoverClass = theme === 'light' ? 'hover:bg-slate-100/60' : 'hover:bg-[#1e293b]/20';

  return (
    <div className="glass p-4 md:p-6 rounded-xl shadow-xl space-y-4 animate-fade-in">
      
      {/* Visual Header block */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 ${borderCol}`}>
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-500" />
          <div>
            <span className={`font-extrabold text-xs tracking-wider uppercase block ${textTitleColor}`}>Buy records</span>
            <span className="text-[10px] text-slate-500 font-mono">Consolidated acquisition audit log</span>
          </div>
        </div>

        {/* Export options */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700/15 bg-slate-800/10 hover:bg-slate-800/25 dark:hover:bg-slate-700/30 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 group"
            title="Export Buy Ledger in Excel spreadsheet format (CSV)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700/15 bg-slate-800/10 hover:bg-slate-800/25 dark:hover:bg-slate-700/30 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 group"
            title="Export Buy Ledger in printable PDF format"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Print</span>
          </button>
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
