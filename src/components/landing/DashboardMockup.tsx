import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardMockupProps {
  onChatClick: () => void;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads", action: "leads" },
  { icon: MessageCircle, label: "Chat", action: "chat" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { label: "Active Leads", value: "1,284", change: "+12.5%", up: true },
  { label: "Conversion Rate", value: "34.2%", change: "+2.1%", up: true },
  { label: "Avg. Deal Size", value: "$48.5K", change: "-1.3%", up: false },
  { label: "Revenue (MTD)", value: "$2.4M", change: "+18.7%", up: true },
];

export function DashboardMockup({ onChatClick }: DashboardMockupProps) {
  const navigate = useNavigate();

  const handleItemClick = (item: typeof sidebarItems[0]) => {
    if (item.action === "chat") onChatClick();
    if (item.action === "leads") navigate("/leads");
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
                      item.active
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
            <div className="flex-1 min-h-[380px]">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Search leads, deals…</span>
                </div>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <span
                      className={`inline-flex items-center text-xs font-medium mt-1 ${
                        s.up ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {s.up ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {s.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="px-6 pb-6">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-foreground">Pipeline Trend</h4>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  {/* Simple bar chart visualization */}
                  <div className="flex items-end gap-2 h-28">
                    {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-primary/20 hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground">Jan</span>
                    <span className="text-[10px] text-muted-foreground">Dec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
