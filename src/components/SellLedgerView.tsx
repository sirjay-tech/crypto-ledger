/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { FileSpreadsheet, Calendar, Wallet, TrendingUp, Download, FileText } from 'lucide-react';
import brandLogo from '../assets/images/Gemini_Generated_Image_wy75sxwy75sxwy75.png';

export const SellLedgerView: React.FC = () => {
  const { sellLedger, theme } = useLedger();

  const handleExportExcel = () => {
    if (sellLedger.length === 0) {
      alert('There are no sell transactions to export.');
      return;
    }
    const headers = ['TXN ID', 'Source Block', 'Volume Sold', 'Sell Price Unit (Le)', 'Gross Inflow (Le)', 'Net Profit (Le)', 'Execution Date', 'Receipt Wallet'];
    const rows = sellLedger.map(r => [
      r.id,
      r.blockId,
      r.quantity,
      r.price,
      r.totalSale,
      r.profit,
      r.date,
      r.wallet
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
    link.setAttribute('download', `P2P_Sell_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (sellLedger.length === 0) {
      alert('There are no sell transactions to export.');
      return;
    }
    const title = 'Historical Sell Records Statement';
    const headers = ['Txn ID', 'Source Block', 'Volume Sold', 'Sell Price', 'Gross Inflow', 'Net Profit Margin', 'Execution Date', 'Wallet'];
    const rows = sellLedger.map(r => [
      r.id,
      r.blockId,
      r.quantity.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      `Le ${r.price.toLocaleString()}`,
      `Le ${r.totalSale.toLocaleString()}`,
      `+Le ${r.profit.toLocaleString()}`,
      r.date,
      r.wallet
    ]);

    const summaryStats = [
      { label: 'Total Sales Count', value: sellLedger.length.toString() },
      { label: 'Cumulative Gross Inflows', value: `Le ${sellLedger.reduce((sum, r) => sum + r.totalSale, 0).toLocaleString()}` },
      { label: 'Net Realized Profit', value: `Le ${sellLedger.reduce((sum, r) => sum + r.profit, 0).toLocaleString()}` }
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
            .header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px; }
            .logo-wrap { display: flex; align-items: center; gap: 10px; }
            .logo-wrap img { height: 42px; width: auto; object-fit: contain; }
            .logo-text h1 { margin: 0; font-size: 20px; font-weight: 850; letter-spacing: 0.05em; color: #0f172a; }
            .logo-text p { margin: 2px 0 0; font-size: 10px; color: #10b981; font-family: monospace; font-weight: bold; }
            .meta-text { text-align: right; font-size: 10px; color: #64748b; font-family: monospace; }
            .meta-text p { margin: 1px 0; }
            .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 25px; }
            .card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
            .card-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 3px; }
            .card-val { font-size: 14px; font-weight: 800; color: #10b981; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 35px; }
            th { background-color: #0b1c18; color: #ffffff; padding: 8px 10px; text-align: left; text-transform: uppercase; font-size: 8px; letter-spacing: 0.05em; }
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
                <h1>Historical Sell Records</h1>
                <p>CRYPTO P2P INVENTORY ENGINE</p>
              </div>
            </div>
            <div class="meta-text">
              <p><strong>REPORT TYPE:</strong> SALES_STATEMENT</p>
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
      
      {/* Header telemetry blocks */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 ${borderCol}`}>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
          <div>
            <span className={`font-extrabold text-xs tracking-wider uppercase block ${textTitleColor}`}>Sell records</span>
            <span className="text-[10px] text-slate-500 font-mono">Monospaced trade disposal archives</span>
          </div>
        </div>

        {/* Export options */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700/15 bg-slate-800/10 hover:bg-slate-800/25 dark:hover:bg-slate-700/30 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 group"
            title="Export Sell Ledger in Excel spreadsheet format (CSV)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700/15 bg-slate-800/10 hover:bg-slate-800/25 dark:hover:bg-slate-700/30 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 group"
            title="Export Sell Ledger in printable PDF format"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Print</span>
          </button>
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
