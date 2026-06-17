/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../context/LedgerContext';
import { Sliders, PlusCircle, Trash2, HelpCircle, LogOut, Cloud, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { currentUser, logOut } = useAuth();
  const { 
    settings, 
    updateSettingValue, 
    deleteSetting, 
    resetToDefault, 
    theme, 
    toggleTheme,
    wallets,
    updateWalletBalance
  } = useLedger();

  // Input states
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newKey.trim()) return;

    setIsSaving(true);
    // Upper case the settings keys to maintain absolute consistency
    const cleanKey = newKey.trim().toUpperCase().replace(/\s+/g, '_');
    const success = await updateSettingValue(cleanKey, newValue.trim());
    setIsSaving(false);

    if (success) {
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Primary configuration card */}
      <div className="glass p-5 md:p-8 rounded-2xl shadow-xl space-y-6 glow-amber">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <span>Configuration Engine Registry</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              🎛️ Manages operational thresholds, trading locks, and Google Apps Script API endpoints.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20 shadow-sm'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Create/Modify variable parameter */}
        <form onSubmit={handleSubmit} className="bg-slate-950/80 p-4 rounded-xl border border-slate-808 border-slate-850 border-slate-800 space-y-4 shadow-inner">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Create or edit setting variable:
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Key Name</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. MIN_PROFIT_MARGIN_PCT"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-250 outline-none focus:ring-1 focus:ring-amber-500 text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Value parameter</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value (string or numeric)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-250 outline-none focus:ring-1 focus:ring-amber-500 text-white font-bold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 border border-amber-400/30 text-amber-450 text-amber-400 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider select-none cursor-pointer transition-all duration-300 glow-amber"
          >
            {isSaving ? 'Writing registry...' : 'Commit Parameter to Registry'}
          </button>
        </form>

        {/* Existing keys table display */}
        <div className="border border-slate-808 border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-950/40">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#1e293b]/30 text-slate-400 font-bold uppercase tracking-wider text-[10px] select-none border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Registry Parameter Keys</th>
                <th className="py-3 px-4">Value bound</th>
                <th className="py-3 px-4 text-center w-16">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-350 font-mono">
              {settings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-600 font-sans font-semibold">
                    No properties declared in local memory registry.
                  </td>
                </tr>
              ) : (
                settings.map((s) => (
                  <tr key={s.key} className="hover:bg-slate-900/30">
                    <td className="py-3.5 px-4 font-bold text-slate-205 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span>
                      <span>{s.key}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-400 font-bold truncate max-w-xs" title={s.value}>
                      {s.value || <span className="text-slate-600 italic">EMPTY</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteSetting(s.key)}
                        className="p-1 px-2 border border-slate-800 hover:border-rose-950 text-slate-600 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                        title={`Delete key ${s.key}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructional guide cards info */}
      <div className="glass rounded-2xl p-5 space-y-3 shadow-md">
        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Configuring Google Apps Script Backend integration</span>
        </h4>
        <div className="text-[11px] text-slate-450 font-sans space-y-2 leading-relaxed">
          <p className="text-slate-400">
            You can synchronize this front-end interface directly with your live Google Spreadsheet by setting up a Google Apps Script Web App:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-slate-400">
            <li>Open Google Drive and create a fresh spreadsheet called <b className="text-white">Crypto P2P Ledger</b>.</li>
            <li>Select Extensions &gt; Apps Script. Paste your processing script.</li>
            <li>Click Deploy &gt; New Deployment. Choose Web App, set access to "Anyone" and hit Deploy.</li>
            <li>Copy the generated Web App URL and add the parameter key <code className="text-cyan-400 font-mono">GAS_WEB_APP_URL</code> bound to that URL value above!</li>
          </ol>
          <p className="text-[10px] text-slate-500">
            Once saved, clicking the "Sync database" action in the header will pull/push metrics in real-time. If undefined, local sandbox storage operates cleanly automatically.
          </p>
        </div>
      </div>

      {/* Wallet Balance Adjusters */}
      <div className="glass p-5 md:p-8 rounded-2xl shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>Liquidity Reservoirs Balance Adjuster</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            💰 Tune reservation balances directly across default wallets to update settlement budgets instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wallets.map((w) => (
            <div 
              key={w.name} 
              className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 shadow-inner"
            >
              <div className="text-xs font-bold text-white uppercase tracking-wide">{w.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                Current: <span className="font-bold text-cyan-400">Le {w.balance.toLocaleString()}</span>
              </div>
              <div className="space-y-1">
                <input
                  type="number"
                  placeholder="Set Leones balance"
                  defaultValue={w.balance || 0}
                  onBlur={(e) => {
                    const priceVal = parseFloat(e.target.value);
                    if (!isNaN(priceVal) && priceVal >= 0) {
                      updateWalletBalance(w.name, priceVal);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:ring-1 focus:ring-amber-500 outline-none font-mono font-bold"
                />
                <span className="text-[8px] text-slate-500 block leading-tight">Blur input / click outside to update</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Session Control Card */}
      {currentUser && (
        <div className="glass p-5 md:p-8 rounded-2xl border border-cyan-500/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Cloud className="w-5 h-5 text-cyan-400" />
                <span>Encrypted Cloud Session</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Synced User Identity: <span className="text-slate-200 font-bold">{currentUser.email}</span>
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                UID Ident: <span className="text-slate-400 font-bold">{currentUser.uid}</span>
              </p>
            </div>
            
            <button
              onClick={() => {
                logOut();
              }}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2"
              title="Disconnect Active Cloud Sync Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SECURE LOG OUT</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Operations */}
      <div className="glass p-5 md:p-8 rounded-2xl border border-rose-500/10 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <span>Dangerous Operations</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            ⚠️ Destroy all local journal records, active holdings blocks, and set wallet balances back to 0.
          </p>
        </div>

        <button
          onClick={resetToDefault}
          className="bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/30 text-rose-400 font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider select-none cursor-pointer transition-all duration-300 w-full md:w-auto"
        >
          Reset Database to 0 Default
        </button>
      </div>

    </div>
  );
};
