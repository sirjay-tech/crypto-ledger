/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { 
  Search, 
  Filter, 
  Code2, 
  Layers, 
  Plus, 
  Calendar, 
  HelpCircle,
  TrendingUp,
  Columns,
  Download,
  Printer
} from 'lucide-react';
import { InventoryBlock } from '../types';
import brandLogo from '../assets/images/Gemini_Generated_Image_wy75sxwy75sxwy75.png';

export const StockLedgerView: React.FC = () => {
  const { 
    inventory, 
    supportedCoins, 
    mergeInventoryBlocks, 
    addToast,
    setActiveView,
    theme
  } = useLedger();

  const handleExportExcel = () => {
    if (filteredBlocks.length === 0) {
      alert('There are no active stock, positions to export.');
      return;
    }
    const headers = ['Block ID', 'Crypto Asset', 'Volume Remaining', 'Acquisition Unit Cost (Le)', 'Holding Value balance (Le)', 'Inflow Date', 'Management Notes'];
    const rows = filteredBlocks.map(b => [
      b.id,
      b.coin,
      b.quantity,
      b.price,
      (b.quantity * b.price),
      b.date,
      b.notes || ''
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
    link.setAttribute('download', `P2P_Active_Stock_Deck_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (filteredBlocks.length === 0) {
      alert('There are no active positions in the current selection.');
      return;
    }
    const title = 'P2P Active Stock Deck Statements';
    const headers = ['Block ID', 'Crypto Asset', 'Volume Remaining', 'Acquisition Price', 'Holding Cost basis', 'Inflow Date'];
    const rows = filteredBlocks.map(b => [
      b.id,
      b.coin,
      b.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
      `Le ${b.price.toLocaleString()}`,
      `Le ${(b.quantity * b.price).toLocaleString()}`,
      b.date
    ]);

    const summaryStats = [
      { label: 'Active Blocks Count', value: filteredBlocks.length.toString() },
      { label: 'Total Holding Volume', value: filteredBlocks.reduce((sum, b) => sum + b.quantity, 0).toLocaleString(undefined, { maximumFractionDigits: 2 }) },
      { label: 'Estimated Assets Value', value: `Le ${filteredBlocks.reduce((sum, b) => sum + (b.quantity * b.price), 0).toLocaleString()}` }
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
            .card-val { font-size: 14px; font-weight: 800; color: #06b6d4; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 35px; }
            th { background-color: #0b171c; color: #ffffff; padding: 8px 10px; text-align: left; text-transform: uppercase; font-size: 8px; letter-spacing: 0.05em; }
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
                <h1>Active Stock Deck</h1>
                <p>CRYPTO P2P INVENTORY ENGINE</p>
              </div>
            </div>
            <div class="meta-text">
              <p><strong>REPORT TYPE:</strong> STOCK_DECK_STATEMENT</p>
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

  // Search parameters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [coinFilter, setCoinFilter] = useState<string>('');
  
  // Selection states for mergers
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);

  // Toggle individual row checkbox
  const toggleSelectBlock = (blockId: string) => {
    setSelectedBlockIds(prev => {
      if (prev.includes(blockId)) {
        return prev.filter(id => id !== blockId);
      } else {
        return [...prev, blockId];
      }
    });
  };

  // Toggle all visible rows
  const handleSelectAllToggle = (e: React.ChangeEvent<HTMLInputElement>, visibleBlocks: InventoryBlock[]) => {
    if (e.target.checked) {
      const allIds = visibleBlocks.map(b => b.id);
      setSelectedBlockIds(allIds);
    } else {
      setSelectedBlockIds([]);
    }
  };

  // Run selection merge
  const executeMerge = async () => {
    if (selectedBlockIds.length < 2) {
      addToast('Conjunction failure: Select at least 2 token blocks to merge.', 'error');
      return;
    }

    const firstBlockObj = inventory.find(b => b.id === selectedBlockIds[0]);
    if (!firstBlockObj) return;

    // Check if same coin
    const matchesAllSameCoin = selectedBlockIds.every(id => {
      const bObj = inventory.find(b => b.id === id);
      return bObj && bObj.coin === firstBlockObj.coin;
    });

    if (!matchesAllSameCoin) {
      addToast('Mismatched crypto assets: All blocks in the conjunction merge must be of the same token type.', 'error');
      return;
    }

    const confirmMerge = window.confirm(`Are you sure you want to merge these ${selectedBlockIds.length} blocks of ${firstBlockObj.coin} into a single consolidated position?`);
    if (!confirmMerge) return;

    const okay = await mergeInventoryBlocks(selectedBlockIds);
    if (okay) {
      setSelectedBlockIds([]);
    }
  };

  // Filter records based on search keywords
  const filteredBlocks = inventory.filter((b) => {
    const coinMatch = !coinFilter || b.coin === coinFilter;
    const searchMatch = !searchTerm || 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.notes && b.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.coin.toLowerCase().includes(searchTerm.toLowerCase());
    return coinMatch && searchMatch;
  });

  const inputBgClass = theme === 'light' ? 'bg-white text-slate-800 border-slate-300' : 'bg-slate-950 text-white border-slate-800';
  const tableBorderClass = theme === 'light' ? 'border-slate-200' : 'border-slate-800';
  const tableRowHoverClass = theme === 'light' ? 'hover:bg-slate-100/60' : 'hover:bg-[#1e293b]/20';

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Search / Sort / Action bar card */}
      <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-3 justify-between items-center shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Text search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border outline-none focus:border-cyan-500 transition-colors ${inputBgClass}`}
              placeholder="Search by ID, coin tag, or notes..."
            />
          </div>

          {/* Coin dropdown */}
          <div className="relative w-full sm:w-auto cursor-pointer">
            <select
              value={coinFilter}
              onChange={(e) => setCoinFilter(e.target.value)}
              className={`w-full sm:w-auto text-xs font-bold rounded-xl border px-4 py-2.5 outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer ${inputBgClass}`}
            >
              <option value="">All Crypto Assets</option>
              {supportedCoins.map(coin => (
                <option key={coin} value={coin}>{coin}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Excel, PDF, and Position Merger Button Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700/15 bg-slate-800/10 hover:bg-slate-800/25 dark:hover:bg-slate-700/30 transition-all text-slate-500 dark:text-slate-450 hover:text-cyan-500 dark:hover:text-cyan-400 group cursor-pointer"
            title="Download Active Stock Spreadsheet in Excel format (CSV)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700/15 bg-slate-800/10 hover:bg-slate-800/25 dark:hover:bg-slate-700/30 transition-all text-slate-500 dark:text-slate-450 hover:text-amber-500 dark:hover:text-amber-400 group cursor-pointer"
            title="Print PDF Active Stock Statement"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Print</span>
          </button>

          {/* Consolidated merger trigger button */}
          <button 
            onClick={executeMerge}
            disabled={selectedBlockIds.length < 2}
            className={`font-bold uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer duration-200 ${
              selectedBlockIds.length >= 2 
                ? 'bg-amber-500/10 border border-amber-400/30 text-amber-500 hover:bg-amber-500/20 glow-amber' 
                : 'bg-slate-900/50 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Merge ({selectedBlockIds.length})</span>
          </button>
        </div>
      </div>

      {/* DESKTOP MODE: Tabular registry formatting */}
      <div className="hidden md:block glass rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`bg-[#1e293b]/30 text-slate-400 uppercase tracking-widest text-[10px] font-bold select-none border-b ${tableBorderClass}`}>
                <th className="py-4 px-6 text-center w-12">
                  <input 
                     type="checkbox" 
                     onChange={(e) => handleSelectAllToggle(e, filteredBlocks)}
                     checked={filteredBlocks.length > 0 && selectedBlockIds.length === filteredBlocks.length}
                     className="cursor-pointer h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0" 
                  />
                </th>
                <th className="py-4 px-4 font-mono">Block ID</th>
                <th className="py-4 px-4">Crypto Asset</th>
                <th className="py-4 px-4 text-right pr-6 font-mono">Volume Remaining</th>
                <th className="py-4 px-4 text-right pr-6 font-mono">Buy Price basis (Unit)</th>
                <th className="py-4 px-4 text-right pr-6 font-mono">Total Cost balance</th>
                <th className="py-4 px-4 text-center">Inflow Date</th>
                <th className="py-4 px-6">Management Notes</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs text-slate-650 dark:text-slate-350 ${tableBorderClass}`}>
              {filteredBlocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 font-semibold font-mono">
                    ⚠️ No matching active token stock blocks found in registry.
                  </td>
                </tr>
              ) : (
                filteredBlocks.map((b) => {
                  const isSelected = selectedBlockIds.includes(b.id);
                  return (
                    <tr 
                      key={b.id}
                      className={`transition-colors ${tableRowHoverClass} ${
                        isSelected ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-6 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectBlock(b.id)}
                          className="cursor-pointer h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                        />
                      </td>
                      <td className={`py-3.5 px-4 font-bold font-mono ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{b.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#0b111e] text-cyan-400 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono border border-cyan-400/10">
                          {b.coin}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-right pr-6 font-mono font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                        {b.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </td>
                      <td className="py-3.5 px-4 text-right pr-6 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        Le {b.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </td>
                      <td className={`py-3.5 px-4 text-right pr-6 font-mono text-emerald-600 dark:text-emerald-400 font-extrabold transition-colors duration-200 ${
                        theme === 'light' ? 'bg-slate-100/50' : 'bg-slate-950/20'
                      }`}>
                        Le {(b.quantity * b.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                        {b.date}
                      </td>
                      <td className="py-3.5 px-6 text-[10px] text-slate-400 max-w-[200px] truncate" title={b.notes}>
                        {b.notes || <span className="text-slate-500">-</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADAPTIVE MOBILE LAYOUT: details grids of cards */}
      <div className="md:hidden space-y-3.5 pb-24">
        {filteredBlocks.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs font-mono glass rounded-xl">
            ⚠️ No matching active tokens blocks found.
          </div>
        ) : (
          filteredBlocks.map((b) => {
            const isSelected = selectedBlockIds.includes(b.id);
            return (
              <div 
                key={b.id}
                onClick={() => toggleSelectBlock(b.id)}
                className={`glass p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500' 
                    : theme === 'light' ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      onClick={(e) => e.stopPropagation()}
                      checked={isSelected}
                      onChange={() => toggleSelectBlock(b.id)}
                      className="cursor-pointer h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500"
                    />
                    <span className={`font-bold text-xs font-mono ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{b.id}</span>
                    <span className="bg-[#0b111e] border border-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                      {b.coin}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3" />
                    <span>{b.date}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/40 font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">Volume Hand:</span>
                    <span className={`font-extrabold text-[12px] ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                      {b.quantity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">Acquisition basis:</span>
                    <span className="text-cyan-600 dark:text-cyan-450 font-bold">
                      Le {b.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className={`col-span-full mt-2 p-2 rounded-lg border flex justify-between items-center transition-colors duration-200 ${
                    theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    <span className="text-[9px] text-slate-500 font-sans uppercase font-bold">Real Value Balance</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">
                      Le {(b.quantity * b.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {b.notes && (
                  <div className="mt-2 text-[10px] text-slate-500 bg-slate-950/45 p-2 rounded-lg border border-slate-800 italic truncate" title={b.notes}>
                    Note: {b.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
