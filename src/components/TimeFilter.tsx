/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar } from 'lucide-react';

export type TimeFilterOption = 'today' | 'this_week' | 'this_month' | 'all_time' | 'custom';

interface TimeFilterProps {
  selectedOption: TimeFilterOption;
  onChangeOption: (option: TimeFilterOption) => void;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  theme: 'dark' | 'light';
  idPrefix?: string;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  selectedOption,
  onChangeOption,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  theme,
  idPrefix = 'tf'
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2" id={`${idPrefix}-container`}>
      <div className="relative">
        <select
          id={`${idPrefix}-select`}
          value={selectedOption}
          onChange={(e) => onChangeOption(e.target.value as TimeFilterOption)}
          className={`appearance-none font-sans font-bold text-xs uppercase tracking-wider px-3.5 pr-8 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer duration-200 ${
            theme === 'light'
              ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <option value="all_time" id={`${idPrefix}-opt-all`}>All Time</option>
          <option value="today" id={`${idPrefix}-opt-today`}>Today</option>
          <option value="this_week" id={`${idPrefix}-opt-week`}>This Week</option>
          <option value="this_month" id={`${idPrefix}-opt-month`}>This Month</option>
          <option value="custom" id={`${idPrefix}-opt-custom`}>Custom Range</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
        </div>
      </div>

      {selectedOption === 'custom' && (
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-2 animate-slide-down" 
          id={`${idPrefix}-custom-inputs`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">From</span>
            <input
              type="date"
              id={`${idPrefix}-start-input`}
              value={startDate}
              onChange={(e) => onChangeStartDate(e.target.value)}
              className={`font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:ring-1 focus:ring-cyan-500 outline-none ${
                theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">To</span>
            <input
              type="date"
              id={`${idPrefix}-end-input`}
              value={endDate}
              onChange={(e) => onChangeEndDate(e.target.value)}
              className={`font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:ring-1 focus:ring-cyan-500 outline-none ${
                theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const filterRecordsByTime = <T extends { date?: string; timestamp?: string }>(
  records: T[],
  option: TimeFilterOption,
  startDate: string,
  endDate: string
): T[] => {
  if (option === 'all_time') return records;

  const now = new Date();
  
  // Today's boundaries
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // This Week's boundaries
  const dayOfWeek = now.getDay();
  // Set to current Sunday or Monday
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
  
  // This Month's boundaries
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return records.filter(r => {
    const rawDate = r.timestamp || r.date;
    if (!rawDate) return false;
    
    const recordDate = new Date(rawDate);
    
    switch (option) {
      case 'today':
        return recordDate >= todayStart;
      case 'this_week':
        return recordDate >= weekStart;
      case 'this_month':
        return recordDate >= monthStart;
      case 'custom':
        if (startDate) {
          const sDate = new Date(startDate + 'T00:00:00');
          if (recordDate < sDate) return false;
        }
        if (endDate) {
          const eDate = new Date(endDate + 'T23:59:59');
          if (recordDate > eDate) return false;
        }
        return true;
      default:
        return true;
    }
  });
};
