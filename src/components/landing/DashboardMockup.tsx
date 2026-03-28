import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart3,
  SlidersHorizontal,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface DashboardMockupProps {
  onChatClick: () => void;
}

// Full monthly analytics data
const fullData = [
  { month: "Jan", revenue: 180, leads: 95, conversions: 32, deals: 14, industry: "SaaS", status: "Hot" },
  { month: "Feb", revenue: 210, leads: 110, conversions: 38, deals: 18, industry: "FinTech", status: "Warm" },
  { month: "Mar", revenue: 195, leads: 102, conversions: 35, deals: 15, industry: "Healthcare", status: "Hot" },
  { month: "Apr", revenue: 240, leads: 130, conversions: 45, deals: 22, industry: "SaaS", status: "Hot" },
  { month: "May", revenue: 225, leads: 118, conversions: 40, deals: 19, industry: "E-Commerce", status: "Warm" },
  { month: "Jun", revenue: 280, leads: 145, conversions: 52, deals: 26, industry: "SaaS", status: "Hot" },
  { month: "Jul", revenue: 260, leads: 135, conversions: 48, deals: 24, industry: "FinTech", status: "Warm" },
  { month: "Aug", revenue: 310, leads: 160, conversions: 58, deals: 30, industry: "Cloud", status: "Hot" },
  { month: "Sep", revenue: 295, leads: 150, conversions: 54, deals: 27, industry: "Healthcare", status: "Cold" },
  { month: "Oct", revenue: 340, leads: 175, conversions: 62, deals: 33, industry: "SaaS", status: "Hot" },
  { month: "Nov", revenue: 320, leads: 165, conversions: 59, deals: 31, industry: "E-Commerce", status: "Warm" },
  { month: "Dec", revenue: 380, leads: 190, conversions: 68, deals: 38, industry: "Cloud", status: "Hot" },
];

const industries = ["All", "SaaS", "FinTech", "Healthcare", "E-Commerce", "Cloud"];
const statuses = ["All", "Hot", "Warm", "Cold"];
const metrics = ["Revenue", "Leads", "Conversions", "Deals"];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads", action: "leads" as const },
  { icon: MessageCircle, label: "Chat", action: "chat" as const },
  { icon: BarChart3, label: "Analytics", action: "analytics" as const },
  { icon: SlidersHorizontal, label: "Filters", action: "filters" as const },
];

