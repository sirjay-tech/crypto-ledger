/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLedger } from '../context/LedgerContext';
import { MinusCircle, ArrowRightLeft, TrendingUp, Info, Wallet } from 'lucide-react';

export const SellView: React.FC = () => {
  const { 
    inventory, 
    supportedCoins, 
    wallets, 
    processSellOrder, 
    addToast,
    setActiveView,
    theme 
  } = useLedger();

  // Form selections and variables
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [sellQty, setSellQty] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load first wallet as default if set
  useEffect(() => {
    if (wallets && wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0].name);
    }
  }, [wallets, selectedWallet]);

  // Filter available block nodes matching the chosen coin type
  const matchingBlocks = inventory.filter(b => b.coin === selectedCoin && b.quantity > 0.000001);

  // Synchronize when the user changes coin types, reset the block selection
  useEffect(() => {
    setSelectedBlockId('');
    setSellQty('');
  }, [selectedCoin]);

  // Find selected block parameters to output a details panel and validate maximum bounds
  const activeBlockDesc = inventory.find(b => b.id === selectedBlockId);

  // Run reactive calculations on input parameters
  const qtyNum = parseFloat(sellQty) || 0;
  const priceNum = parseFloat(sellPrice) || 0;
  
  const grossInflow = qtyNum * priceNum;
  
  // Realized profit calculation based on block original buy cost basis
  const originalBuyCostUnit = activeBlockDesc ? activeBlockDesc.price : 0;
  const realizedNetProfit = qtyNum > 0 ? (grossInflow - (qtyNum * originalBuyCostUnit)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCoin) {
      addToast('Validation fault: Choose coin type target.', 'error');
      return;
    }

    if (!selectedBlockId) {
      addToast('Validation fault: Select active inventory block source.', 'error');
      return;
    }

    if (qtyNum <= 0 || priceNum <= 0) {
      addToast('Validation fault: Volume and sale price must exceed zero.', 'error');
      return;
    }

    if (activeBlockDesc && qtyNum > activeBlockDesc.quantity) {
      addToast(`Validation fault: Volume (${qtyNum}) exceeds block stock (${activeBlockDesc.quantity} left).`, 'error');
      return;
    }

    const confirmSale = window.confirm(`Confirm execution of trade? Selling ${qtyNum} ${selectedCoin} from block ${selectedBlockId} at Le ${priceNum.toLocaleString()} unit price.`);
    if (!confirmSale) return;

    setIsSubmitting(true);
    const success = await processSellOrder(
      selectedBlockId,
      qtyNum,
      priceNum,
      selectedWallet
    );

    setIsSubmitting(false);

    if (success) {
      setSelectedCoin('');
      setSelectedBlockId('');
      setSellQty('');
      setSellPrice('');
      setActiveView('dashboard');
    }
  };

  const textTitleColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const inputBgClass = theme === 'light' ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-800';

  return (
    <div className="max-w-xl mx-auto glass p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 glow-emerald animate-fade-in">
      
      {/* View Header Banner */}
      <div>
        <h3 className={`text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2 ${textTitleColor}`}>
          <MinusCircle className="w-5 h-5 text-emerald-500" />
          <span>Sell Order Entry</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-mono mt-1">
          📤 Realizes profit by discharging quantity allocations from an active stock block.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cascade Selector Part A: Coin select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
              1. Crypto Token Filter
            </label>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${inputBgClass}`}
              required
            >
              <option value="">-- Choose Asset --</option>
              {supportedCoins.map(coin => (
                <option key={coin} value={coin}>{coin} Positions</option>
              ))}
            </select>
          </div>

          {/* Cascade Selector Part B: Choose matching available blocks */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
              2. Target Block ID Source
            </label>
            <select
              value={selectedBlockId}
              disabled={!selectedCoin}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${inputBgClass} ${
                !selectedCoin ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              required
            >
              <option value="">
                {!selectedCoin 
                  ? '-- Specify Coin Step 1 --' 
                  : matchingBlocks.length === 0 
                    ? 'No matching active blocks' 
                    : '-- Select Active Block --'
                }
              </option>
              {matchingBlocks.map(block => (
                <option key={block.id} value={block.id}>
                  {block.id} ({block.quantity.toLocaleString()} left)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected block analytics info panel */}
        {activeBlockDesc && (
          <div className={`border rounded-xl p-4 flex gap-3 text-xs shadow-inner ${
            theme === 'light' ? 'bg-slate-100/80 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-emerald-950/40 text-slate-300'
          }`}>
            <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1 font-mono text-[11px]">
              <div className="font-bold text-slate-500 font-sans uppercase text-[10px] tracking-wide mb-1 flex items-center gap-1">
                <span>Selected position telemetry:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs">{activeBlockDesc.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity Stock Left:</span>
                <span className={`font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{activeBlockDesc.quantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Block Unit Cost Basis:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">Le {activeBlockDesc.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Volume Discharge and Price inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
              3. Volume to Discharge
            </label>
            <input
              type="number"
              step="any"
              min="0.000001"
              max={activeBlockDesc ? activeBlockDesc.quantity : undefined}
              value={sellQty}
              onChange={(e) => setSellQty(e.target.value)}
              disabled={!selectedBlockId}
              className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500 ${inputBgClass} ${
                !selectedBlockId ? 'opacity-50 cursor-not-allowed font-medium' : ''
              }`}
              placeholder="Discharge quantity"
              required
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
              4. Sell Unit Price (Leones)
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              disabled={!selectedBlockId}
              className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500 ${inputBgClass} ${
                !selectedBlockId ? 'opacity-50 cursor-not-allowed font-medium' : ''
              }`}
              placeholder="Discharge price Le"
              required
            />
          </div>
        </div>

        {/* Trade dynamic calculations panel */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className={`border rounded-xl p-3.5 flex flex-col justify-between shadow-inner select-none ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">Gross cash inflow</span>
            <span className={`text-xs md:text-sm font-black font-mono mt-1 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
              Le {grossInflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className={`border rounded-xl p-3.5 flex flex-col justify-between shadow-inner select-none ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${realizedNetProfit >= 0 ? 'bg-emerald-555 bg-emerald-500' : 'bg-rose-500'}`}></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">Realized margin profit</span>
            </div>
            <span className={`text-xs md:text-sm font-black font-mono mt-1 ${
              realizedNetProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'
            }`}>
              Le {realizedNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Input: Destination receipt wallet selector */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
            5. Destination Receipt Wallet
          </label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${inputBgClass}`}
            required
          >
            <option value="">-- Choose Account --</option>
            {wallets.map(w => (
              <option key={w.name} value={w.name}>
                {w.name} Ledger Reservoir (Le {w.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Execute button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-500 hover:bg-emerald-500/20 active:scale-95 text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 cursor-pointer glow-emerald"
        >
          {isSubmitting ? 'Recording trade discharge...' : 'Execute Sell Outflow'}
        </button>
      </form>
    </div>
  );
};
