import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAnalytics: React.FC = () => {
  const { tools, adminToken } = useApp();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res) setData(res);
      })
      .catch(() => {});
  }, [adminToken]);

  const sortedTools = [...tools].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  const maxUsage = sortedTools[0]?.usageCount || 100;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white">Platform Analytics</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Aggregated, privacy-friendly insights into tool engagement and popularity.
        </p>
      </div>

      {/* Usage distribution chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
          Tool Popularity Breakdown
        </h3>

        <div className="space-y-3">
          {sortedTools.map((t) => {
            const count = t.usageCount || 0;
            const pct = Math.round((count / maxUsage) * 100);
            return (
              <div key={t.slug} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{t.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{count} uses</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
