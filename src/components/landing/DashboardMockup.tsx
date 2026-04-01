import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
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
  TrendingUp,
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
  LineChart,
  Line,
} from "recharts";

interface DashboardMockupProps {
  onChatClick: () => void;
}

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

const stockData = [
  { date: "Mon", AAPL: 189, MSFT: 415, GOOGL: 175, NVDA: 880, AMZN: 185 },
  { date: "Tue", AAPL: 191, MSFT: 418, GOOGL: 178, NVDA: 895, AMZN: 187 },
  { date: "Wed", AAPL: 188, MSFT: 412, GOOGL: 174, NVDA: 870, AMZN: 183 },
  { date: "Thu", AAPL: 193, MSFT: 422, GOOGL: 180, NVDA: 910, AMZN: 190 },
  { date: "Fri", AAPL: 195, MSFT: 425, GOOGL: 182, NVDA: 925, AMZN: 192 },
  { date: "Sat", AAPL: 194, MSFT: 420, GOOGL: 179, NVDA: 915, AMZN: 189 },
  { date: "Sun", AAPL: 197, MSFT: 428, GOOGL: 184, NVDA: 940, AMZN: 194 },
];

const industryTrends = [
  { sector: "AI / ML", growth: 34.2, sentiment: "Bullish", marketCap: "$4.2T", topPick: "NVDA" },
  { sector: "Cloud Infra", growth: 22.8, sentiment: "Bullish", marketCap: "$2.8T", topPick: "MSFT" },
  { sector: "SaaS", growth: 18.5, sentiment: "Neutral", marketCap: "$1.9T", topPick: "CRM" },
  { sector: "FinTech", growth: 15.3, sentiment: "Bullish", marketCap: "$1.1T", topPick: "SQ" },
  { sector: "E-Commerce", growth: 12.1, sentiment: "Neutral", marketCap: "$3.5T", topPick: "AMZN" },
  { sector: "HealthTech", growth: 20.4, sentiment: "Bullish", marketCap: "$890B", topPick: "ISRG" },
];

const stockColors: Record<string, string> = {
  AAPL: "hsl(var(--primary))",
  MSFT: "hsl(var(--accent))",
  GOOGL: "#f59e0b",
  NVDA: "#10b981",
  AMZN: "#8b5cf6",
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads", action: "leads" as const },
  { icon: MessageCircle, label: "Chat", action: "chat" as const },
  { icon: BarChart3, label: "Analytics", action: "analytics" as const },
  { icon: TrendingUp, label: "Markets", action: "markets" as const },
  { icon: SlidersHorizontal, label: "Filters", action: "filters" as const },
];

export function DashboardMockup({ onChatClick }: DashboardMockupProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"dashboard" | "analytics" | "filters" | "markets">("dashboard");
  const [filterIndustry, setFilterIndustry] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMetric, setFilterMetric] = useState("Revenue");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["NVDA", "MSFT", "AAPL"]);

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

  const toggleStock = (ticker: string) => {
    setSelectedStocks((prev) =>
      prev.includes(ticker) ? prev.filter((s) => s !== ticker) : [...prev, ticker]
    );
  };

  const handleItemClick = (item: typeof sidebarItems[0]) => {
    if (item.action === "chat") onChatClick();
    else if (item.action === "leads") navigate("/leads");
    else if (item.action === "analytics") setActiveView("analytics");
    else if (item.action === "markets") setActiveView("markets");
    else if (item.action === "filters") setShowFilters(!showFilters);
    else setActiveView("dashboard");
  };

  const renderMarkets = () => (
    <div className="px-6 pb-6 space-y-4 pt-4">
      {/* Stock ticker toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.keys(stockColors).map((ticker) => (
          <button
            key={ticker}
            onClick={() => toggleStock(ticker)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedStocks.includes(ticker)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {ticker}
          </button>
        ))}
      </div>

      {/* Stock chart */}
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Weekly Stock Performance</h4>
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              {selectedStocks.map((ticker) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  stroke={stockColors[ticker]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Industry trends table */}
      <div className="rounded-xl border border-border p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Industry Sector Trends</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 font-medium">Sector</th>
                <th className="text-right py-2 font-medium">Growth</th>
                <th className="text-right py-2 font-medium">Sentiment</th>
                <th className="text-right py-2 font-medium">Market Cap</th>
                <th className="text-right py-2 font-medium">Top Pick</th>
              </tr>
            </thead>
            <tbody>
              {industryTrends.map((row) => (
                <tr key={row.sector} className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">{row.sector}</td>
                  <td className="py-2 text-right">
                    <span className="inline-flex items-center text-accent font-semibold">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      {row.growth}%
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      row.sentiment === "Bullish"
                        ? "bg-accent/20 text-accent"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {row.sentiment}
                    </span>
                  </td>
                  <td className="py-2 text-right text-muted-foreground">{row.marketCap}</td>
                  <td className="py-2 text-right font-semibold text-primary">{row.topPick}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Investment Insights */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">AI Investment Strategy</h4>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>🚀 <span className="font-medium text-foreground">Top Opportunity:</span> AI/ML sector leads with 34.2% growth — NVDA showing strongest momentum with 6.8% weekly gain. Consider increasing allocation.</p>
          <p>🏥 <span className="font-medium text-foreground">Emerging Play:</span> HealthTech at 20.4% growth is under-allocated by most funds. ISRG offers a strong entry with surgical robotics expansion.</p>
          <p>☁️ <span className="font-medium text-foreground">Steady Compounder:</span> Cloud Infrastructure remains resilient at 22.8% growth. MSFT benefits from Azure + AI integration — a defensive growth pick.</p>
          <p>⚠️ <span className="font-medium text-foreground">Caution:</span> E-Commerce growth at 12.1% is decelerating. Avoid overweight positions until consumer spending data improves in Q2.</p>
          <p className="text-foreground font-medium">💡 <span className="text-primary">Strategy:</span> 40% AI/Cloud, 25% HealthTech, 20% FinTech, 15% diversified — rebalance monthly based on earnings momentum.</p>
        </div>
      </div>
    </div>
  );

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
                      (item.action === "markets" && activeView === "markets") ||
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
                  <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                    {(["dashboard", "analytics", "markets"] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          activeView === view ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {view === "dashboard" ? "Overview" : view === "analytics" ? "Analytics" : "Markets"}
                      </button>
                    ))}
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
              {showFilters && activeView !== "markets" && (
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

              {activeView === "markets" ? (
                renderMarkets()
              ) : (
                <>
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
                    <div className="px-6 pb-6 space-y-4">
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
