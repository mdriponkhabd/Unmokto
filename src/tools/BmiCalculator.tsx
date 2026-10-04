import React, { useState } from 'react';
import { Activity, Heart, Info, Check, AlertCircle } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);

  // Metric values
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial values
  const [weightLbs, setWeightLbs] = useState<number>(155);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);

  const calculateBmi = () => {
    let weightInKg = weightKg;
    let heightInM = heightCm / 100;

    if (unit === 'imperial') {
      weightInKg = weightLbs * 0.45359237;
      const totalInches = heightFeet * 12 + heightInches;
      heightInM = totalInches * 0.0254;
    }

    if (heightInM <= 0 || weightInKg <= 0) return null;

    const bmi = weightInKg / (heightInM * heightInM);
    const roundedBmi = parseFloat(bmi.toFixed(1));

    // Ideal weight bounds (18.5 to 24.9 BMI)
    const minIdealKg = 18.5 * (heightInM * heightInM);
    const maxIdealKg = 24.9 * (heightInM * heightInM);

    // BMR estimation (Mifflin-St Jeor formula)
    let bmr = 10 * weightInKg + 6.25 * (heightInM * 100) - 5 * age;
    bmr += gender === 'male' ? 5 : -161;
    const maintenanceCalories = Math.round(bmr * 1.375); // Light activity multiplier

    let category = '';
    let categoryColor = '';
    let needlePercent = 50;

    if (roundedBmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-amber-500';
      needlePercent = Math.min(25, Math.max(5, (roundedBmi / 18.5) * 25));
    } else if (roundedBmi <= 24.9) {
      category = 'Normal / Healthy Weight';
      categoryColor = 'text-emerald-500';
      needlePercent = 25 + ((roundedBmi - 18.5) / (24.9 - 18.5)) * 25;
    } else if (roundedBmi <= 29.9) {
      category = 'Overweight';
      categoryColor = 'text-amber-500';
      needlePercent = 50 + ((roundedBmi - 25) / (29.9 - 25)) * 25;
    } else {
      category = 'Obese';
      categoryColor = 'text-rose-500';
      needlePercent = Math.min(95, 75 + ((roundedBmi - 30) / 10) * 20);
    }

    return {
      bmi: roundedBmi,
      category,
      categoryColor,
      needlePercent,
      idealMin: unit === 'metric' ? `${minIdealKg.toFixed(1)} kg` : `${(minIdealKg * 2.20462).toFixed(1)} lbs`,
      idealMax: unit === 'metric' ? `${maxIdealKg.toFixed(1)} kg` : `${(maxIdealKg * 2.20462).toFixed(1)} lbs`,
      bmr: Math.round(bmr),
      maintenanceCalories,
    };
  };

  const res = calculateBmi();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Unit switch */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setUnit('metric')}
            className={`rounded-lg px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              unit === 'metric'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Metric (kg, cm)
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`rounded-lg px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              unit === 'imperial'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Imperial (lbs, ft-in)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Parameters */}
        <div className="space-y-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-800/40">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {unit === 'metric' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Feet
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Inches
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="40"
                  max="600"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </>
          )}
        </div>

        {/* Output Gauges & Metrics */}
        {res && (
          <div className="space-y-5 flex flex-col justify-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Your Body Mass Index (BMI)
              </span>
              <p className="text-5xl font-black text-slate-900 dark:text-white my-2">{res.bmi}</p>
              <span className={`text-base font-extrabold ${res.categoryColor}`}>
                {res.category}
              </span>

              {/* Visual Category Meter */}
              <div className="mt-5 space-y-1.5">
                <div className="relative h-3 w-full rounded-full overflow-hidden flex">
                  <div className="h-full w-1/4 bg-amber-400" title="Underweight (<18.5)" />
                  <div className="h-full w-1/4 bg-emerald-500" title="Normal (18.5 - 24.9)" />
                  <div className="h-full w-1/4 bg-amber-500" title="Overweight (25 - 29.9)" />
                  <div className="h-full w-1/4 bg-rose-500" title="Obese (30+)" />
                </div>
                {/* Pointer indicator */}
                <div className="relative w-full h-4">
                  <div
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${res.needlePercent}%` }}
                  >
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-6 border-b-slate-800 dark:border-b-white" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>&lt; 18.5</span>
                  <span>18.5 - 24.9</span>
                  <span>25 - 29.9</span>
                  <span>30+</span>
                </div>
              </div>
            </div>

            {/* Health Insights */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Healthy Weight Range
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {res.idealMin} – {res.idealMax}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Daily Calorie Need
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  ~{res.maintenanceCalories} kcal/day
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
