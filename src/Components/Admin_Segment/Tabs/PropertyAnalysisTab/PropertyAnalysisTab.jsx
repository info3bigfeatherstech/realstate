import React, { useState, useMemo } from "react";
import {
  Eye,
  Users,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  BarChart3,
  PieChart,
  UserCheck,
} from "lucide-react";
import { useGetPropertiesQuery } from "../../Admin_Redux/PropertyApi/propertyApi";
import {
  useGetAllPropertiesViewStatsQuery,
  useGetPropertyViewStatsQuery,
  useGetPropertyViewersQuery,
} from "../../Admin_Redux/PropertyViewsApi/propertyViewsApi";

const PropertyAnalysisTab = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [viewersPage, setViewersPage] = useState(1);
  const viewersLimit = 10;

  // 1. Fetch properties list (for dropdown selection)
  const {
    data: propertiesData,
    isLoading: isPropertiesLoading,
    refetch: refetchProperties,
  } = useGetPropertiesQuery({ limit: 100 });

  const propertiesList = useMemo(() => {
    return propertiesData?.data || [];
  }, [propertiesData]);

  // 2. Fetch overall view stats (for the top properties chart)
  const {
    data: overallStats,
    isLoading: isOverallStatsLoading,
    isFetching: isOverallStatsFetching,
    refetch: refetchOverallStats,
  } = useGetAllPropertiesViewStatsQuery();

  // 3. Fetch stats for the currently selected property
  const {
    data: selectedPropertyStats,
    isLoading: isSelectedStatsLoading,
    isFetching: isSelectedStatsFetching,
    refetch: refetchSelectedStats,
  } = useGetPropertyViewStatsQuery(selectedPropertyId, {
    skip: !selectedPropertyId,
  });

  // 4. Fetch viewers log for the currently selected property
  const {
    data: viewersData,
    isLoading: isViewersLoading,
    isFetching: isViewersFetching,
    refetch: refetchViewers,
  } = useGetPropertyViewersQuery(
    {
      propertyId: selectedPropertyId,
      params: { page: viewersPage, limit: viewersLimit },
    },
    { skip: !selectedPropertyId }
  );

  const viewersList = useMemo(() => {
    return viewersData?.data || [];
  }, [viewersData]);

  const viewersMeta = useMemo(() => {
    return viewersData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };
  }, [viewersData]);

  // Set default selected property once data loads
  React.useEffect(() => {
    if (propertiesList.length > 0 && !selectedPropertyId) {
      // Set to first property in the list
      setSelectedPropertyId(propertiesList[0]._id);
    }
  }, [propertiesList, selectedPropertyId]);

  // Handler to refresh all queries
  const handleRefreshAll = () => {
    refetchProperties();
    refetchOverallStats();
    if (selectedPropertyId) {
      refetchSelectedStats();
      refetchViewers();
    }
  };

  // Select property handler
  const handleSelectProperty = (id) => {
    setSelectedPropertyId(id);
    setViewersPage(1);
  };

  // Building (Bar) Chart Math & SVG render
  const buildingChart = useMemo(() => {
    if (!overallStats || overallStats.length === 0) return null;
    // Filter to top 8 properties to ensure layout fits perfectly
    const topStats = overallStats.slice(0, 8);
    const maxViews = Math.max(...topStats.map((p) => p.totalViews), 1);
    const svgWidth = 800;
    const svgHeight = 280;
    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;
    const barGap = 15;
    const barWidth = chartWidth / topStats.length - barGap;

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="buildingGradSelected" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const value = Math.round(maxViews * ratio);
          return (
            <g key={idx} className="opacity-30">
              <line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-medium"
              >
                {value}
              </text>
            </g>
          );
        })}
        {/* Bars */}
        {topStats.map((item, idx) => {
          const isSelected = item.propertyId === selectedPropertyId;
          const barHeight = (item.totalViews / maxViews) * chartHeight;
          const x = padding.left + idx * (barWidth + barGap) + barGap / 2;
          const y = padding.top + chartHeight - barHeight;
          const title = item.property?.title || "Deleted Property";
          const shortTitle =
            title.length > 12 ? title.slice(0, 10) + "..." : title;
          return (
            <g
              key={item.propertyId}
              className="cursor-pointer group"
              onClick={() => handleSelectProperty(item.propertyId)}
            >
              <title>{`${title}\nViews: ${item.totalViews}\nUnique: ${item.uniqueViews}`}</title>
              {/* Building Facade Block */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={
                  isSelected
                    ? "url(#buildingGradSelected)"
                    : "url(#buildingGrad)"
                }
                className="transition-all duration-300 group-hover:opacity-90"
              />
              {/* View count on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className={`text-[10px] font-bold ${
                  isSelected ? "fill-violet-600" : "fill-blue-600"
                }`}
              >
                {item.totalViews}
              </text>
              {/* Property label rotated underneath */}
              <text
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 15}
                textAnchor="middle"
                transform={`rotate(12, ${x + barWidth / 2}, ${
                  padding.top + chartHeight + 15
                })`}
                className={`text-[9px] font-semibold transition-colors duration-200 ${
                  isSelected
                    ? "fill-violet-700 font-bold"
                    : "fill-slate-500 group-hover:fill-slate-800"
                }`}
              >
                {shortTitle}
              </text>
            </g>
          );
        })}
        {/* Axis line */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={svgWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
      </svg>
    );
  }, [overallStats, selectedPropertyId]);

  // Donut (Circular) Chart Math & SVG render
  const donutChart = useMemo(() => {
    const breakdown = selectedPropertyStats?.viewerBreakdown || [];
    const totalViews = selectedPropertyStats?.totalViews || 0;
    if (totalViews === 0 || breakdown.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <PieChart className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-xs text-slate-400 font-medium">
            No breakdown data recorded yet
          </p>
        </div>
      );
    }
    const radius = 50;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius; // ~314.159
    let accumulatedPercentage = 0;
    const segments = breakdown.map((item) => {
      const percentage = (item.count / totalViews) * 100;
      const dashLength = (percentage / 100) * circumference;
      const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
      const strokeDashoffset = -accumulatedPercentage * circumference;
      accumulatedPercentage += percentage / 100;
      // Type labels & colors mapping
      let label = "Guest Viewer";
      let color = "#3b82f6"; // blue
      let colorClass = "bg-blue-500";
      const type = item.viewerType?.toLowerCase();
      if (type === "seeker") {
        label = "Property Seeker";
        color = "#8b5cf6"; // violet
        colorClass = "bg-violet-500";
      } else if (type === "owner") {
        label = "Property Owner";
        color = "#10b981"; // emerald
        colorClass = "bg-emerald-500";
      } else if (type === "agent" || type === "admin" || type === "super_admin") {
        label = "Admin / Agent";
        color = "#f59e0b"; // amber
        colorClass = "bg-amber-500";
      }
      return {
        ...item,
        label,
        color,
        colorClass,
        percentage: percentage.toFixed(1),
        strokeDasharray,
        strokeDashoffset,
      };
    });

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
        {/* SVG Circle Stack */}
        <div className="relative w-40 h-40">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            className="transform -rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg, idx) => (
              <circle
                key={idx}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-90"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">
              {totalViews}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Views
            </span>
          </div>
        </div>
        {/* Legend */}
        <div className="space-y-2.5 flex-1 min-w-[150px]">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs border-b border-slate-50 pb-1.5 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${seg.colorClass}`} />
                <span className="font-semibold text-slate-600">
                  {seg.label}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800">{seg.count}</span>
                <span className="text-slate-400 ml-1">
                  ({seg.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [selectedPropertyStats]);

  // Selected property details
  const selectedProperty = useMemo(() => {
    return propertiesList.find((p) => p._id === selectedPropertyId);
  }, [propertiesList, selectedPropertyId]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Property Views Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track user engagement and visitor patterns on your real estate
            listings.
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              isPropertiesLoading ||
              isOverallStatsFetching ||
              isSelectedStatsFetching ||
              isViewersFetching
                ? "animate-spin"
                : ""
            }`}
          />
          Refresh Stats
        </button>
      </div>

      {/* 2. Building Chart Card (Comparison Across All Properties) */}
      <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Top Performing Properties
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Click on any building tower below to inspect detailed view logs
              </p>
            </div>
          </div>
        </div>
        {isOverallStatsLoading ? (
          <div className="flex items-center justify-center h-[260px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : !overallStats || overallStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[260px] border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400 font-semibold">
              No view stats recorded yet
            </p>
          </div>
        ) : (
          <div className="h-[280px] w-full flex items-center justify-center">
            {buildingChart}
          </div>
        )}
      </div>

      {/* 3. Dropdown Selector & Selected Property Analytics */}
      <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              Individual Property Deep-Dive
            </h3>
          </div>
          {/* Dropdown Selector */}
          <div className="min-w-[260px]">
            {isPropertiesLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading properties...
              </div>
            ) : (
              <select
                value={selectedPropertyId}
                onChange={(e) => handleSelectProperty(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer font-medium"
              >
                <option value="" disabled>
                  Select a property to analyze...
                </option>
                {propertiesList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.listingId})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {selectedPropertyId ? (
          <>
            {/* Selected Property Title Badge */}
            {selectedProperty && (
              <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Inspecting:
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedProperty.title}
                </span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-md font-bold">
                  ID: {selectedProperty.listingId}
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md font-bold border border-blue-100">
                  {selectedProperty.listingType}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                  {selectedProperty.propertyType}
                </span>
              </div>
            )}

            {/* Metrics cards grid */}
            {isSelectedStatsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-50 animate-pulse rounded-xl border border-slate-100"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Views Card */}
                <div className="p-4 rounded-xl border border-slate-150 bg-white hover:shadow-sm transition-all flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Total Views
                    </div>
                    <div className="text-xl font-bold text-slate-800 mt-0.5">
                      {selectedPropertyStats?.totalViews ?? 0}
                    </div>
                  </div>
                </div>
                {/* Unique Views Card */}
                <div className="p-4 rounded-xl border border-slate-150 bg-white hover:shadow-sm transition-all flex items-center gap-4">
                  <div className="p-2.5 bg-violet-50 text-violet-600 rounded-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Unique Visitors
                    </div>
                    <div className="text-xl font-bold text-slate-800 mt-0.5">
                      {selectedPropertyStats?.uniqueViews ?? 0}
                    </div>
                  </div>
                </div>
                {/* 7 Days Views Card */}
                <div className="p-4 rounded-xl border border-slate-150 bg-white hover:shadow-sm transition-all flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Last 7 Days
                    </div>
                    <div className="text-xl font-bold text-slate-800 mt-0.5">
                      {selectedPropertyStats?.viewsLast7Days ?? 0}
                    </div>
                  </div>
                </div>
                {/* 30 Days Views Card */}
                <div className="p-4 rounded-xl border border-slate-150 bg-white hover:shadow-sm transition-all flex items-center gap-4">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Last 30 Days
                    </div>
                    <div className="text-xl font-bold text-slate-800 mt-0.5">
                      {selectedPropertyStats?.viewsLast30Days ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Split layout: Donut Breakdown + Viewers Log Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Donut Chart breakdown */}
              <div className="lg:col-span-1 border border-slate-150 rounded-xl p-4.5 bg-white">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2.5">
                  <PieChart className="w-4 h-4 text-slate-500" />
                  <h4 className="font-bold text-sm text-slate-800">
                    Viewer Type breakdown
                  </h4>
                </div>
                {isSelectedStatsLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                  </div>
                ) : (
                  donutChart
                )}
              </div>

              {/* Right Column: Viewers list log table */}
              <div className="lg:col-span-2 border border-slate-150 rounded-xl p-4.5 bg-white flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <h4 className="font-bold text-sm text-slate-800">
                        Real-Time Viewer Logs
                      </h4>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      {viewersMeta.total} records
                    </span>
                  </div>
                  <div className="overflow-x-auto min-h-[160px]">
                    {isViewersLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                      </div>
                    ) : viewersList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                        <Users className="w-6 h-6 text-slate-200 mb-1" />
                        <p className="text-xs font-semibold">
                          No view records recorded for this property
                        </p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50">
                            <th className="py-2.5 px-3">Viewer Name</th>
                            <th className="py-2.5 px-3">Contact Details</th>
                            <th className="py-2.5 px-3">Viewer Type</th>
                            <th className="py-2.5 px-3">Viewed Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {viewersList.map((viewer) => {
                            const accType =
                              viewer.viewerType ||
                              viewer.viewerId?.accountType ||
                              "Guest";
                            const isGuest = accType.toLowerCase() === "guest";
                            const badgeStyle =
                              accType.toLowerCase() === "seeker"
                                ? "bg-violet-50 text-violet-700 border-violet-100"
                                : accType.toLowerCase() === "owner"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : isGuest
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-amber-50 text-amber-700 border-amber-100";
                            const date = new Date(viewer.viewedAt);
                            const formattedDate = date.toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            );
                            const formattedTime = date.toLocaleTimeString(
                              "en-IN",
                              { hour: "2-digit", minute: "2-digit" }
                            );
                            return (
                              <tr
                                key={viewer._id}
                                className="hover:bg-slate-50/40 transition-colors"
                              >
                                <td className="py-3 px-3">
                                  <span className="font-semibold text-slate-800">
                                    {viewer.viewerName ||
                                      viewer.viewerId?.fullName ||
                                      "Anonymous Guest"}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-col text-[11px]">
                                    <span className="text-slate-500">
                                      {viewer.viewerEmail ||
                                        viewer.viewerId?.email ||
                                        "—"}
                                    </span>
                                    {viewer.viewerMobile ||
                                    viewer.viewerId?.mobile ? (
                                      <span className="text-slate-400">
                                        {viewer.viewerMobile ||
                                          viewer.viewerId?.mobile}
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2 py-0.5 border rounded-md text-[10px] font-bold ${badgeStyle}`}
                                  >
                                    {accType.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-col text-[11px] text-slate-500 font-medium">
                                    <span>{formattedDate}</span>
                                    <span className="text-[10px] text-slate-400">
                                      {formattedTime}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Viewer Logs Pagination */}
                {viewersMeta.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[11px] text-slate-500">
                    <span>
                      Showing {(viewersMeta.page - 1) * viewersMeta.limit + 1}–
                      {Math.min(
                        viewersMeta.page * viewersMeta.limit,
                        viewersMeta.total
                      )}{" "}
                      of {viewersMeta.total} records
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewersPage((p) => Math.max(1, p - 1))}
                        disabled={viewersPage === 1}
                        className="p-1 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-slate-800">
                        {viewersPage} / {viewersMeta.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setViewersPage((p) =>
                            Math.min(viewersMeta.totalPages, p + 1)
                          )
                        }
                        disabled={viewersPage === viewersMeta.totalPages}
                        className="p-1 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">
            Select a property from the dropdown above to view detailed reports.
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyAnalysisTab;
