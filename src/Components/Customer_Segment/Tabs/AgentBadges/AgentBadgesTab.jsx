import React from "react";
import { Loader2, Award, ShieldAlert } from "lucide-react";
import {
  useGetMyBadgeQuery,
  useGetBadgeHistoryQuery,
  useGetLeaderboardQuery,
} from "../../../../REDUX_FEATURES/REDUX_SLICES/agentBadgeApi/agentBadgeApi";
import BadgeProgressCard from "./Shared/BadgeProgressCard";
import LeaderboardTable from "./Shared/LeaderboardTable";
import BadgeHistoryTimeline from "./Shared/BadgeHistoryTimeline";

const AgentBadgesTab = () => {
  const {
    data: myBadge,
    isLoading: myBadgeLoading,
    isError: myBadgeError,
    refetch: refetchBadge,
  } = useGetMyBadgeQuery();

  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useGetBadgeHistoryQuery();

  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    isError: leaderboardError,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardQuery();

  const handleRetry = () => {
    refetchBadge();
    refetchHistory();
    refetchLeaderboard();
  };

  const isLoading = myBadgeLoading || historyLoading || leaderboardLoading;
  const isError = myBadgeError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500">
          Loading achievements dashboard...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-400" />
        <p className="text-sm font-semibold">
          Failed to load agent achievements.
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // Fallback in case backend returns nested timelines inside myBadge
  const timelineHistory = history || myBadge?.badgeHistory || [];

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Agent Loyalty Achievements
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track closed deal numbers, view badge tier progressions, and see where you rank on the leadership board.
          </p>
        </div>
      </div>

      {/* Current Progress Widget */}
      <BadgeProgressCard myBadge={myBadge} />

      {/* Grid for Leaderboard and History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <LeaderboardTable leaderboard={leaderboard} />
        </div>
        <div className="lg:col-span-5">
          <BadgeHistoryTimeline history={timelineHistory} />
        </div>
      </div>
    </div>
  );
};

export default AgentBadgesTab;
