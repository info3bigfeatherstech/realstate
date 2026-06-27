import React from "react";
import { Trophy, Star, Medal } from "lucide-react";
const LeaderboardTable = ({ leaderboard }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400">
        {" "}
        No active agents found.{" "}
      </div>
    );
  }
  const getRankDecoration = (index) => {
    switch (index) {
      case 0:
        return {
          icon: <Trophy className="w-5 h-5 text-amber-500 fill-amber-50" />,
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          label: "1st Place",
        };
      case 1:
        return {
          icon: <Medal className="w-5 h-5 text-slate-400 fill-slate-50" />,
          bg: "bg-slate-50 border-slate-200 text-slate-800",
          label: "2nd Place",
        };
      case 2:
        return {
          icon: <Medal className="w-5 h-5 text-amber-600 fill-amber-50" />,
          bg: "bg-orange-50 border-orange-200 text-orange-800",
          label: "3rd Place",
        };
      default:
        return {
          icon: <Star className="w-4 h-4 text-slate-300" />,
          bg: "bg-white border-slate-100 text-slate-600",
          label: `#${index + 1}`,
        };
    }
  };
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {" "}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        {" "}
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          {" "}
          <Trophy className="w-4 h-4 text-amber-500" /> Agent Deal
          Leaderboard{" "}
        </h3>{" "}
        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {" "}
          Top Performers{" "}
        </span>{" "}
      </div>{" "}
      <div className="overflow-x-auto">
        {" "}
        <table className="w-full text-sm">
          {" "}
          <thead>
            {" "}
            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs text-left bg-slate-50/50">
              {" "}
              <th className="px-6 py-3 w-20 text-center">Rank</th>{" "}
              <th className="px-6 py-3">Agent Name</th>{" "}
              <th className="px-6 py-3">Badge Tier</th>{" "}
              <th className="px-6 py-3 text-right">Deals Completed</th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody className="divide-y divide-slate-100">
            {" "}
            {leaderboard.map((item, index) => {
              const rankProps = getRankDecoration(index);
              const badgeIcon = item.currentBadge?.icon || "🌱";
              const badgeName = item.currentBadge?.name || "Rookie";
              const badgeColor = item.currentBadge?.color || "#64748b";
              return (
                <tr
                  key={item.agentId?._id || index}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {" "}
                  <td className="px-6 py-4">
                    {" "}
                    <div className="flex justify-center">
                      {" "}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${rankProps.bg}`}
                      >
                        {" "}
                        {rankProps.icon} <span>{rankProps.label}</span>{" "}
                      </span>{" "}
                    </div>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {" "}
                    {item.agentId?.fullName || "Unknown Agent"}{" "}
                  </td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      <span className="text-xl leading-none">
                        {badgeIcon}
                      </span>{" "}
                      <span
                        className="font-semibold text-xs uppercase"
                        style={{ color: badgeColor }}
                      >
                        {" "}
                        {badgeName}{" "}
                      </span>{" "}
                    </div>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-700 text-base">
                    {" "}
                    {item.totalDeals}{" "}
                  </td>{" "}
                </tr>
              );
            })}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
};
export default LeaderboardTable;
