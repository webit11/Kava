import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_CURRENCIES, saveStoredCurrency } from '../lib/billing';

interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange?: (newCurrency: string) => void;
  className?: string;
  variant?: 'compact' | 'pill' | 'select';
}

export default function CurrencySelector({
  currentCurrency,
  onCurrencyChange,
  className = '',
}: CurrencySelectorProps) {
  const activeCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  const handleSelect = (code: string) => {
    saveStoredCurrency(code);
    if (onCurrencyChange) {
      onCurrencyChange(code);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-between bg-slate-100/90 hover:bg-slate-200/60 border border-slate-200/80 rounded-xl px-3 h-10 text-xs font-bold text-slate-800 transition-all cursor-pointer group shrink-0 ${className}`}
    >
      <div className="flex items-center space-x-1.5 pointer-events-none">
        <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="font-bold text-slate-900 tracking-tight whitespace-nowrap text-xs">
          {activeCurrency.code} ({activeCurrency.symbol})
        </span>
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-2 shrink-0 transition-colors pointer-events-none" />
      <select
        value={currentCurrency}
        onChange={(e) => handleSelect(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-slate-900 bg-white"
        aria-label="Select currency"
      >
        {SUPPORTED_CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code} className="text-slate-900 font-medium py-1 text-xs">
            {curr.code} ({curr.symbol}) — {curr.name}
          </option>
        ))}
      </select>
    </div>
  );
}

