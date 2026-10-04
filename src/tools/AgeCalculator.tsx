import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Gift, Star } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const calculate = () => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      return { error: 'Date of birth cannot be in the future of the target date!' };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayName = daysOfWeek[birth.getDay()];

    // Next birthday
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Western Zodiac
    const getZodiac = (m: number, d: number) => {
      const z = [
        { name: 'Capricorn', start: [1, 1], end: [1, 19] },
        { name: 'Aquarius', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', start: [2, 19], end: [3, 20] },
        { name: 'Aries', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', start: [6, 21], end: [7, 22] },
        { name: 'Leo', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', start: [8, 23], end: [9, 22] },
        { name: 'Libra', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
        { name: 'Capricorn', start: [12, 22], end: [12, 31] },
      ];
      for (const item of z) {
        if (
          (m === item.start[0] && d >= item.start[1]) ||
          (m === item.end[0] && d <= item.end[1])
        ) {
          return item.name;
        }
      }
      return 'Capricorn';
    };

    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());

    // Chinese Zodiac
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const chineseZodiac = animals[(birth.getFullYear() - 4) % 12];

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      remainingDays,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      birthDayName,
      daysUntilNextBday,
      zodiac,
      chineseZodiac,
    };
  };

  const res = calculate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Age as of Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {res && 'error' in res && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400">
          {res.error}
        </div>
      )}

      {res && !('error' in res) && (
        <div className="space-y-6">
          {/* Main Big Result */}
          <div className="rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-6 text-white text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
              Your Chronological Age
            </span>
            <div className="mt-2 flex items-baseline justify-center gap-2 sm:gap-4 flex-wrap">
              <span className="text-3xl sm:text-5xl font-extrabold">{res.years}</span>
              <span className="text-base sm:text-xl font-medium text-emerald-100">Years</span>
              <span className="text-3xl sm:text-5xl font-extrabold">{res.months}</span>
              <span className="text-base sm:text-xl font-medium text-emerald-100">Months</span>
              <span className="text-3xl sm:text-5xl font-extrabold">{res.days}</span>
              <span className="text-base sm:text-xl font-medium text-emerald-100">Days</span>
            </div>
            <p className="mt-3 text-xs text-emerald-100">
              Born on a <strong>{res.birthDayName}</strong> • Next birthday in{' '}
              <strong>{res.daysUntilNextBday} days</strong>!
            </p>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Months', val: res.totalMonths.toLocaleString() },
              { label: 'Total Weeks', val: `${res.totalWeeks.toLocaleString()} w, ${res.remainingDays} d` },
              { label: 'Total Days', val: res.totalDays.toLocaleString() },
              { label: 'Total Hours', val: res.totalHours.toLocaleString() },
              { label: 'Total Minutes', val: res.totalMinutes.toLocaleString() },
              { label: 'Total Seconds', val: res.totalSeconds.toLocaleString() },
              { label: 'Western Zodiac', val: res.zodiac },
              { label: 'Chinese Zodiac', val: res.chineseZodiac },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  {item.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