export function DashboardMockup({ onChatClick }: DashboardMockupProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"dashboard" | "analytics" | "filters">("dashboard");
  const [filterIndustry, setFilterIndustry] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMetric, setFilterMetric] = useState("Revenue");
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return fullData.filter((d) => {
      if (filterIndustry !== "All" && d.industry !== filterIndustry) return false;
      if (filterStatus !== "All" && d.status !== filterStatus) return false;
      return true;
    });
  }, [filterIndustry, filterStatus]);

  const totals = useMemo(() => {
    const r = filteredData.reduce(
      (acc, d) => ({
        revenue: acc.revenue + d.revenue,
        leads: acc.leads + d.leads,
        conversions: acc.conversions + d.conversions,
        deals: acc.deals + d.deals,
      }),
      { revenue: 0, leads: 0, conversions: 0, deals: 0 }
    );
    return [
      { label: "Total Revenue", value: `$${(r.revenue / 100).toFixed(1)}M`, change: "+18.7%", up: true },
      { label: "Total Leads", value: r.leads.toLocaleString(), change: "+12.5%", up: true },
      { label: "Conversions", value: r.conversions.toLocaleString(), change: "+8.3%", up: true },
      { label: "Deals Closed", value: r.deals.toLocaleString(), change: "+15.2%", up: true },
    ];
  }, [filteredData]);

  const metricKey = filterMetric.toLowerCase() as "revenue" | "leads" | "conversions" | "deals";

  const aiOverview = useMemo(() => {
    const total = filteredData.reduce((s, d) => s + d[metricKey], 0);
    const avg = total / (filteredData.length || 1);
    const peak = filteredData.reduce((max, d) => (d[metricKey] > max[metricKey] ? d : max), filteredData[0] || fullData[0]);
    const trend = filteredData.length >= 2
      ? ((filteredData[filteredData.length - 1][metricKey] - filteredData[0][metricKey]) / filteredData[0][metricKey] * 100).toFixed(1)
      : "0";

    return {
      summary: `${filterMetric} shows a ${Number(trend) >= 0 ? "positive" : "negative"} trend of ${trend}% across the filtered period.`,
      peak: `Peak performance in ${peak?.month} with ${metricKey === "revenue" ? "$" + peak?.[metricKey] + "K" : peak?.[metricKey] + " " + filterMetric.toLowerCase()}.`,
      avg: `Average: ${metricKey === "revenue" ? "$" + avg.toFixed(0) + "K" : avg.toFixed(0)} per month.`,
      recommendation: Number(trend) >= 10
        ? "Strong upward momentum — consider scaling acquisition efforts."
        : Number(trend) >= 0
        ? "Steady growth — optimize conversion funnels for acceleration."
        : "Declining trend — review lead quality and outreach strategies.",
    };
  }, [filteredData, metricKey, filterMetric]);

  const handleItemClick = (item: typeof sidebarItems[0]) => {
    if (item.action === "chat") onChatClick();
    else if (item.action === "leads") navigate("/leads");
    else if (item.action === "analytics") setActiveView("analytics");
    else if (item.action === "filters") setShowFilters(!showFilters);
    else setActiveView("dashboard");
  };

  return (
    <section id="dashboard" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Command Center
          </h2>
          <p className="text-muted-foreground text-lg">
            A unified dashboard that puts every metric, lead, and conversation at your fingertips.
          </p>
        </div>

        <motion.div
          className="max-w-5xl mx-auto rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden bg-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden sm:flex w-52 flex-col bg-sidebar border-r border-sidebar-border p-4">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-sidebar-foreground text-sm">SalesmanAI</span>
              </div>

              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left w-full ${
                      (item.active && activeView === "dashboard") ||
                      (item.action === "analytics" && activeView === "analytics") ||
                      (item.action === "filters" && showFilters)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 min-h-[480px]">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Search leads, deals…</span>
                  </div>
                  {/* View toggle pills */}
                  <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                    <button
                      onClick={() => setActiveView("dashboard")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        activeView === "dashboard" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveView("analytics")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        activeView === "analytics" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Analytics
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                      showFilters ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                  </button>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Filter bar */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-border bg-secondary/30 px-6 py-3"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Industry</label>
                      <div className="flex gap-1 mt-1">
                        {industries.map((ind) => (
                          <button
                            key={ind}
                            onClick={() => setFilterIndustry(ind)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              filterIndustry === ind
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Status</label>
                      <div className="flex gap-1 mt-1">
                        {statuses.map((st) => (
                          <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              filterStatus === st
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Metric</label>
                      <div className="flex gap-1 mt-1">
                        {metrics.map((m) => (
                          <button
                            key={m}
                            onClick={() => setFilterMetric(m)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              filterMetric === m
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(filterIndustry !== "All" || filterStatus !== "All") && (
                      <button
                        onClick={() => { setFilterIndustry("All"); setFilterStatus("All"); }}
                        className="flex items-center gap-1 text-[11px] text-primary hover:underline mt-3"
                      >
                        <X className="h-3 w-3" /> Clear filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {totals.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <span className="inline-flex items-center text-xs font-medium mt-1 text-accent">
                      {s.up ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {s.change}
                    </span>
                  </div>
                ))}
              </div>

              {activeView === "dashboard" ? (
                /* Overview: Bar chart */
                <div className="px-6 pb-6">
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{filterMetric} Trend</h4>
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Bar dataKey={metricKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                /* Analytics: Full area chart + AI overview */
                <div className="px-6 pb-6 space-y-4">
                  {/* Area chart */}
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {filterMetric} — Full Analytics
                      </h4>
                      <Legend />
                    </div>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData}>
                          <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey={metricKey}
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorMetric)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Overview */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">AI Analytics Overview</h4>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📈 {aiOverview.summary}</p>
                      <p>🏆 {aiOverview.peak}</p>
                      <p>📊 {aiOverview.avg}</p>
                      <p className="text-foreground font-medium">💡 {aiOverview.recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
