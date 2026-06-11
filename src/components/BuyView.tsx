/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLedger } from '../context/LedgerContext';
import { PlusCircle, Wallet, FileText, ArrowDownRight, ArrowRightLeft } from 'lucide-react';

export const BuyView: React.FC = () => {
  const { 
    supportedCoins, 
    wallets, 
    processBuyOrder, 
    addToast,
    setActiveView,
    theme 
  } = useLedger();

  // Form State
  const [selectedCoin, setSelectedCoin] = useState<string>(supportedCoins[0] || 'USDT');
  const [quantity, setQuantity] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize selected wallet
  useEffect(() => {
    if (wallets && wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0].name);
    }
  }, [wallets, selectedWallet]);

  // Compute total dynamic outflow basis
  const quantityNum = parseFloat(quantity) || 0;
  const priceNum = parseFloat(buyPrice) || 0;
  const totalOutflow = quantityNum * priceNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantityNum <= 0 || priceNum <= 0) {
      addToast('Validation fault: Volume and purchase price must exceed zero.', 'error');
      return;
    }

    if (!selectedWallet) {
      addToast('Validation fault: Specify target funding liquidity wallet source.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await processBuyOrder(
      selectedCoin,
      quantityNum,
      priceNum,
      notes,
      selectedWallet
    );

    setIsSubmitting(true);
    setIsSubmitting(false);

    if (success) {
      // Clear forms
      setQuantity('');
      setBuyPrice('');
      setNotes('');
      // Navigate to Stock Deck view to inspect results, premium transition flow
      setActiveView('inventory');
    }
  };

  const textTitleColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const inputBgClass = theme === 'light' ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-800';

  return (
    <div className="max-w-xl mx-auto glass p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 glow-cyan animate-fade-in">
      
      {/* Title block banner */}
      <div>
        <h3 className={`text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2 ${textTitleColor}`}>
          <PlusCircle className="w-5 h-5 text-cyan-500" />
          <span>Buy Order Entry</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-mono mt-1">
          📥 Creates a new asset block position in active stock deck ledger.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input 1: Coin selector */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
            1. Select Crypto Asset Token
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer ${inputBgClass}`}
            required
          >
            {supportedCoins.map(coin => (
              <option key={coin} value={coin}>{coin} Position Block</option>
            ))}
          </select>
        </div>

        {/* Input 2: Volume & Price fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
              2. Quantity Purchased (Vol)
            </label>
            <input
              type="number"
              step="any"
              min="0.000001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-cyan-500 ${inputBgClass}`}
              placeholder="e.g. 1500"
              required
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
              3. Buy Unit Price (Leones)
            </label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-cyan-500 ${inputBgClass}`}
              placeholder="Le per unit"
              required
            />
          </div>
        </div>

        {/* Dynamic Outflow panel display */}
        <div className={`border rounded-xl p-4 flex justify-between items-center shadow-inner ${
          theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-slate-450">
            <ArrowRightLeft className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estimated Outflow Basis</span>
          </div>
          <span className="text-sm md:text-base font-black text-cyan-600 dark:text-cyan-400 font-mono">
            Le {totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Input 3: Settlement wallet selection */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
            4. Funding Wallet source
          </label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer ${inputBgClass}`}
            required
          >
            <option value="">-- Choose Account --</option>
            {wallets.map(w => (
              <option key={w.name} value={w.name}>
                {w.name} (Balance: Le {w.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Input 4: Management notes */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
            5. Internal Management/Audit Notes
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-3 text-xs h-16 transition resize-none outline-none focus:ring-1 focus:ring-cyan-500 ${inputBgClass}`}
              placeholder="e.g. Block purchased via orange money merchant #4829"
            ></textarea>
          </div>
        </div>

        {/* Create Block action submission */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-500 hover:bg-cyan-500/20 active:scale-95 text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 cursor-pointer glow-cyan"
        >
          {isSubmitting ? 'Writing block allocation...' : 'Instantiate Block Allocation'}
        </button>
      </form>
    </div>
  );
};
