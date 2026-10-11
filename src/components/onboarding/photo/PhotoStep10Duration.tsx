import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Clock, Calendar, Check } from 'lucide-react';

interface PhotoStep10DurationProps {
  durationMode: '24_hours' | '3_days' | '7_days' | '30_days' | 'custom';
  setDurationMode: (mode: '24_hours' | '3_days' | '7_days' | '30_days' | 'custom') => void;
  endDate: string;
  setEndDate: (date: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  onNext: () => void;
}

export default function PhotoStep10Duration({
  durationMode = '3_days',
  setDurationMode,
  endDate,
  setEndDate,
  endTime = '10:00 PM',
  setEndTime,
  onNext,
}: PhotoStep10DurationProps) {
  // Calendar month state for custom mode
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // August
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(28);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const presets: { id: '24_hours' | '3_days' | '7_days' | '30_days'; title: string; desc: string; badge?: string }[] = [
    { id: '24_hours', title: '24 Hours', desc: 'Album closes the next morning' },
    { id: '3_days', title: '3 Days', desc: 'Perfect for weekend celebrations', badge: 'Recommended' },
    { id: '7_days', title: '7 Days', desc: 'Great for reunions and multi-day trips' },
    { id: '30_days', title: '30 Days', desc: 'Extended upload window for everyone' },
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // Monday start

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const monthStr = (currentMonthIndex + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    setEndDate(`${currentYear}-${monthStr}-${dayStr}`);
  };

  return (
    <div className="space-y-5 sm:space-y-6 text-left" id="photo-step-10-duration">
      {/* Step Header */}
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E6FFFA] border border-[#99F6E4] text-[#0E7A6B] text-[11px] font-bold tracking-tight mb-0.5">
          <Sparkles className="w-3 h-3 text-[#0E7A6B]" />
          <span>Step 10 • Collection Duration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-sans">
          How long should photo collection stay open?
        </h2>
        <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
          The album will close automatically to new uploads after your chosen duration.
        </p>
      </div>

      {/* Preset Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {presets.map((preset) => {
          const isSelected = durationMode === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => setDurationMode(preset.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-sm ring-2 ring-[#0E7A6B]/15'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 ${isSelected ? 'text-[#0E7A6B]' : 'text-slate-400'}`} />
                  <h4 className="text-sm sm:text-base font-bold text-[#0B132B]">{preset.title}</h4>
                </div>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : preset.badge ? (
                  <span className="text-[10px] font-bold text-[#0E7A6B] bg-[#E6FFFA] px-2 py-0.5 rounded-full border border-[#99F6E4]">
                    {preset.badge}
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {preset.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Custom Duration Toggle & Date Picker */}
      <div className="pt-1">
        <div
          onClick={() => setDurationMode('custom')}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between ${
            durationMode === 'custom'
              ? 'border-[#0E7A6B] bg-[#F0FDF9] shadow-sm ring-2 ring-[#0E7A6B]/15'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B132B]">Choose Custom End Date & Time</h4>
              <p className="text-[11px] text-[#6B7280]">Set an exact deadline for photo submissions.</p>
            </div>
          </div>
          {durationMode === 'custom' && (
            <div className="w-5 h-5 rounded-full bg-[#0E7A6B] text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Custom Mini Calendar */}
        {durationMode === 'custom' && (
          <div className="mt-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-[#0B132B]">
                {monthNames[currentMonthIndex]} {currentYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
              <span>MO</span>
              <span>TU</span>
              <span>WE</span>
              <span>TH</span>
              <span>FR</span>
              <span>SA</span>
              <span>SU</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7 sm:h-8" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selectedDay === dayNum;
                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-7 sm:h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E7A6B] text-white shadow-xs font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Prominent Continue Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-step-10"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
