import React from "react";
import { Award, Calendar } from "lucide-react";

const BadgeHistoryTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400">
        No unlocked badge history found. Keep closing deals to level up!
      </div>
    );
  }

  /* Sort history: newer dates first */
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.achievedAt || a.unlockedAt || a.createdAt || 0);
    const dateB = new Date(b.achievedAt || b.unlockedAt || b.createdAt || 0);
    return dateB - dateA;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
        <Award className="w-4 h-4 text-blue-600" /> Badge Upgrade Timeline
      </h3>
      <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6">
        {sortedHistory.map((item, i) => {
          const name = item.badgeName || item.name || "Badge";
          const icon = item.icon || "🏆";
          const color = item.color || "#3b82f6";
          const rawDate = item.achievedAt || item.unlockedAt || item.createdAt;
          const dateStr = rawDate
            ? new Date(rawDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Recently Unlocked";
          return (
            <div key={i} className="relative group">
              {/* Timeline marker */}
              <span
                className="absolute -left-10 top-1.5 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-slate-50 shadow-sm text-lg transition-transform group-hover:scale-115"
                style={{ borderColor: color }}
              >
                {icon}
              </span>
              {/* Box info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4
                    className="text-sm font-bold text-slate-800"
                    style={{ color }}
                  >
                    {name} Unlocked
                  </h4>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                    Level {item.level || 1}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Achieved on{" "}
                  {dateStr}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeHistoryTimeline;
