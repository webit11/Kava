import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface PhotoStep8DurationProps {
  endDate: string;
  setEndDate: (date: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  onNext: () => void;
}

export default function PhotoStep8Duration({
  endDate,
  setEndDate,
  endTime = '10:00 PM',
  setEndTime,
  onNext,
}: PhotoStep8DurationProps) {
  // Calendar month state
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // August (0-indexed = 7)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(25);

  // Time state parsed from endTime
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
  // Get start weekday (0=Sun, 1=Mon, ..., 6=Sat). We want Monday start:
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // 0 for Mon, 6 for Sun

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const monthStr = (currentMonthIndex + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    setEndDate(`${currentYear}-${monthStr}-${dayStr}`);
  };

  const updateTime = (h: string, m: string, ap: 'AM' | 'PM') => {
    setHour(h);
    setMinute(m);
    setAmpm(ap);
    setEndTime(`${h}:${m} ${ap}`);
  };

  return (
    <div className="space-y-6 text-left" id="photo-step-8-duration">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight font-sans">
          When does your event end?
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] font-normal leading-relaxed">
          The album will close automatically after the time you choose.
        </p>
      </div>

      {/* Calendar Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Calendar Month Header */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            id="btn-calendar-prev"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm sm:text-base font-bold text-[#1F2937]">
            {monthNames[currentMonthIndex]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            id="btn-calendar-next"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
            <span key={day} className="text-[10px] sm:text-xs font-bold text-[#6B7280] py-1">
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty offset padding */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8 sm:h-9" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected = dayNum === selectedDay;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => handleSelectDay(dayNum)}
                className={`h-8 sm:h-9 w-8 sm:w-9 mx-auto rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#0E7A6B] text-white shadow-xs font-bold scale-105'
                    : 'text-[#1F2937] hover:bg-slate-100'
                }`}
                id={`btn-day-${dayNum}`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* End Time Selectors */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <label className="text-xs sm:text-sm font-semibold text-[#1F2937]">
          End Time
        </label>
        <div className="flex items-center space-x-2">
          {/* Hour */}
          <select
            value={hour}
            onChange={(e) => updateTime(e.target.value, minute, ampm)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-[#1F2937] bg-slate-50 focus:outline-none focus:border-[#0E7A6B]"
            id="select-end-hour"
          >
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <span className="font-bold text-slate-400">:</span>

          {/* Minute */}
          <select
            value={minute}
            onChange={(e) => updateTime(hour, e.target.value, ampm)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-[#1F2937] bg-slate-50 focus:outline-none focus:border-[#0E7A6B]"
            id="select-end-minute"
          >
            {['00', '15', '30', '45'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* AM / PM */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => updateTime(hour, minute, 'AM')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                ampm === 'AM' ? 'bg-white text-[#0E7A6B] shadow-2xs' : 'text-slate-500'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => updateTime(hour, minute, 'PM')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                ampm === 'PM' ? 'bg-white text-[#0E7A6B] shadow-2xs' : 'text-slate-500'
              }`}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Continue Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0E7A6B] hover:bg-[#096357] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#0E7A6B]/20 cursor-pointer min-h-[48px]"
          id="btn-continue-step-8"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
